using AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropField;
using AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropCycle;
using AgriERP.Modules.Crops.Application.Crops.Commands.LogFieldActivity;
using AgriERP.Modules.Crops.Application.Crops.Commands.HarvestCropCycle;
using AgriERP.Modules.Crops.Application.Crops.Queries.GetCropCycles;
using AgriERP.Modules.Crops.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class CropsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ICropsDbContext _context;

        public CropsController(ISender sender, ICropsDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("fields")]
        public async Task<IActionResult> CreateField([FromBody] CreateCropFieldCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, FieldId = result });
        }

        [HttpGet("fields")]
        public async Task<IActionResult> GetFields(CancellationToken cancellationToken)
        {
            var fields = await _context.CropFields
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(fields);
        }

        [HttpPost("cycles")]
        public async Task<IActionResult> CreateCycle([FromBody] CreateCropCycleCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, CropCycleId = result });
        }

        [HttpGet("cycles")]
        public async Task<IActionResult> GetCycles(CancellationToken cancellationToken)
        {
            var query = new GetCropCyclesQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpPost("cycles/activity")]
        public async Task<IActionResult> LogActivity([FromBody] LogFieldActivityCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, ActivityId = result });
        }

        [HttpPost("cycles/harvest")]
        public async Task<IActionResult> HarvestCycle([FromBody] HarvestCropCycleCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, Harvested = result });
        }
    }
}
