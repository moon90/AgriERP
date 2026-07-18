using AgriERP.Modules.Telemetry.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Application.Common
{
    public interface ITelemetryDbContext
    {
        DbSet<IotDevice> IotDevices { get; }
        DbSet<TelemetryReading> TelemetryReadings { get; }
        DbSet<GeofenceZone> GeofenceZones { get; }
        DbSet<AnimalLocationLog> AnimalLocationLogs { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
