using AgriERP.Modules.Land.Application.Land.Commands.CreateLandLease;
using AgriERP.Modules.Land.Application.Land.Commands.CalculateLeasePayment;
using AgriERP.Modules.Land.Application.Land.Queries.GetLeasePortfolio;
using AgriERP.Modules.Land.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Land.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class LandLeaseController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ILandDbContext _context;

        public LandLeaseController(ISender sender, ILandDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("leases")]
        public async Task<IActionResult> CreateLease([FromBody] CreateLandLeaseCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, LandLeaseId = result });
        }

        [HttpGet("leases")]
        public async Task<IActionResult> GetLeases(CancellationToken cancellationToken)
        {
            var leases = await _context.LandLeases
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(leases);
        }

        [HttpPost("payments")]
        public async Task<IActionResult> CalculatePayment([FromBody] CalculateLeasePaymentCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, LeasePaymentId = result });
        }

        [HttpGet("portfolio")]
        public async Task<IActionResult> GetPortfolio(CancellationToken cancellationToken)
        {
            var query = new GetLeasePortfolioQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
