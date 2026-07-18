using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Telemetry.Application.Common;
using AgriERP.Modules.Telemetry.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Infrastructure.Persistence
{
    public class TelemetryDbContext : ApplicationDbContext, ITelemetryDbContext
    {
        public DbSet<IotDevice> IotDevices { get; set; }
        public DbSet<TelemetryReading> TelemetryReadings { get; set; }
        public DbSet<GeofenceZone> GeofenceZones { get; set; }
        public DbSet<AnimalLocationLog> AnimalLocationLogs { get; set; }

        public TelemetryDbContext(
            DbContextOptions<TelemetryDbContext> options, 
            ITenantProvider tenantProvider, 
            IPublisher publisher, 
            ICurrentUserProvider currentUserProvider) 
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Database Schema-per-Module Setup (Telemetry module is under 'telemetry' schema)
            modelBuilder.HasDefaultSchema("telemetry");

            // IoT Device Entity Configuration
            modelBuilder.Entity<IotDevice>(entity =>
            {
                entity.ToTable("IotDevices");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
                entity.HasMany(e => e.Readings)
                      .WithOne()
                      .HasForeignKey(r => r.DeviceId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Telemetry Reading Entity Configuration
            modelBuilder.Entity<TelemetryReading>(entity =>
            {
                entity.ToTable("TelemetryReadings");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MetricValue).HasPrecision(18, 4);
            });

            // Geofence Zone Entity Configuration
            modelBuilder.Entity<GeofenceZone>(entity =>
            {
                entity.ToTable("GeofenceZones");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);

                // GPS Coordinate Precision limits
                entity.Property(e => e.MinLatitude).HasPrecision(18, 8);
                entity.Property(e => e.MaxLatitude).HasPrecision(18, 8);
                entity.Property(e => e.MinLongitude).HasPrecision(18, 8);
                entity.Property(e => e.MaxLongitude).HasPrecision(18, 8);
            });

            // Animal Location Log Entity Configuration
            modelBuilder.Entity<AnimalLocationLog>(entity =>
            {
                entity.ToTable("AnimalLocationLogs");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);

                // GPS Coordinate Precision limits
                entity.Property(e => e.Latitude).HasPrecision(18, 8);
                entity.Property(e => e.Longitude).HasPrecision(18, 8);
            });
        }
    }
}
