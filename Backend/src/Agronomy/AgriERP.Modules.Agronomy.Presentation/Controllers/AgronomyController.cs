using AgriERP.Modules.Agronomy.Application.Agronomy.Commands.RecordSoilSample;
using AgriERP.Modules.Agronomy.Application.Agronomy.Commands.AddAgronomyRecommendation;
using AgriERP.Modules.Agronomy.Application.Agronomy.Queries.GetSoilInsights;
using AgriERP.Modules.Agronomy.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Agronomy.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AgronomyController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IAgronomyDbContext _context;

        public AgronomyController(ISender sender, IAgronomyDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("samples")]
        public async Task<IActionResult> RecordSample([FromBody] RecordSoilSampleCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, SoilSampleId = result });
        }

        [HttpGet("samples")]
        public async Task<IActionResult> GetSamples(CancellationToken cancellationToken)
        {
            var samples = await _context.SoilSamples
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(samples);
        }

        [HttpPost("recommendations")]
        public async Task<IActionResult> AddRecommendation([FromBody] AddAgronomyRecommendationCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, AgronomyRecommendationId = result });
        }

        [HttpGet("insights")]
        public async Task<IActionResult> GetInsights(CancellationToken cancellationToken)
        {
            var query = new GetSoilInsightsQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
