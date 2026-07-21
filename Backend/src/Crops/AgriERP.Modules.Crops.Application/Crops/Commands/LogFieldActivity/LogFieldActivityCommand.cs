using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Crops.Commands.LogFieldActivity
{
    public record LogFieldActivityCommand(
        Guid CropCycleId,
        string ActivityType,
        DateTime ActivityDate,
        decimal Cost,
        Guid? InputMaterialId,
        decimal? InputQuantity,
        string Notes
    ) : IRequest<Guid>;

    public class LogFieldActivityCommandHandler : IRequestHandler<LogFieldActivityCommand, Guid>
    {
        private readonly ICropsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogFieldActivityCommandHandler(
            ICropsDbContext context, 
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogFieldActivityCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Fetch Crop Cycle
            var cycle = await _context.CropCycles
                .FirstOrDefaultAsync(c => c.Id == request.CropCycleId && c.TenantId == tenantId, cancellationToken);
            if (cycle == null)
            {
                throw new InvalidOperationException($"Crop cycle with ID '{request.CropCycleId}' does not exist.");
            }

            // 2. Fetch associated Field to get area and soil properties for dynamic forecasting
            var field = await _context.CropFields
                .FirstOrDefaultAsync(f => f.Id == cycle.FieldId && f.TenantId == tenantId, cancellationToken);
            if (field == null)
            {
                throw new InvalidOperationException($"Crop field associated with cycle does not exist.");
            }

            // 3. Register activity on crop cycle aggregate and accumulate cost
            cycle.RegisterActivity(request.ActivityType, field.AreaAcres, field.SoilType);
            cycle.AccumulateCost(request.Cost);

            // 4. Create and persist field activity log
            var activity = new FieldActivity(
                tenantId,
                request.CropCycleId,
                request.ActivityType,
                request.ActivityDate,
                request.Cost,
                request.InputMaterialId,
                request.InputQuantity,
                request.Notes
            );

            await _context.FieldActivities.AddAsync(activity, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // 5. Dispatch integration event to General Ledger if costs are incurred
            if (request.Cost > 0)
            {
                var loggedEvent = new CropActivityLoggedIntegrationEvent(
                    tenantId,
                    cycle.CropType,
                    request.ActivityType,
                    request.Cost,
                    request.InputMaterialId.HasValue, // is material item consumption
                    request.ActivityDate
                );
                await _publisher.Publish(loggedEvent, cancellationToken);
            }

            return activity.Id;
        }
    }
}
