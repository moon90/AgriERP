using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Irrigation.Application.Common;
using AgriERP.Modules.Irrigation.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Irrigation.Infrastructure.Persistence
{
    public class IrrigationDbContext : ApplicationDbContext, IIrrigationDbContext
    {
        public DbSet<WaterSource> WaterSources { get; set; }
        public DbSet<IrrigationLog> IrrigationLogs { get; set; }
        public DbSet<WaterUsageBilling> WaterUsageBillings { get; set; }

        public IrrigationDbContext(
            DbContextOptions<IrrigationDbContext> options,
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
            modelBuilder.HasDefaultSchema("irrigation");

            modelBuilder.Entity<WaterSource>(entity =>
            {
                entity.ToTable("WaterSources");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.MaxAllocatedGallons).HasPrecision(18, 2);
                entity.Property(e => e.UsedGallons).HasPrecision(18, 2);
            });

            modelBuilder.Entity<IrrigationLog>(entity =>
            {
                entity.ToTable("IrrigationLogs");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.GallonsPumped).HasPrecision(18, 2);
                entity.Property(e => e.FlowRateGpm).HasPrecision(18, 2);
                entity.HasIndex(e => e.WaterSourceId);
                entity.HasIndex(e => e.FieldId);
            });

            modelBuilder.Entity<WaterUsageBilling>(entity =>
            {
                entity.ToTable("WaterUsageBillings");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.GallonsUsed).HasPrecision(18, 2);
                entity.Property(e => e.CostPerGallon).HasPrecision(18, 4);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.HasIndex(e => e.WaterSourceId);
            });
        }
    }
}
