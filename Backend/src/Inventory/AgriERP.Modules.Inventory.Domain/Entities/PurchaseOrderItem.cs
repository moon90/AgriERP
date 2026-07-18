using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class PurchaseOrderItem : Entity
    {
        public Guid PurchaseOrderId { get; private set; }
        public Guid StockItemId { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal TotalAmount { get; private set; }

        protected PurchaseOrderItem() { }

        public PurchaseOrderItem(Guid purchaseOrderId, Guid stockItemId, decimal quantity, decimal unitPrice)
        {
            Id = Guid.NewGuid();
            PurchaseOrderId = purchaseOrderId;
            StockItemId = stockItemId;
            Quantity = quantity > 0 ? quantity : throw new ArgumentException("Quantity must be greater than zero.");
            UnitPrice = unitPrice >= 0 ? unitPrice : throw new ArgumentException("Unit price cannot be negative.");
            TotalAmount = Quantity * UnitPrice;
        }

        public void UpdateQuantity(decimal quantity)
        {
            Quantity = quantity > 0 ? quantity : throw new ArgumentException("Quantity must be greater than zero.");
            TotalAmount = Quantity * UnitPrice;
        }
    }
}
