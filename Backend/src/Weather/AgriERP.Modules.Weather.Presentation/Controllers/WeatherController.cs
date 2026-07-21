using AgriERP.Modules.Weather.Application.Weather.Commands.RegisterWeatherStation;
using AgriERP.Modules.Weather.Application.Weather.Commands.LogWeatherReading;
using AgriERP.Modules.Weather.Application.Weather.Commands.ConfigureFrostAlert;
using AgriERP.Modules.Weather.Application.Weather.Commands.ProcessWeatherSubscriptionBill;
using AgriERP.Modules.Weather.Application.Weather.Queries.GetWeatherAnalytics;
using AgriERP.Modules.Weather.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly IWeatherDbContext _context;

        public WeatherController(ISender sender, IWeatherDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("stations")]
        public async Task<IActionResult> RegisterStation([FromBody] RegisterWeatherStationCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, WeatherStationId = result });
        }

        [HttpGet("stations")]
        public async Task<IActionResult> GetStations(CancellationToken cancellationToken)
        {
            var stations = await _context.WeatherStations
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(stations);
        }

        [HttpPost("readings")]
        public async Task<IActionResult> LogReading([FromBody] LogWeatherReadingCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, WeatherReadingId = result });
        }

        [HttpPost("frost-configs")]
        public async Task<IActionResult> ConfigureFrostAlert([FromBody] ConfigureFrostAlertCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, FrostAlertConfigId = result });
        }

        [HttpPost("subscription-bills")]
        public async Task<IActionResult> ProcessSubscriptionBill([FromBody] ProcessWeatherSubscriptionBillCommand command, CancellationToken cancellationToken)
        {
            var result = await _sender.Send(command, cancellationToken);
            return Ok(new { Success = true, SubscriptionBillingId = result });
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics(CancellationToken cancellationToken)
        {
            var query = new GetWeatherAnalyticsQuery();
            var result = await _sender.Send(query, cancellationToken);
            return Ok(result);
        }
    }
}
