using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class FeedingLog : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid FeedRationId { get; private set; }
        public Guid PenOrBarnId { get; private set; } // Targets physical feeding group/pen
        public DateTime LogDate { get; private set; }
        public decimal QuantityFed { get; private set; } // Quantity in kg

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected FeedingLog() { }

        public FeedingLog(Guid tenantId, Guid feedRationId, Guid penOrBarnId, decimal quantityFed)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FeedRationId = feedRationId;
            PenOrBarnId = penOrBarnId;
            QuantityFed = quantityFed > 0 ? quantityFed : throw new ArgumentException("Quantity fed must be positive.");
            LogDate = DateTime.UtcNow;
        }
    }
}
