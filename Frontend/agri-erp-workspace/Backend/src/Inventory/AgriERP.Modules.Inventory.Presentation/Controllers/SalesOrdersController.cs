using AgriERP.Modules.Inventory.Application.SalesOrders.Commands.CreateSalesOrder;
using AgriERP.Modules.Inventory.Application.SalesOrders.Commands.ApproveSalesOrder;
using AgriERP.Modules.Inventory.Application.SalesOrders.Commands.ShipSalesOrder;
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
    [Route("api/v1/inventory/sales-orders")]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly InventoryDbContext _context;

        public SalesOrdersController(ISender sender, InventoryDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSalesOrders(CancellationToken cancellationToken)
        {
            var salesOrders = await _context.SalesOrders
                .Include(so => so.Items)
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            return Ok(salesOrders);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSalesOrder([FromBody] CreateSalesOrderCommand command, CancellationToken cancellationToken)
        {
            var soId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/inventory/sales-orders/{soId}", new { Id = soId });
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveSalesOrder(Guid id, CancellationToken cancellationToken)
        {
            var command = new ApproveSalesOrderCommand(id);
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Sales order approved successfully." });
        }

        [HttpPost("{id}/ship")]
        public async Task<IActionResult> ShipSalesOrder(Guid id, CancellationToken cancellationToken)
        {
            var command = new ShipSalesOrderCommand(id);
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Sales order shipped. Stock deducted and ledger entries posted." });
        }
    }
}
