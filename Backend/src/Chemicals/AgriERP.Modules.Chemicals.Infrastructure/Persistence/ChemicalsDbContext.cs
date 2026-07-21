using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Chemicals.Application.Common;
using AgriERP.Modules.Chemicals.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Chemicals.Infrastructure.Persistence
{
    public class ChemicalsDbContext : ApplicationDbContext, IChemicalsDbContext
    {
        public DbSet<ChemicalProduct> ChemicalProducts { get; set; }
        public DbSet<ApplicationLog> ApplicationLogs { get; set; }

        public ChemicalsDbContext(
            DbContextOptions<ChemicalsDbContext> options,
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
            modelBuilder.HasDefaultSchema("chemicals");

            modelBuilder.Entity<ChemicalProduct>(entity =>
            {
                entity.ToTable("ChemicalProducts");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.StockQuantityLiters).HasPrecision(18, 2);
                entity.Property(e => e.CostPerLiter).HasPrecision(18, 2);
            });

            modelBuilder.Entity<ApplicationLog>(entity =>
            {
                entity.ToTable("ApplicationLogs");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.QuantityAppliedLiters).HasPrecision(18, 2);
                entity.Property(e => e.AreaTreatedAcres).HasPrecision(18, 2);
                entity.Property(e => e.DosagePerAcre).HasPrecision(18, 2);
                entity.HasIndex(e => e.ChemicalProductId);
                entity.HasIndex(e => e.FieldId);
            });
        }
    }
}
