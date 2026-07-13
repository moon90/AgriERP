using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class StockReceivedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid StockItemId { get; }
        public Guid WarehouseId { get; }
        public string BatchNumber { get; }
        public decimal Quantity { get; }
        public decimal CostBasis { get; }

        public StockReceivedIntegrationEvent(Guid tenantId, Guid stockItemId, Guid warehouseId, string batchNumber, decimal quantity, decimal costBasis)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            StockItemId = stockItemId;
            WarehouseId = warehouseId;
            BatchNumber = batchNumber ?? throw new ArgumentNullException(nameof(batchNumber));
            Quantity = quantity;
            CostBasis = costBasis;
        }
    }
}
