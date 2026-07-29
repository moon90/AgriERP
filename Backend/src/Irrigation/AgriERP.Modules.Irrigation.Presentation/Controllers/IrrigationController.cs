using AgriERP.Modules.Irrigation.Application.Irrigation.Commands.CreateWaterSource;
using AgriERP.Modules.Irrigation.Application.Irrigation.Commands.LogIrrigationUsage;
using AgriERP.Modules.Irrigation.Application.Irrigation.Queries.GetWaterUsage;
using AgriERP.Modules.Irrigation.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Irrigation.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class IrrigationController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IIrrigationDbContext _context;

        public IrrigationController(ISender sender, IIrrigationDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("sources")]
        public async Task<IActionResult> CreateSource([FromBody] CreateWaterSourceCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, WaterSourceId = result });
        }

        [HttpGet("sources")]
        public async Task<IActionResult> GetSources(CancellationToken cancellationToken)
        {
            var sources = await _context.WaterSources
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(sources);
        }

        [HttpPost("telemetry")]
        public async Task<IActionResult> LogTelemetry([FromBody] LogIrrigationUsageCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, IrrigationLogId = result });
        }

        [HttpGet("portfolio")]
        public async Task<IActionResult> GetPortfolio(CancellationToken cancellationToken)
        {
            var query = new GetWaterUsageQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("permits")]
        public async Task<IActionResult> GetPermits(CancellationToken cancellationToken)
        {
            var permits = await _context.WaterPermits.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(permits);
        }

        [HttpPost("permits")]
        public async Task<IActionResult> CreatePermit([FromBody] AgriERP.Modules.Irrigation.Domain.WaterPermit permit, CancellationToken cancellationToken)
        {
            _context.WaterPermits.Add(permit);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = permit.Id });
        }

        [HttpGet("pumping-logs")]
        public async Task<IActionResult> GetPumpingLogs(CancellationToken cancellationToken)
        {
            var logs = await _context.PumpingLogs.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(logs);
        }

        [HttpPost("pumping-logs")]
        public async Task<IActionResult> CreatePumpingLog([FromBody] AgriERP.Modules.Irrigation.Domain.PumpingLog log, CancellationToken cancellationToken)
        {
            _context.PumpingLogs.Add(log);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = log.Id });
        }
    }
}
