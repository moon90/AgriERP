using AgriERP.Modules.Chemicals.Application.Chemicals.Commands.CreateChemicalProduct;
using AgriERP.Modules.Chemicals.Application.Chemicals.Commands.LogChemicalApplication;
using AgriERP.Modules.Chemicals.Application.Chemicals.Queries.GetChemicalAnalytics;
using AgriERP.Modules.Chemicals.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Chemicals.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ChemicalsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IChemicalsDbContext _context;

        public ChemicalsController(ISender sender, IChemicalsDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("products")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateChemicalProductCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, ChemicalProductId = result });
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts(CancellationToken cancellationToken)
        {
            var products = await _context.ChemicalProducts
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(products);
        }

        [HttpPost("applications")]
        public async Task<IActionResult> LogApplication([FromBody] LogChemicalApplicationCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, ApplicationLogId = result });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
        {
            var query = new GetChemicalAnalyticsQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
