using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Inventory.Domain.Entities;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.SalesOrders.Commands.CreateSalesOrder
{
    public record SalesOrderItemDto(Guid StockItemId, decimal Quantity, decimal UnitPrice);

    public record CreateSalesOrderCommand(
        Guid CustomerId,
        List<SalesOrderItemDto> Items
    ) : IRequest<Guid>;

    public class CreateSalesOrderCommandHandler : IRequestHandler<CreateSalesOrderCommand, Guid>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateSalesOrderCommandHandler(InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateSalesOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var salesOrder = new SalesOrder(tenantId, request.CustomerId);

            foreach (var item in request.Items)
            {
                salesOrder.AddItem(item.StockItemId, item.Quantity, item.UnitPrice);
            }

            await _context.SalesOrders.AddAsync(salesOrder, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return salesOrder.Id;
        }
    }
}
