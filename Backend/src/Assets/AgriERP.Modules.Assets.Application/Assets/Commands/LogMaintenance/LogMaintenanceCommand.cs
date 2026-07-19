using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Assets.Application.Common;
using AgriERP.Modules.Assets.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Application.Assets.Commands.LogMaintenance
{
    public record LogMaintenanceCommand(
        Guid AssetId,
        string ServiceType,
        DateTime ServiceDate,
        decimal Cost,
        string PerformedBy,
        string Description,
        decimal? RuntimeHoursAtService,
        decimal? OdometerKmAtService
    ) : IRequest<Guid>;

    public class LogMaintenanceCommandHandler : IRequestHandler<LogMaintenanceCommand, Guid>
    {
        private readonly IAssetsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogMaintenanceCommandHandler(
            IAssetsDbContext context, 
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogMaintenanceCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var asset = await _context.Assets
                .FirstOrDefaultAsync(a => a.Id == request.AssetId, cancellationToken);
            if (asset == null)
            {
                throw new InvalidOperationException($"Asset with ID '{request.AssetId}' does not exist.");
            }

            // Update metrics
            asset.UpdateMetrics(request.RuntimeHoursAtService, request.OdometerKmAtService);

            var log = new MaintenanceLog(
                tenantId,
                request.AssetId,
                request.ServiceType,
                request.ServiceDate,
                request.Cost,
                request.PerformedBy,
                request.Description,
                request.RuntimeHoursAtService,
                request.OdometerKmAtService
            );

            await _context.MaintenanceLogs.AddAsync(log, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Dispatch integration event to finance for maintenance expenditure if cost > 0
            if (request.Cost > 0)
            {
                var maintenanceEvent = new AssetMaintenanceLoggedIntegrationEvent(
                    tenantId,
                    asset.Name,
                    request.Cost,
                    request.ServiceDate
                );
                await _publisher.Publish(maintenanceEvent, cancellationToken);
            }

            return log.Id;
        }
    }
}
