using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Telemetry.Application.Common;
using AgriERP.Modules.Telemetry.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Application.Geofences.Commands.CreateGeofence
{
    public class CreateGeofenceCommandHandler : IRequestHandler<CreateGeofenceCommand, Guid>
    {
        private readonly ITelemetryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateGeofenceCommandHandler(ITelemetryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateGeofenceCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var geofence = new GeofenceZone(
                tenantId,
                request.Name,
                request.MinLatitude,
                request.MaxLatitude,
                request.MinLongitude,
                request.MaxLongitude
            );

            _context.GeofenceZones.Add(geofence);
            await _context.SaveChangesAsync(cancellationToken);

            return geofence.Id;
        }
    }
}
