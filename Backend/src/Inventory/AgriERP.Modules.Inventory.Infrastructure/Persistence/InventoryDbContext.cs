using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Inventory.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;

namespace AgriERP.Modules.Inventory.Infrastructure.Persistence
{
    public class InventoryDbContext : ApplicationDbContext
    {
        public DbSet<MeatStock> MeatStocks { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<StockItem> StockItems { get; set; }
        public DbSet<StockBatch> StockBatches { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesOrderItem> SalesOrderItems { get; set; }

        public InventoryDbContext(
            DbContextOptions<InventoryDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Separate schema for Inventory module
            modelBuilder.HasDefaultSchema("inventory");

            modelBuilder.Entity<MeatStock>(entity =>
            {
                entity.ToTable("MeatStocks");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalQuantityKg).HasPrecision(18, 2);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<Warehouse>(entity =>
            {
                entity.ToTable("Warehouses");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<StockItem>(entity =>
            {
                entity.ToTable("StockItems");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ReorderLevel).HasPrecision(18, 2);
                entity.HasIndex(e => new { e.TenantId, e.SKU }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<StockBatch>(entity =>
            {
                entity.ToTable("StockBatches");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.Property(e => e.CostBasis).HasPrecision(18, 2);
                entity.HasIndex(e => new { e.TenantId, e.BatchNumber }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.ToTable("StockMovements");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<PurchaseOrder>(entity =>
            {
                entity.ToTable("PurchaseOrders");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasMany(e => e.Items)
                      .WithOne()
                      .HasForeignKey(i => i.PurchaseOrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PurchaseOrderItem>(entity =>
            {
                entity.ToTable("PurchaseOrderItems");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });

            modelBuilder.Entity<SalesOrder>(entity =>
            {
                entity.ToTable("SalesOrders");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasMany(e => e.Items)
                      .WithOne()
                      .HasForeignKey(i => i.SalesOrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<SalesOrderItem>(entity =>
            {
                entity.ToTable("SalesOrderItems");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
                entity.Property(e => e.UnitPrice).HasPrecision(18, 2);
                entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            });
        }
    }
}
