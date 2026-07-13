using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class InventoryConsumedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid StockItemId { get; }
        public decimal QuantityConsumed { get; }
        public Guid ReferenceId { get; } // Reference to Veterinary Treatment log or Feed log

        public InventoryConsumedIntegrationEvent(Guid tenantId, Guid stockItemId, decimal quantityConsumed, Guid referenceId)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            StockItemId = stockItemId;
            QuantityConsumed = quantityConsumed;
            ReferenceId = referenceId;
        }
    }
}
