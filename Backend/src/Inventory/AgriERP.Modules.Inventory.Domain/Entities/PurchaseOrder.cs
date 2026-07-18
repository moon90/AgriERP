using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class PurchaseOrder : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid VendorId { get; private set; }
        public DateTime OrderDate { get; private set; }
        public string Status { get; private set; } // Draft, Approved, Received, Cancelled
        public decimal TotalAmount { get; private set; }

        private readonly List<PurchaseOrderItem> _items = new();
        public virtual IReadOnlyCollection<PurchaseOrderItem> Items => _items.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected PurchaseOrder() 
        {
            Status = null!;
        }

        public PurchaseOrder(Guid tenantId, Guid vendorId)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            VendorId = vendorId;
            OrderDate = DateTime.UtcNow;
            Status = "Draft";
            TotalAmount = 0;
        }

        public void AddItem(Guid stockItemId, decimal quantity, decimal unitPrice)
        {
            if (Status != "Draft")
                throw new InvalidOperationException("Cannot modify items on a Purchase Order that is not in Draft status.");

            var existingItem = _items.FirstOrDefault(i => i.StockItemId == stockItemId);
            if (existingItem != null)
            {
                existingItem.UpdateQuantity(quantity);
            }
            else
            {
                var item = new PurchaseOrderItem(Id, stockItemId, quantity, unitPrice);
                _items.Add(item);
            }

            RecalculateTotalAmount();
        }

        public void Approve()
        {
            if (Status != "Draft")
                throw new InvalidOperationException("Only Draft Purchase Orders can be approved.");
            
            if (!_items.Any())
                throw new InvalidOperationException("Cannot approve an empty Purchase Order.");

            Status = "Approved";
        }

        public void Receive()
        {
            if (Status != "Approved")
                throw new InvalidOperationException("Only Approved Purchase Orders can be marked as received.");

            Status = "Received";
        }

        public void Cancel()
        {
            if (Status == "Received" || Status == "Cancelled")
                throw new InvalidOperationException("Cannot cancel an already received or cancelled Purchase Order.");

            Status = "Cancelled";
        }

        private void RecalculateTotalAmount()
        {
            TotalAmount = _items.Sum(i => i.TotalAmount);
        }
    }
}
