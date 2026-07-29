using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class TankerBatch : AggregateRoot, IMultiTenant, IAuditable
    {
        public DateTime BatchDate { get; set; }
        public double TotalVolumeLiters { get; set; }
        public double? AvgFatPercent { get; set; }
        public double? AvgProteinPercent { get; set; }
        public string? DriverName { get; set; }
        public string? TruckNumber { get; set; }
        public string? DestinationDairy { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
