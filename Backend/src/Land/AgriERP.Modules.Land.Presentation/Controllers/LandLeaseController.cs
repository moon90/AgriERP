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

        [HttpGet("parcels")]
        public async Task<IActionResult> GetParcels(CancellationToken cancellationToken)
        {
            var parcels = await _context.Parcels.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(parcels);
        }

        [HttpPost("parcels")]
        public async Task<IActionResult> CreateParcel([FromBody] AgriERP.Modules.Land.Domain.Parcel parcel, CancellationToken cancellationToken)
        {
            _context.Parcels.Add(parcel);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = parcel.Id });
        }

        [HttpGet("splits")]
        public async Task<IActionResult> GetSplits(CancellationToken cancellationToken)
        {
            var splits = await _context.CropShareSplits.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(splits);
        }

        [HttpPost("splits")]
        public async Task<IActionResult> CreateSplit([FromBody] AgriERP.Modules.Land.Domain.CropShareSplit split, CancellationToken cancellationToken)
        {
            _context.CropShareSplits.Add(split);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = split.Id });
        }
    }
}
