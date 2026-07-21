using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Agronomy.Application.Common;
using AgriERP.Modules.Agronomy.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Agronomy.Infrastructure.Persistence
{
    public class AgronomyDbContext : ApplicationDbContext, IAgronomyDbContext
    {
        public DbSet<SoilSample> SoilSamples { get; set; }
        public DbSet<AgronomyRecommendation> AgronomyRecommendations { get; set; }
        public DbSet<LabTestingBilling> LabTestingBillings { get; set; }

        public AgronomyDbContext(
            DbContextOptions<AgronomyDbContext> options,
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
            modelBuilder.HasDefaultSchema("agronomy");

            modelBuilder.Entity<SoilSample>(entity =>
            {
                entity.ToTable("SoilSamples");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.PhLevel).HasPrecision(18, 2);
                entity.Property(e => e.NitrogenPpm).HasPrecision(18, 2);
                entity.Property(e => e.PhosphorusPpm).HasPrecision(18, 2);
                entity.Property(e => e.PotassiumPpm).HasPrecision(18, 2);
                entity.Property(e => e.OrganicMatterPercentage).HasPrecision(18, 2);
            });

            modelBuilder.Entity<AgronomyRecommendation>(entity =>
            {
                entity.ToTable("AgronomyRecommendations");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.TargetApplicationRate).HasPrecision(18, 2);
                entity.HasIndex(e => e.SoilSampleId);
            });

            modelBuilder.Entity<LabTestingBilling>(entity =>
            {
                entity.ToTable("LabTestingBillings");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.TestFee).HasPrecision(18, 2);
                entity.HasIndex(e => e.SoilSampleId);
            });
        }
    }
}
