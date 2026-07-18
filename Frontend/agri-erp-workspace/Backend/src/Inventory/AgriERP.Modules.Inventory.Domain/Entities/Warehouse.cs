using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class Warehouse : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; }
        public string Location { get; private set; }
        public bool IsActive { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected Warehouse() 
        {
            Name = null!;
            Location = null!;
        }

        public Warehouse(Guid tenantId, string name, string location)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Location = location ?? throw new ArgumentNullException(nameof(location));
            IsActive = true;
        }

        public void UpdateDetails(string name, string location)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            Location = location ?? throw new ArgumentNullException(nameof(location));
        }

        public void Deactivate()
        {
            IsActive = false;
        }

        public void Activate()
        {
            IsActive = true;
        }
    }
}
