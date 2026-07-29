using AgriERP.Modules.Trading.Application.Trading.Commands.CreateSalesContract;
using AgriERP.Modules.Trading.Application.Trading.Commands.FulfillContractDelivery;
using AgriERP.Modules.Trading.Application.Trading.Commands.OpenHedgePosition;
using AgriERP.Modules.Trading.Application.Trading.Commands.CloseHedgePosition;
using AgriERP.Modules.Trading.Application.Trading.Queries.GetTradingPortfolio;
using AgriERP.Modules.Trading.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TradingController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ITradingDbContext _context;

        public TradingController(ISender sender, ITradingDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("contracts")]
        public async Task<IActionResult> CreateSalesContract([FromBody] CreateSalesContractCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, SalesContractId = result });
        }

        [HttpGet("contracts")]
        public async Task<IActionResult> GetContracts(CancellationToken cancellationToken)
        {
            var contracts = await _context.SalesContracts
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(contracts);
        }

        [HttpPost("contracts/deliver")]
        public async Task<IActionResult> FulfillContractDelivery([FromBody] FulfillContractDeliveryCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = result });
        }

        [HttpPost("hedges/open")]
        public async Task<IActionResult> OpenHedge([FromBody] OpenHedgePositionCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, HedgingPositionId = result });
        }

        [HttpPost("hedges/close")]
        public async Task<IActionResult> CloseHedge([FromBody] CloseHedgePositionCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = result });
        }

        [HttpGet("portfolio")]
        public async Task<IActionResult> GetPortfolio(CancellationToken cancellationToken)
        {
            var query = new GetTradingPortfolioQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("deliveries")]
        public async Task<IActionResult> GetDeliveries(CancellationToken cancellationToken)
        {
            var items = await _context.DeliveryFulfillments.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(items);
        }

        [HttpPost("deliveries")]
        public async Task<IActionResult> CreateDelivery([FromBody] AgriERP.Modules.Trading.Domain.DeliveryFulfillment fulfillment, CancellationToken cancellationToken)
        {
            _context.DeliveryFulfillments.Add(fulfillment);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = fulfillment.Id });
        }

        [HttpGet("margin-calls")]
        public async Task<IActionResult> GetMarginCalls(CancellationToken cancellationToken)
        {
            var calls = await _context.MarginCalls.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(calls);
        }

        [HttpPost("margin-calls")]
        public async Task<IActionResult> CreateMarginCall([FromBody] AgriERP.Modules.Trading.Domain.MarginCall call, CancellationToken cancellationToken)
        {
            _context.MarginCalls.Add(call);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = call.Id });
        }
    }
}
