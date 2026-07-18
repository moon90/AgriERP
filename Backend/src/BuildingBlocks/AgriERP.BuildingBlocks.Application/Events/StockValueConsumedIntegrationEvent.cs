using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class StockValueConsumedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid StockItemId { get; }
        public decimal QuantityConsumed { get; }
        public decimal TotalCost { get; } // Cumulative monetary value of the depletion
        public Guid ReferenceId { get; }

        public StockValueConsumedIntegrationEvent(Guid tenantId, Guid stockItemId, decimal quantityConsumed, decimal totalCost, Guid referenceId)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            StockItemId = stockItemId;
            QuantityConsumed = quantityConsumed;
            TotalCost = totalCost;
            ReferenceId = referenceId;
        }
    }
}
