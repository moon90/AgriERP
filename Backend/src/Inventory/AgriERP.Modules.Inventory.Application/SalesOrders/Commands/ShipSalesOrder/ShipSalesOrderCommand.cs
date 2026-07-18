using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.SalesOrders.Commands.ShipSalesOrder
{
    public record ShipSalesOrderCommand(Guid SalesOrderId) : IRequest;

    public class ShipSalesOrderCommandHandler : IRequestHandler<ShipSalesOrderCommand>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public ShipSalesOrderCommandHandler(
            InventoryDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task Handle(ShipSalesOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // 1. Load Sales Order including lines
            var so = await _context.SalesOrders
                .Include(s => s.Items)
                .FirstOrDefaultAsync(s => s.Id == request.SalesOrderId && s.TenantId == tenantId, cancellationToken);

            if (so == null)
                throw new ArgumentException("Sales order not found.");

            // Transitions status from Approved -> Shipped
            so.Ship();

            decimal totalCOGS = 0.0m;

            // 2. Deplete inventory batches in FIFO order
            foreach (var item in so.Items)
            {
                var requiredQty = item.Quantity;
                var stockItemId = item.StockItemId;

                // Load all batches for this item ordered by ReceivedAt ascending (FIFO)
                var batches = await _context.StockBatches
                    .Where(b => b.StockItemId == stockItemId && b.Quantity > 0 && b.TenantId == tenantId)
                    .OrderBy(b => b.ReceivedAt)
                    .ToListAsync(cancellationToken);

                decimal quantityDepleted = 0.0m;

                foreach (var batch in batches)
                {
                    if (requiredQty <= 0) break;

                    decimal quantityToTake = Math.Min(batch.Quantity, requiredQty);
                    
                    // Accumulate Cost of Goods Sold (FIFO)
                    totalCOGS += quantityToTake * batch.CostBasis;

                    // Deduct from batch
                    batch.DeductQuantity(quantityToTake);
                    requiredQty -= quantityToTake;
                    quantityDepleted += quantityToTake;

                    // Log StockMovement (Outflow)
                    var movement = new StockMovement(
                        tenantId: tenantId,
                        stockBatchId: batch.Id,
                        quantity: -quantityToTake, // Negative indicates deduction / outflow
                        movementType: "Outflow",
                        referenceId: so.Id
                    );
                    await _context.StockMovements.AddAsync(movement, cancellationToken);
                }

                if (requiredQty > 0)
                {
                    throw new InvalidOperationException($"Insufficient inventory to fulfill sales order line. Missing {requiredQty:F2} units of stock item ID {stockItemId}.");
                }
            }

            // 3. Save all inventory status adjustments
            await _context.SaveChangesAsync(cancellationToken);

            // 4. Publish integration event to seed accounts receivable and cost of goods sold postings
            var integrationEvent = new SalesOrderShippedIntegrationEvent(
                tenantId: tenantId,
                salesOrderId: so.Id,
                totalSalesRevenue: so.TotalAmount,
                totalCOGS: totalCOGS
            );

            await _publisher.Publish(integrationEvent, cancellationToken);
        }
    }
}
