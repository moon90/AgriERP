using AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.CreatePurchaseOrder;
using AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.ApprovePurchaseOrder;
using AgriERP.Modules.Inventory.Application.PurchaseOrders.Commands.ReceivePurchaseOrder;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/inventory/purchase-orders")]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly InventoryDbContext _context;

        public PurchaseOrdersController(ISender sender, InventoryDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetPurchaseOrders(CancellationToken cancellationToken)
        {
            var purchaseOrders = await _context.PurchaseOrders
                .Include(po => po.Items)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(purchaseOrders);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePurchaseOrder([FromBody] CreatePurchaseOrderCommand command, CancellationToken cancellationToken)
        {
            var poId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/inventory/purchase-orders/{poId}", new { Id = poId });
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApprovePurchaseOrder(Guid id, CancellationToken cancellationToken)
        {
            var command = new ApprovePurchaseOrderCommand(id);
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Purchase order approved successfully." });
        }

        [HttpPost("{id}/receive")]
        public async Task<IActionResult> ReceivePurchaseOrder(Guid id, [FromBody] ReceivePurchaseOrderDto dto, CancellationToken cancellationToken)
        {
            var command = new ReceivePurchaseOrderCommand(id, dto.WarehouseId, dto.BatchNumberPrefix, dto.ExpirationDate);
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Purchase order received and inventory batch registered." });
        }
    }

    public record ReceivePurchaseOrderDto(Guid WarehouseId, string BatchNumberPrefix, DateTime? ExpirationDate);
}
