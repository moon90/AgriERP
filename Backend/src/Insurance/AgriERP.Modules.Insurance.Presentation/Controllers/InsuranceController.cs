using AgriERP.Modules.Insurance.Application.Insurance.Commands.CreateInsurancePolicy;
using AgriERP.Modules.Insurance.Application.Insurance.Commands.SubmitLossClaim;
using AgriERP.Modules.Insurance.Application.Insurance.Commands.SettleLossClaim;
using AgriERP.Modules.Insurance.Application.Insurance.Queries.GetInsuranceAnalytics;
using AgriERP.Modules.Insurance.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class InsuranceController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IInsuranceDbContext _context;

        public InsuranceController(ISender sender, IInsuranceDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("policies")]
        public async Task<IActionResult> CreatePolicy([FromBody] CreateInsurancePolicyCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, InsurancePolicyId = result });
        }

        [HttpGet("policies")]
        public async Task<IActionResult> GetPolicies(CancellationToken cancellationToken)
        {
            var policies = await _context.InsurancePolicies
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(policies);
        }

        [HttpPost("claims")]
        public async Task<IActionResult> SubmitClaim([FromBody] SubmitLossClaimCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, LossClaimId = result });
        }

        [HttpPost("claims/settle")]
        public async Task<IActionResult> SettleClaim([FromBody] SettleLossClaimCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = result });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
        {
            var query = new GetInsuranceAnalyticsQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("adjustments")]
        public async Task<IActionResult> GetAdjustments(CancellationToken cancellationToken)
        {
            var items = await _context.Adjustments.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(items);
        }

        [HttpPost("adjustments")]
        public async Task<IActionResult> CreateAdjustment([FromBody] AgriERP.Modules.Insurance.Domain.Adjustment adjustment, CancellationToken cancellationToken)
        {
            _context.Adjustments.Add(adjustment);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = adjustment.Id });
        }
    }
}
