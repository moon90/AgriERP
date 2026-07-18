using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Telemetry.Application.Common;
using AgriERP.Modules.Telemetry.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Application.Devices.Commands.RegisterDevice
{
    public class RegisterDeviceCommandHandler : IRequestHandler<RegisterDeviceCommand, Guid>
    {
        private readonly ITelemetryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public RegisterDeviceCommandHandler(ITelemetryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
           }

        public async Task<Guid> Handle(RegisterDeviceCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var device = new IotDevice(tenantId, request.Name, request.DeviceType);
            _context.IotDevices.Add(device);
            await _context.SaveChangesAsync(cancellationToken);

            return device.Id;
        }
    }
}
