using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Crops.Domain
{
    public class HarvestRecord : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid CropCycleId { get; set; }
        public DateTime HarvestDate { get; set; }
        public double YieldBushels { get; set; }
        public double MoisturePercent { get; set; }
        public string? QualityGrade { get; set; }
        public string? Notes { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
