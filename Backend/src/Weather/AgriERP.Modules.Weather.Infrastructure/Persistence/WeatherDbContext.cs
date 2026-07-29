using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Weather.Infrastructure.Persistence
{
    public class WeatherDbContext : ApplicationDbContext, IWeatherDbContext
    {
        public DbSet<WeatherStation> WeatherStations { get; set; }
        public DbSet<WeatherReading> WeatherReadings { get; set; }
        public DbSet<FrostAlertConfig> FrostAlertConfigs { get; set; }
        public DbSet<WeatherSubscriptionBilling> WeatherSubscriptionBillings { get; set; }
        public DbSet<GDDAccumulation> GDDAccumulations { get; set; }

        public WeatherDbContext(
            DbContextOptions<WeatherDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Set Schema Boundary
            modelBuilder.HasDefaultSchema("weather");

            modelBuilder.Entity<WeatherStation>(entity =>
            {
                entity.ToTable("WeatherStations");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.LocationLatitude).HasPrecision(18, 6);
                entity.Property(e => e.LocationLongitude).HasPrecision(18, 6);
            });

            modelBuilder.Entity<WeatherReading>(entity =>
            {
                entity.ToTable("WeatherReadings");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.TemperatureCelsius).HasPrecision(18, 2);
                entity.Property(e => e.HumidityPercentage).HasPrecision(18, 2);
                entity.Property(e => e.WindSpeedKph).HasPrecision(18, 2);
                entity.Property(e => e.PrecipitationMm).HasPrecision(18, 2);
                entity.Property(e => e.SoilMoisturePercentage).HasPrecision(18, 2);
                entity.HasIndex(e => e.WeatherStationId);
            });

            modelBuilder.Entity<FrostAlertConfig>(entity =>
            {
                entity.ToTable("FrostAlertConfigs");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.TemperatureThreshold).HasPrecision(18, 2);
                entity.HasIndex(e => e.FieldId);
            });

            modelBuilder.Entity<WeatherSubscriptionBilling>(entity =>
            {
                entity.ToTable("WeatherSubscriptionBillings");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.SubscriptionFee).HasPrecision(18, 2);
            });

            modelBuilder.Entity<GDDAccumulation>(entity =>
            {
                entity.ToTable("GDDAccumulations");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasIndex(e => e.CropFieldId);
            });
        }
    }
}
