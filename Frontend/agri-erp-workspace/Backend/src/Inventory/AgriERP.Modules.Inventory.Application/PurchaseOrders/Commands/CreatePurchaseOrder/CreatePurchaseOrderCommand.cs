using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.CreatePurchaseOrder
{
    public record PurchaseOrderItemDto(Guid StockItemId, decimal Quantity, decimal UnitPrice);

    public record CreatePurchaseOrderCommand(
        Guid VendorId,
        List<PurchaseOrderItemDto> Items
    ) : IRequest<Guid>;

    public class CreatePurchaseOrderCommandHandler : IRequestHandler<CreatePurchaseOrderCommand, Guid>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreatePurchaseOrderCommandHandler(InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreatePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var purchaseOrder = new PurchaseOrder(tenantId, request.VendorId);

            foreach (var item in request.Items)
            {
                purchaseOrder.AddItem(item.StockItemId, item.Quantity, item.UnitPrice);
            }

            await _context.PurchaseOrders.AddAsync(purchaseOrder, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return purchaseOrder.Id;
        }
    }
}
