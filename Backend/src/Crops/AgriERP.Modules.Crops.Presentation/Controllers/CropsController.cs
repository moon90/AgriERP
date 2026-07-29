using AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropField;
using AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropCycle;
using AgriERP.Modules.Crops.Application.Crops.Commands.LogFieldActivity;
using AgriERP.Modules.Crops.Application.Crops.Commands.HarvestCropCycle;
using AgriERP.Modules.Crops.Application.Crops.Queries.GetCropCycles;
using AgriERP.BuildingBlocks.Application.Common;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Domain;
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
        public async Task<IActionResult> GetFields(
            [FromQuery] AgriERP.BuildingBlocks.Application.Common.PaginationQuery pagination,
            [FromQuery] string? nameFilter,
            CancellationToken cancellationToken)
        {
            var query = _context.CropFields.AsNoTracking();

            // Searching & Filtering
            if (!string.IsNullOrWhiteSpace(pagination.Search))
            {
                query = query.Where(f => f.Name.Contains(pagination.Search));
            }

            if (!string.IsNullOrWhiteSpace(nameFilter))
            {
                query = query.Where(f => f.Name.Contains(nameFilter));
            }

            // Sorting
            query = pagination.SortOrder?.ToLower() == "desc"
                ? query.OrderByDescending(f => f.Name)
                : query.OrderBy(f => f.Name);

            // Pagination
            var pagedResult = (await query.ToListAsync(cancellationToken))
                .ToPagedResult(pagination.PageNumber, pagination.PageSize);

            return Ok(pagedResult);
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

        [HttpGet("plots")]
        public async Task<IActionResult> GetPlots(CancellationToken cancellationToken)
        {
            var plots = await _context.FieldPlots.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(plots);
        }

        [HttpPost("plots")]
        public async Task<IActionResult> CreatePlot([FromBody] FieldPlot plot, CancellationToken cancellationToken)
        {
            plot.TenantId = Guid.Empty; // tenant scope set via context
            _context.FieldPlots.Add(plot);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = plot.Id });
        }

        [HttpGet("harvest-records")]
        public async Task<IActionResult> GetHarvestRecords(CancellationToken cancellationToken)
        {
            var records = await _context.HarvestRecords.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(records);
        }

        [HttpPost("harvest-records")]
        public async Task<IActionResult> CreateHarvestRecord([FromBody] HarvestRecord record, CancellationToken cancellationToken)
        {
            _context.HarvestRecords.Add(record);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = record.Id });
        }
    }
}
