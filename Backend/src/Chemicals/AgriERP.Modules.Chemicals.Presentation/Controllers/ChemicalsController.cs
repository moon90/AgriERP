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

        [HttpGet("active-ingredients")]
        public async Task<IActionResult> GetActiveIngredients(CancellationToken cancellationToken)
        {
            var ingredients = await _context.ActiveIngredients.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(ingredients);
        }

        [HttpPost("active-ingredients")]
        public async Task<IActionResult> CreateActiveIngredient([FromBody] AgriERP.Modules.Chemicals.Domain.ActiveIngredient ingredient, CancellationToken cancellationToken)
        {
            _context.ActiveIngredients.Add(ingredient);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = ingredient.Id });
        }

        [HttpGet("phi-timers")]
        public async Task<IActionResult> GetPHITimers(CancellationToken cancellationToken)
        {
            var timers = await _context.PHITimers.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(timers);
        }

        [HttpPost("phi-timers")]
        public async Task<IActionResult> CreatePHITimer([FromBody] AgriERP.Modules.Chemicals.Domain.PHITimer timer, CancellationToken cancellationToken)
        {
            _context.PHITimers.Add(timer);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = timer.Id });
        }
    }
}
