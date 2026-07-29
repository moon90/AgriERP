using AgriERP.Modules.Assets.Application.Assets.Commands.CreateAsset;
using AgriERP.Modules.Assets.Application.Assets.Commands.LogMaintenance;
using AgriERP.Modules.Assets.Application.Assets.Commands.CalculateDepreciation;
using AgriERP.Modules.Assets.Application.Assets.Queries.GetDepreciationSchedule;
using AgriERP.Modules.Assets.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class AssetsController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IAssetsDbContext _context;

        public AssetsController(ISender sender, IAssetsDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsset([FromBody] CreateAssetCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, AssetId = result });
        }

        [HttpGet]
        public async Task<IActionResult> GetAssets(CancellationToken cancellationToken)
        {
            var assets = await _context.Assets
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(assets);
        }

        [HttpPost("maintenance")]
        public async Task<IActionResult> LogMaintenance([FromBody] LogMaintenanceCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, LogId = result });
        }

        [HttpGet("{assetId:guid}/maintenance")]
        public async Task<IActionResult> GetMaintenanceLogs(Guid assetId, CancellationToken cancellationToken)
        {
            var logs = await _context.MaintenanceLogs
                .AsNoTracking()
                .Where(l => l.AssetId == assetId)
                .ToListAsync(cancellationToken);
            return Ok(logs);
        }

        [HttpPost("depreciate")]
        public async Task<IActionResult> RunDepreciation([FromBody] CalculateDepreciationCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, TotalDepreciatedAmount = result });
        }

        [HttpGet("{assetId:guid}/depreciation-schedule")]
        public async Task<IActionResult> GetDepreciationSchedule(Guid assetId, CancellationToken cancellationToken)
        {
            var query = new GetDepreciationScheduleQuery(assetId);
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }

        [HttpGet("fuel-logs")]
        public async Task<IActionResult> GetFuelLogs(CancellationToken cancellationToken)
        {
            var logs = await _context.FuelLogs.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(logs);
        }

        [HttpPost("fuel-logs")]
        public async Task<IActionResult> CreateFuelLog([FromBody] AgriERP.Modules.Assets.Domain.FuelLog log, CancellationToken cancellationToken)
        {
            _context.FuelLogs.Add(log);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = log.Id });
        }

        [HttpGet("depreciation-schedules")]
        public async Task<IActionResult> GetAllDepreciationSchedules(CancellationToken cancellationToken)
        {
            var schedules = await _context.DepreciationSchedules.AsNoTracking().ToListAsync(cancellationToken);
            return Ok(schedules);
        }

        [HttpPost("depreciation-schedules")]
        public async Task<IActionResult> CreateDepreciationSchedule([FromBody] AgriERP.Modules.Assets.Domain.DepreciationSchedule schedule, CancellationToken cancellationToken)
        {
            _context.DepreciationSchedules.Add(schedule);
            await _context.SaveChangesAsync(cancellationToken);
            return Ok(new { Success = true, Id = schedule.Id });
        }
    }
}
