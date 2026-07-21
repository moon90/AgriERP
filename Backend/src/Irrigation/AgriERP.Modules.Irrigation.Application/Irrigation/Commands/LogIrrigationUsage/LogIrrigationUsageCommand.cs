using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Irrigation.Application.Common;
using AgriERP.Modules.Irrigation.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Irrigation.Application.Irrigation.Commands.LogIrrigationUsage
{
    public record LogIrrigationUsageCommand(
        Guid WaterSourceId,
        Guid FieldId,
        decimal GallonsPumped,
        decimal FlowRateGpm,
        decimal CostPerGallon,
        DateTime IrrigationDate,
        string Notes
    ) : IRequest<Guid>;

    public class LogIrrigationUsageCommandHandler : IRequestHandler<LogIrrigationUsageCommand, Guid>
    {
        private readonly IIrrigationDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogIrrigationUsageCommandHandler(
            IIrrigationDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogIrrigationUsageCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var source = await _context.WaterSources
                .FirstOrDefaultAsync(s => s.Id == request.WaterSourceId && s.TenantId == tenantId, cancellationToken);

            if (source == null)
            {
                throw new InvalidOperationException($"Water source with ID '{request.WaterSourceId}' does not exist.");
            }

            // 1. Update source usage
            source.LogUsage(request.GallonsPumped);

            // 2. Add Irrigation log
            var log = new IrrigationLog(
                tenantId,
                request.WaterSourceId,
                request.FieldId,
                request.GallonsPumped,
                request.FlowRateGpm,
                request.IrrigationDate,
                request.Notes
            );
            await _context.IrrigationLogs.AddAsync(log, cancellationToken);

            // 3. Add Water Utility Billing
            var billing = new WaterUsageBilling(
                tenantId,
                request.WaterSourceId,
                request.GallonsPumped,
                request.CostPerGallon,
                request.IrrigationDate
            );
            await _context.WaterUsageBillings.AddAsync(billing, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            // 4. Publish integration event for finance ledger expense postings
            if (billing.Amount > 0)
            {
                var billedEvent = new WaterUsageBilledIntegrationEvent(
                    tenantId,
                    billing.Amount,
                    source.SourceName,
                    source.PermitNumber,
                    request.IrrigationDate
                );
                await _publisher.Publish(billedEvent, cancellationToken);
            }

            return log.Id;
        }
    }
}
