using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Telemetry.Application.Common;
using AgriERP.Modules.Telemetry.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Application.Geofences.Commands.LogAnimalLocation
{
    public class LogAnimalLocationCommandHandler : IRequestHandler<LogAnimalLocationCommand, Guid>
    {
        private readonly ITelemetryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public LogAnimalLocationCommandHandler(ITelemetryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(LogAnimalLocationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // Fetch the active geofence zone for this tenant
            var geofence = await _context.GeofenceZones
                .Where(z => z.TenantId == tenantId && z.IsActive)
                .FirstOrDefaultAsync(cancellationToken);

            var isWithinBounds = true;
            if (geofence != null)
            {
                isWithinBounds = geofence.IsCoordinateWithinBounds(request.Latitude, request.Longitude);
            }

            var log = new AnimalLocationLog(tenantId, request.AnimalId, request.Latitude, request.Longitude, isWithinBounds);
            _context.AnimalLocationLogs.Add(log);
            await _context.SaveChangesAsync(cancellationToken);

            return log.Id;
        }
    }
}
