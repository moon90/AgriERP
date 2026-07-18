using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.SalesOrders.Commands.ApproveSalesOrder
{
    public record ApproveSalesOrderCommand(Guid SalesOrderId) : IRequest;

    public class ApproveSalesOrderCommandHandler : IRequestHandler<ApproveSalesOrderCommand>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public ApproveSalesOrderCommandHandler(InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(ApproveSalesOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var so = await _context.SalesOrders
                .FirstOrDefaultAsync(x => x.Id == request.SalesOrderId && x.TenantId == tenantId, cancellationToken);

            if (so == null)
                throw new ArgumentException("Sales order not found.");

            so.Approve();
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
