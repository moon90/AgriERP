using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Trading.Domain
{
    public class MarginCall : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid HedgingPositionId { get; set; }
        public DateTime CallDate { get; set; }
        public decimal RequiredAmount { get; set; }
        public bool IsSatisfied { get; set; }
        public DateTime? SatisfiedDate { get; set; }
        public string? Notes { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
