using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class MeatStock : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; } // IMultiTenant থেকে আসা
        public string ItemName { get; private set; }
        public decimal TotalQuantityKg { get; private set; }
        public DateTime LastUpdatedAt { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // EF Core এর জন্য প্রটেক্টড কন্সট্রাক্টর
        protected MeatStock() 
        {
            ItemName = null!;
        }

        public MeatStock(Guid tenantId, string itemName, decimal initialQuantity)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            ItemName = itemName;
            TotalQuantityKg = initialQuantity;
            LastUpdatedAt = DateTime.UtcNow;
        }

        // স্টক বাড়ানোর ডোমেইন মেথড (বিজনেস লজিক)
        public void AddStock(decimal quantity)
        {
            if (quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.");

            TotalQuantityKg += quantity;
            LastUpdatedAt = DateTime.UtcNow;
        }
    }
}
