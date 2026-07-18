using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class SalesOrderItem : Entity
    {
        public Guid SalesOrderId { get; private set; }
        public Guid StockItemId { get; private set; }
        public decimal Quantity { get; private set; }
        public decimal UnitPrice { get; private set; }
        public decimal TotalAmount { get; private set; }

        protected SalesOrderItem() { }

        public SalesOrderItem(Guid salesOrderId, Guid stockItemId, decimal quantity, decimal unitPrice)
        {
            Id = Guid.NewGuid();
            SalesOrderId = salesOrderId;
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
