using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Irrigation.Domain
{
    public class WaterPermit : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid WaterSourceId { get; set; }
        public string PermitNumber { get; set; } = string.Empty;
        public string? IssuingAuthority { get; set; }
        public double AnnualAllocationGallons { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
