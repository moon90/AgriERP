using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.ReceivePurchaseOrder
{
    public record ReceivePurchaseOrderCommand(
        Guid PurchaseOrderId,
        Guid WarehouseId,
        string BatchNumberPrefix,
        DateTime? ExpirationDate
    ) : IRequest;

    public class ReceivePurchaseOrderCommandHandler : IRequestHandler<ReceivePurchaseOrderCommand>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public ReceivePurchaseOrderCommandHandler(
            InventoryDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task Handle(ReceivePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // 1. Verify Warehouse exists and is active
            var warehouse = await _context.Warehouses
                .FirstOrDefaultAsync(w => w.Id == request.WarehouseId && w.TenantId == tenantId, cancellationToken);
            if (warehouse == null)
                throw new ArgumentException("Warehouse not found.");
            if (!warehouse.IsActive)
                throw new InvalidOperationException("Cannot receive stock into an inactive warehouse.");

            // 2. Load PO including items
            var po = await _context.PurchaseOrders
                .Include(p => p.Items)
                .FirstOrDefaultAsync(p => p.Id == request.PurchaseOrderId && p.TenantId == tenantId, cancellationToken);

            if (po == null)
                throw new ArgumentException("Purchase order not found.");

            // Enforce PO status constraints (Approved -> Received)
            po.Receive();

            // 3. Process each item in the PO
            foreach (var item in po.Items)
            {
                var batchNo = $"{request.BatchNumberPrefix}-{item.StockItemId.ToString().Substring(0, 8)}";

                // Create StockBatch
                var stockBatch = new StockBatch(
                    tenantId: tenantId,
                    stockItemId: item.StockItemId,
                    warehouseId: request.WarehouseId,
                    batchNumber: batchNo,
                    quantity: item.Quantity,
                    costBasis: item.UnitPrice,
                    expirationDate: request.ExpirationDate
                );
                await _context.StockBatches.AddAsync(stockBatch, cancellationToken);

                // Create StockMovement Inflow
                var movement = new StockMovement(
                    tenantId: tenantId,
                    stockBatchId: stockBatch.Id,
                    quantity: item.Quantity,
                    movementType: "Inflow",
                    referenceId: po.Id
                );
                await _context.StockMovements.AddAsync(movement, cancellationToken);

                // Publish cross-module event for ledger accrual postings
                var integrationEvent = new StockReceivedIntegrationEvent(
                    tenantId: tenantId,
                    stockItemId: item.StockItemId,
                    warehouseId: request.WarehouseId,
                    batchNumber: batchNo,
                    quantity: item.Quantity,
                    costBasis: item.UnitPrice
                );
                await _publisher.Publish(integrationEvent, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
