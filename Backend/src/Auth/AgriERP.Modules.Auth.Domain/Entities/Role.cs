using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Domain.Entities
{
    public class Role : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; } // e.g., "Farm Manager"
        public string Description { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected Role() 
        {
            Name = null!;
            Description = null!;
        }

        public Role(Guid tenantId, string name, string description)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name;
            Description = description;
        }
    }
}
