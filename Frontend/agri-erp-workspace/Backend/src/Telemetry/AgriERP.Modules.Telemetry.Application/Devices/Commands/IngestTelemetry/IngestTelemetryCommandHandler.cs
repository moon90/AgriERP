using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Telemetry.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Application.Devices.Commands.IngestTelemetry
{
    public class IngestTelemetryCommandHandler : IRequestHandler<IngestTelemetryCommand>
    {
        private readonly ITelemetryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public IngestTelemetryCommandHandler(ITelemetryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(IngestTelemetryCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var device = await _context.IotDevices
                .Include(d => d.Readings)
                .FirstOrDefaultAsync(d => d.Id == request.DeviceId && d.TenantId == tenantId, cancellationToken);

            if (device == null)
                throw new ArgumentException("Device not found.");

            device.IngestReading(request.MetricName, request.MetricValue);

            // Business Rule Automation: Trigger irrigation actuator if moisture drops below 30.0%
            if (request.MetricName.Equals("SoilMoisture", StringComparison.OrdinalIgnoreCase) && request.MetricValue < 30.0m)
            {
                device.UpdateStatus("Actuator_Triggered_Irrigation");
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
