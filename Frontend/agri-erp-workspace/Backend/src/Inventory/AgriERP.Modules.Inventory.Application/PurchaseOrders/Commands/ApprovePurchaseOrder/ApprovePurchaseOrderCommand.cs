using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.ApprovePurchaseOrder
{
    public record ApprovePurchaseOrderCommand(Guid PurchaseOrderId) : IRequest;

    public class ApprovePurchaseOrderCommandHandler : IRequestHandler<ApprovePurchaseOrderCommand>
    {
        private readonly InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public ApprovePurchaseOrderCommandHandler(InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(ApprovePurchaseOrderCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            var po = await _context.PurchaseOrders
                .FirstOrDefaultAsync(x => x.Id == request.PurchaseOrderId && x.TenantId == tenantId, cancellationToken);

            if (po == null)
                throw new ArgumentException("Purchase order not found.");

            po.Approve();
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
