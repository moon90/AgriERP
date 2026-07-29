using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Insurance.Application.Common;
using AgriERP.Modules.Insurance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Insurance.Infrastructure.Persistence
{
    public class InsuranceDbContext : ApplicationDbContext, IInsuranceDbContext
    {
        public DbSet<InsurancePolicy> InsurancePolicies { get; set; }
        public DbSet<LossClaim> LossClaims { get; set; }
        public DbSet<InsurancePremiumBilling> InsurancePremiumBillings { get; set; }
        public DbSet<Adjustment> Adjustments { get; set; }

        public InsuranceDbContext(
            DbContextOptions<InsuranceDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasDefaultSchema("insurance");

            modelBuilder.Entity<InsurancePolicy>(entity =>
            {
                entity.ToTable("InsurancePolicies");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.CoverageAmount).HasPrecision(18, 2);
                entity.Property(e => e.PremiumAmount).HasPrecision(18, 2);
                entity.HasIndex(e => e.FieldId);
            });

            modelBuilder.Entity<LossClaim>(entity =>
            {
                entity.ToTable("LossClaims");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.ClaimAmount).HasPrecision(18, 2);
                entity.Property(e => e.AdjustedAmount).HasPrecision(18, 2);
                entity.HasIndex(e => e.InsurancePolicyId);
            });

            modelBuilder.Entity<InsurancePremiumBilling>(entity =>
            {
                entity.ToTable("InsurancePremiumBillings");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.PremiumFee).HasPrecision(18, 2);
                entity.HasIndex(e => e.InsurancePolicyId);
            });

            modelBuilder.Entity<Adjustment>(entity =>
            {
                entity.ToTable("Adjustments");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.AssessedLossAmount).HasPrecision(18, 2);
                entity.Property(e => e.SettlementAmount).HasPrecision(18, 2);
                entity.HasIndex(e => e.LossClaimId);
            });
        }
    }
}
