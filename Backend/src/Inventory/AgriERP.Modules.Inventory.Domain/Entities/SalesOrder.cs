using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class SalesOrder : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid CustomerId { get; private set; }
        public DateTime OrderDate { get; private set; }
        public string Status { get; private set; } // Draft, Approved, Shipped, Cancelled
        public decimal TotalAmount { get; private set; }

        private readonly List<SalesOrderItem> _items = new();
        public virtual IReadOnlyCollection<SalesOrderItem> Items => _items.AsReadOnly();

        // Auditing
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected SalesOrder()
        {
            Status = null!;
        }

        public SalesOrder(Guid tenantId, Guid customerId)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            CustomerId = customerId;
            OrderDate = DateTime.UtcNow;
            Status = "Draft";
            TotalAmount = 0;
        }

        public void AddItem(Guid stockItemId, decimal quantity, decimal unitPrice)
        {
            if (Status != "Draft")
                throw new InvalidOperationException("Cannot modify items on a Sales Order that is not in Draft status.");

            var existingItem = _items.FirstOrDefault(i => i.StockItemId == stockItemId);
            if (existingItem != null)
            {
                existingItem.UpdateQuantity(quantity);
            }
            else
            {
                var item = new SalesOrderItem(Id, stockItemId, quantity, unitPrice);
                _items.Add(item);
            }

            RecalculateTotalAmount();
        }

        public void Approve()
        {
            if (Status != "Draft")
                throw new InvalidOperationException("Only Draft Sales Orders can be approved.");

            if (!_items.Any())
                throw new InvalidOperationException("Cannot approve an empty Sales Order.");

            Status = "Approved";
        }

        public void Ship()
        {
            if (Status != "Approved")
                throw new InvalidOperationException("Only Approved Sales Orders can be marked as shipped.");

            Status = "Shipped";
        }

        public void Cancel()
        {
            if (Status == "Shipped" || Status == "Cancelled")
                throw new InvalidOperationException("Cannot cancel an already shipped or cancelled Sales Order.");

            Status = "Cancelled";
        }

        private void RecalculateTotalAmount()
        {
            TotalAmount = _items.Sum(i => i.TotalAmount);
        }
    }
}
