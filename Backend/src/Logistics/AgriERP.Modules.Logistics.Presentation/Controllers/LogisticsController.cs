using AgriERP.Modules.Logistics.Application.Logistics.Commands.CreateElevator;
using AgriERP.Modules.Logistics.Application.Logistics.Commands.CreateWeighbridgeTicket;
using AgriERP.Modules.Logistics.Application.Logistics.Commands.CalculateStorageCharge;
using AgriERP.Modules.Logistics.Application.Logistics.Queries.GetStorageAnalytics;
using AgriERP.Modules.Logistics.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LogisticsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ILogisticsDbContext _context;

        public LogisticsController(ISender sender, ILogisticsDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("elevators")]
        public async Task<IActionResult> CreateElevator([FromBody] CreateElevatorCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, ElevatorId = result });
        }

        [HttpPost("tickets")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateWeighbridgeTicketCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, TicketId = result });
        }

        [HttpGet("tickets")]
        public async Task<IActionResult> GetTickets(CancellationToken cancellationToken)
        {
            var tickets = await _context.WeighbridgeTickets
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(tickets);
        }

        [HttpPost("charges")]
        public async Task<IActionResult> CalculateCharge([FromBody] CalculateStorageChargeCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, StorageChargeId = result });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
        {
            var query = new GetStorageAnalyticsQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("silos")]
        public async Task<IActionResult> GetSilos(CancellationToken cancellationToken)
        {
            var silos = await _context.Silos.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(silos);
        }

        [HttpPost("silos")]
        public async Task<IActionResult> CreateSilo([FromBody] AgriERP.Modules.Logistics.Domain.Silo silo, CancellationToken cancellationToken)
        {
            _context.Silos.Add(silo);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = silo.Id });
        }

        [HttpGet("transfers")]
        public async Task<IActionResult> GetTransfers(CancellationToken cancellationToken)
        {
            var transfers = await _context.ScaleTransfers.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(transfers);
        }

        [HttpPost("transfers")]
        public async Task<IActionResult> CreateTransfer([FromBody] AgriERP.Modules.Logistics.Domain.ScaleTransfer transfer, CancellationToken cancellationToken)
        {
            _context.ScaleTransfers.Add(transfer);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = transfer.Id });
        }
    }
}
