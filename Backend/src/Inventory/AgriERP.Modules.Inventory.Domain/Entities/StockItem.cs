using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class StockItem : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string SKU { get; private set; } // Stock Keeping Unit (e.g., FEED-WHEAT-50KG)
        public string Name { get; private set; }
        public string Category { get; private set; } // Feed, Medicine, HarvestedCrop, Fertilizer
        public string Description { get; private set; }
        public decimal ReorderLevel { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected StockItem() 
        {
            SKU = null!;
            Name = null!;
            Category = null!;
            Description = null!;
        }

        public StockItem(Guid tenantId, string sku, string name, string category, string description, decimal reorderLevel)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            SKU = sku ?? throw new ArgumentNullException(nameof(sku));
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Category = category ?? throw new ArgumentNullException(nameof(category));
            Description = description ?? string.Empty;
            ReorderLevel = reorderLevel >= 0 ? reorderLevel : throw new ArgumentException("Reorder level cannot be negative.");
        }

        public void UpdateDetails(string name, string category, string description, decimal reorderLevel)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Category = category ?? throw new ArgumentNullException(nameof(category));
            Description = description ?? string.Empty;
            ReorderLevel = reorderLevel >= 0 ? reorderLevel : throw new ArgumentException("Reorder level cannot be negative.");
        }
    }
}
