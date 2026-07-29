using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Trading.Domain
{
    public class DeliveryFulfillment : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid SalesContractId { get; set; }
        public DateTime DeliveryDate { get; set; }
        public double QuantityDelivered { get; set; }
        public string? TruckNumber { get; set; }
        public string? DriverName { get; set; }
        public string? ReceiptNumber { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
