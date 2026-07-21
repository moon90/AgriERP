using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Irrigation.Domain
{
    public class WaterSource : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string SourceName { get; private set; } = null!;
        public string PermitNumber { get; private set; } = null!;
        public decimal MaxAllocatedGallons { get; private set; }
        public decimal UsedGallons { get; private set; }
        public string Status { get; private set; } = "Active"; // Active, Suspended

        // Auditing
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected WaterSource()
        {
        }

        public WaterSource(
            Guid tenantId,
            string sourceName,
            string permitNumber,
            decimal maxAllocatedGallons)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            SourceName = sourceName ?? throw new ArgumentNullException(nameof(sourceName));
            PermitNumber = permitNumber ?? throw new ArgumentNullException(nameof(permitNumber));
            MaxAllocatedGallons = maxAllocatedGallons >= 0 ? maxAllocatedGallons : throw new ArgumentException("Allocated gallons cannot be negative.");
            UsedGallons = 0;
            Status = "Active";
        }

        public void LogUsage(decimal gallons)
        {
            if (gallons < 0)
                throw new ArgumentException("Gallons pumped cannot be negative.");
            
            UsedGallons += gallons;
        }

        public void Suspend()
        {
            Status = "Suspended";
        }

        public void Activate()
        {
            Status = "Active";
        }
    }
}
