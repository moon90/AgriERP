using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Land.Application.Common;
using AgriERP.Modules.Land.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Land.Infrastructure.Persistence
{
    public class LandDbContext : ApplicationDbContext, ILandDbContext
    {
        public DbSet<LandLease> LandLeases { get; set; }
        public DbSet<LeasePayment> LeasePayments { get; set; }
        public DbSet<Parcel> Parcels { get; set; }
        public DbSet<CropShareSplit> CropShareSplits { get; set; }

        public LandDbContext(
            DbContextOptions<LandDbContext> options,
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
            modelBuilder.HasDefaultSchema("land");

            modelBuilder.Entity<LandLease>(entity =>
            {
                entity.ToTable("LandLeases");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.CashRentPerAcre).HasPrecision(18, 2);
                entity.Property(e => e.AreaAcres).HasPrecision(18, 2);
                entity.Property(e => e.LandlordSharePercentage).HasPrecision(18, 4);
            });

            modelBuilder.Entity<LeasePayment>(entity =>
            {
                entity.ToTable("LeasePayments");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.Amount).HasPrecision(18, 2);
                entity.HasIndex(e => e.LandLeaseId);
            });

            modelBuilder.Entity<Parcel>(entity =>
            {
                entity.ToTable("Parcels");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasIndex(e => new { e.TenantId, e.ParcelNumber }).IsUnique();
            });

            modelBuilder.Entity<CropShareSplit>(entity =>
            {
                entity.ToTable("CropShareSplits");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasIndex(e => e.LandLeaseId);
            });
        }
    }
}
