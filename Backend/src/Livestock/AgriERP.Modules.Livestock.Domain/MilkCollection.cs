using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class MilkCollection : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid AnimalId { get; set; }
        public DateTime CollectionDate { get; set; }
        public double VolumeLiters { get; set; }
        public double? FatPercent { get; set; }
        public double? ProteinPercent { get; set; }
        public string? CollectorName { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
