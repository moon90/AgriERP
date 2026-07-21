using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Logistics.Application.Common;
using AgriERP.Modules.Logistics.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace AgriERP.Modules.Logistics.Infrastructure.Persistence
{
    public class LogisticsDbContext : ApplicationDbContext, ILogisticsDbContext
    {
        public DbSet<Elevator> Elevators { get; set; }
        public DbSet<WeighbridgeTicket> WeighbridgeTickets { get; set; }
        public DbSet<StorageCharge> StorageCharges { get; set; }

        public LogisticsDbContext(
            DbContextOptions<LogisticsDbContext> options,
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
            modelBuilder.HasDefaultSchema("logistics");

            modelBuilder.Entity<Elevator>(entity =>
            {
                entity.ToTable("Elevators");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.CapacityTons).HasPrecision(18, 2);
                entity.Property(e => e.CurrentStoredTons).HasPrecision(18, 2);
                entity.Property(e => e.RentalRatePerTonPerDay).HasPrecision(18, 4);
            });

            modelBuilder.Entity<WeighbridgeTicket>(entity =>
            {
                entity.ToTable("WeighbridgeTickets");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.GrossWeightTons).HasPrecision(18, 2);
                entity.Property(e => e.TareWeightTons).HasPrecision(18, 2);
                entity.Property(e => e.NetWeightTons).HasPrecision(18, 2);
                entity.Property(e => e.MoisturePercentage).HasPrecision(18, 2);
                entity.Property(e => e.ImpurityPercentage).HasPrecision(18, 2);
                entity.Property(e => e.FinalBillableWeightTons).HasPrecision(18, 2);
                entity.HasIndex(e => e.ElevatorId);
            });

            modelBuilder.Entity<StorageCharge>(entity =>
            {
                entity.ToTable("StorageCharges");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.TotalCharge).HasPrecision(18, 2);
                entity.HasIndex(e => e.WeighbridgeTicketId);
            });
        }
    }
}
