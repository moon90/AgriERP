using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Logistics.Domain
{
    public class ScaleTransfer : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid? FromSiloId { get; set; }
        public Guid? ToSiloId { get; set; }
        public double QuantityBushels { get; set; }
        public DateTime TransferDate { get; set; }
        public string? CommodityType { get; set; }
        public string? Notes { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
