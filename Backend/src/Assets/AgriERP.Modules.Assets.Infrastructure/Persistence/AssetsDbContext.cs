using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Assets.Application.Common;
using AgriERP.Modules.Assets.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Assets.Infrastructure.Persistence
{
    public class AssetsDbContext : ApplicationDbContext, IAssetsDbContext
    {
        public DbSet<Asset> Assets { get; set; }
        public DbSet<MaintenanceLog> MaintenanceLogs { get; set; }

        public AssetsDbContext(
            DbContextOptions<AssetsDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Schema boundary mapping
            modelBuilder.HasDefaultSchema("assets");

            modelBuilder.Entity<Asset>(entity =>
            {
                entity.ToTable("Assets");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.AssetNumber }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.PurchasePrice).HasPrecision(18, 2);
                entity.Property(e => e.AccumulatedDepreciation).HasPrecision(18, 2);
                entity.Property(e => e.CurrentRuntimeHours).HasPrecision(18, 2);
                entity.Property(e => e.CurrentOdometerKm).HasPrecision(18, 2);
            });

            modelBuilder.Entity<MaintenanceLog>(entity =>
            {
                entity.ToTable("MaintenanceLogs");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.Cost).HasPrecision(18, 2);
                entity.Property(e => e.RuntimeHoursAtService).HasPrecision(18, 2);
                entity.Property(e => e.OdometerKmAtService).HasPrecision(18, 2);
                entity.HasIndex(e => e.AssetId);
            });
        }
    }
}
