using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Trading.Application.Common;
using AgriERP.Modules.Trading.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Trading.Infrastructure.Persistence
{
    public class TradingDbContext : ApplicationDbContext, ITradingDbContext
    {
        public DbSet<SalesContract> SalesContracts { get; set; }
        public DbSet<HedgingPosition> HedgingPositions { get; set; }

        public TradingDbContext(
            DbContextOptions<TradingDbContext> options,
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
            modelBuilder.HasDefaultSchema("trading");

            modelBuilder.Entity<SalesContract>(entity =>
            {
                entity.ToTable("SalesContracts");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.ContractPricePerTon).HasPrecision(18, 2);
                entity.Property(e => e.QuantityTons).HasPrecision(18, 2);
                entity.Property(e => e.DeliveredQuantityTons).HasPrecision(18, 2);
            });

            modelBuilder.Entity<HedgingPosition>(entity =>
            {
                entity.ToTable("HedgingPositions");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.EntryPricePerTon).HasPrecision(18, 2);
                entity.Property(e => e.ExitPricePerTon).HasPrecision(18, 2);
                entity.Property(e => e.CurrentMarketPricePerTon).HasPrecision(18, 2);
                entity.Property(e => e.RealizedPnl).HasPrecision(18, 2);
            });
        }
    }
}
