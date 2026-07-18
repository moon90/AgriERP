using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.Stocks.Commands.ReceiveStock
{
    public class ReceiveStockCommandHandler : IRequestHandler<ReceiveStockCommand, Guid>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public ReceiveStockCommandHandler(
            InventoryDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(ReceiveStockCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing. Cannot process stock receipt.");
            }

            // 1. Verify Warehouse exists and is active
            var warehouse = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.Id == request.WarehouseId && w.TenantId == tenantId, cancellationToken);
            
            if (warehouse == null)
            {
                throw new ArgumentException("The specified warehouse was not found.");
            }
            if (!warehouse.IsActive)
            {
                throw new InvalidOperationException("Cannot receive stock into an inactive warehouse.");
            }

            // 2. Verify Stock Item exists
            var stockItem = await _context.StockItems
                .FirstOrDefaultAsync(si => si.Id == request.StockItemId && si.TenantId == tenantId, cancellationToken);

            if (stockItem == null)
            {
                throw new ArgumentException("The specified stock item was not found.");
            }

            // 3. Process Purchase Order
            var purchaseOrder = await _context.PurchaseOrders
                .Include(po => po.Items)
                .FirstOrDefaultAsync(po => po.Id == request.PurchaseOrderId && po.TenantId == tenantId, cancellationToken);

            if (purchaseOrder == null)
            {
                throw new ArgumentException("The specified purchase order was not found.");
            }

            // Enforce PO status constraints (Must be Approved to be received)
            purchaseOrder.Receive();

            // 4. Create and persist StockBatch
            var stockBatch = new StockBatch(
                tenantId: tenantId,
                stockItemId: request.StockItemId,
                warehouseId: request.WarehouseId,
                batchNumber: request.BatchNumber,
                quantity: request.Quantity,
                costBasis: request.CostBasis,
                expirationDate: request.ExpirationDate
            );

            await _context.StockBatches.AddAsync(stockBatch, cancellationToken);

            // 5. Create and persist StockMovement
            var movement = new StockMovement(
                tenantId: tenantId,
                stockBatchId: stockBatch.Id,
                quantity: request.Quantity,
                movementType: "Inflow",
                referenceId: purchaseOrder.Id
            );

            await _context.StockMovements.AddAsync(movement, cancellationToken);

            // 6. Save changes
            await _context.SaveChangesAsync(cancellationToken);

            // 7. Publish integration event for cross-module accounting reconciliation
            var integrationEvent = new StockReceivedIntegrationEvent(
                tenantId: tenantId,
                stockItemId: request.StockItemId,
                warehouseId: request.WarehouseId,
                batchNumber: request.BatchNumber,
                quantity: request.Quantity,
                costBasis: request.CostBasis
            );

            await _publisher.Publish(integrationEvent, cancellationToken);

            return stockBatch.Id;
        }
    }
}
