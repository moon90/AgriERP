using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class StockBatch : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid StockItemId { get; private set; }
        public Guid WarehouseId { get; private set; }
        public string BatchNumber { get; private set; } // Lot / Batch code
        public decimal Quantity { get; private set; }
        public decimal CostBasis { get; private set; } // Price paid per unit
        public DateTime? ExpirationDate { get; private set; }
        public DateTime ReceivedAt { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected StockBatch() 
        {
            BatchNumber = null!;
        }

        public StockBatch(Guid tenantId, Guid stockItemId, Guid warehouseId, string batchNumber, decimal quantity, decimal costBasis, DateTime? expirationDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            StockItemId = stockItemId;
            WarehouseId = warehouseId;
            BatchNumber = batchNumber ?? throw new ArgumentNullException(nameof(batchNumber));
            Quantity = quantity >= 0 ? quantity : throw new ArgumentException("Quantity cannot be negative.");
            CostBasis = costBasis >= 0 ? costBasis : throw new ArgumentException("Cost basis cannot be negative.");
            ExpirationDate = expirationDate;
            ReceivedAt = DateTime.UtcNow;
        }

        public void AddQuantity(decimal quantity)
        {
            if (quantity <= 0) throw new ArgumentException("Quantity to add must be positive.");
            Quantity += quantity;
        }

        public void DeductQuantity(decimal quantity)
        {
            if (quantity <= 0) throw new ArgumentException("Quantity to deduct must be positive.");
            if (Quantity - quantity < 0) throw new InvalidOperationException("Insufficient stock in this batch.");
            Quantity -= quantity;
        }
    }
}
