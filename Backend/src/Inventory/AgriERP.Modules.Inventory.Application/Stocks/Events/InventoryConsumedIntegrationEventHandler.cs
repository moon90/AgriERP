using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.Stocks.Events
{
    public class InventoryConsumedIntegrationEventHandler : INotificationHandler<InventoryConsumedIntegrationEvent>
    {
        private readonly InventoryDbContext _context;
        private readonly IPublisher _publisher;

        public InventoryConsumedIntegrationEventHandler(InventoryDbContext context, IPublisher publisher)
        {
            _context = context;
            _publisher = publisher;
        }

        public async Task Handle(InventoryConsumedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;
            var stockItemId = notification.StockItemId;
            var remainingToDeduct = notification.QuantityConsumed;
            decimal totalCostBasis = 0m;

            if (remainingToDeduct <= 0) return;

            // Fetch active stock batches with quantities, ordered by receipt date (FIFO)
            var batches = await _context.StockBatches
                .Where(sb => sb.StockItemId == stockItemId && sb.TenantId == tenantId && sb.Quantity > 0)
                .OrderBy(sb => sb.ReceivedAt)
                .ToListAsync(cancellationToken);

            foreach (var batch in batches)
            {
                if (remainingToDeduct <= 0) break;

                decimal quantityDeducted;
                if (batch.Quantity >= remainingToDeduct)
                {
                    quantityDeducted = remainingToDeduct;
                    batch.DeductQuantity(quantityDeducted);
                    remainingToDeduct = 0;
                }
                else
                {
                    quantityDeducted = batch.Quantity;
                    remainingToDeduct -= quantityDeducted;
                    batch.DeductQuantity(quantityDeducted);
                }

                // Accumulate cost basis (quantity * unit cost basis of this batch)
                totalCostBasis += quantityDeducted * batch.CostBasis;

                // Log a negative stock movement of type "Outflow"
                var movement = new StockMovement(
                    tenantId: tenantId,
                    stockBatchId: batch.Id,
                    quantity: -quantityDeducted,
                    movementType: "Outflow",
                    referenceId: notification.ReferenceId
                );

                await _context.StockMovements.AddAsync(movement, cancellationToken);
            }

            if (remainingToDeduct > 0)
            {
                // Note: In an enterprise platform, this would write to a stock deficit ledger or raise an warning event.
                // For development, we save what was successfully allocated.
            }

            await _context.SaveChangesAsync(cancellationToken);

            // Publish the calculated valuation event for Finance ledger synchronization
            var valueConsumedEvent = new StockValueConsumedIntegrationEvent(
                tenantId: tenantId,
                stockItemId: stockItemId,
                quantityConsumed: notification.QuantityConsumed - remainingToDeduct,
                totalCost: totalCostBasis,
                referenceId: notification.ReferenceId
            );

            await _publisher.Publish(valueConsumedEvent, cancellationToken);
        }
    }
}
