using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Crops.Infrastructure.Persistence
{
    public class CropsDbContext : ApplicationDbContext, ICropsDbContext
    {
        public DbSet<CropField> CropFields { get; set; }
        public DbSet<CropCycle> CropCycles { get; set; }
        public DbSet<FieldActivity> FieldActivities { get; set; }

        public CropsDbContext(
            DbContextOptions<CropsDbContext> options,
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
            modelBuilder.HasDefaultSchema("crops");

            modelBuilder.Entity<CropField>(entity =>
            {
                entity.ToTable("CropFields");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.AreaAcres).HasPrecision(18, 2);
            });

            modelBuilder.Entity<CropCycle>(entity =>
            {
                entity.ToTable("CropCycles");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.ExpectedYieldTons).HasPrecision(18, 2);
                entity.Property(e => e.ActualYieldTons).HasPrecision(18, 2);
                entity.Property(e => e.AccumulatedWipCost).HasPrecision(18, 2);
                entity.HasIndex(e => e.FieldId);
            });

            modelBuilder.Entity<FieldActivity>(entity =>
            {
                entity.ToTable("FieldActivities");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.Cost).HasPrecision(18, 2);
                entity.Property(e => e.InputQuantity).HasPrecision(18, 2);
                entity.HasIndex(e => e.CropCycleId);
            });
        }
    }
}
