using AgriERP.Modules.Inventory.Application.Stocks.Queries.GetMeatStocks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AgriERP.Modules.Inventory.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/inventory/[controller]")]
    public class StocksController : ControllerBase
    {
        private readonly ISender _sender;

        public StocksController(ISender sender)
        {
            _sender = sender;
        }

        [HttpGet]
        public async Task<IActionResult> GetStocks(CancellationToken cancellationToken)
        {
            var query = new GetMeatStocksQuery();
            var result = await _sender.Send(query, cancellationToken);

            return Ok(result);
        }
    }
}
