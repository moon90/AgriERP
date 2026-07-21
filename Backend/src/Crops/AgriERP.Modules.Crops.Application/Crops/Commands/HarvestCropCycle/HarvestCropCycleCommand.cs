using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Crops.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Crops.Commands.HarvestCropCycle
{
    public record HarvestCropCycleCommand(
        Guid CropCycleId,
        DateTime HarvestDate,
        decimal ActualYieldTons
    ) : IRequest<bool>;

    public class HarvestCropCycleCommandHandler : IRequestHandler<HarvestCropCycleCommand, bool>
    {
        private readonly ICropsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public HarvestCropCycleCommandHandler(
            ICropsDbContext context, 
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<bool> Handle(HarvestCropCycleCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var cycle = await _context.CropCycles
                .FirstOrDefaultAsync(c => c.Id == request.CropCycleId && c.TenantId == tenantId, cancellationToken);
            
            if (cycle == null)
            {
                throw new InvalidOperationException($"Crop cycle with ID '{request.CropCycleId}' does not exist.");
            }

            // Close planting season
            cycle.Harvest(request.HarvestDate, request.ActualYieldTons);
            await _context.SaveChangesAsync(cancellationToken);

            // Publish integration event to transfer Crop WIP Asset (1410) to Finished Crop Stock (1210)
            if (cycle.AccumulatedWipCost > 0)
            {
                var harvestedEvent = new CropCycleHarvestedIntegrationEvent(
                    tenantId,
                    cycle.CropType,
                    cycle.AccumulatedWipCost,
                    request.HarvestDate
                );
                await _publisher.Publish(harvestedEvent, cancellationToken);
            }

            return true;
        }
    }
}
