using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Logistics.Domain
{
    public class Silo : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid ElevatorId { get; set; }
        public string Name { get; set; } = string.Empty;
        public double CapacityBushels { get; set; }
        public double CurrentFillBushels { get; set; }
        public string? CommodityType { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
