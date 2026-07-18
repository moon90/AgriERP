using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Livestock.Application.Feeding.Commands.CreateFeedRation;
using AgriERP.Modules.Livestock.Application.Feeding.Commands.LogFeedingActivity;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/livestock/[controller]")]
    public class FeedingController : ControllerBase
    {
        private readonly ISender _sender;

        public FeedingController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("rations")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> CreateRation([FromBody] CreateFeedRationCommand command, CancellationToken cancellationToken)
        {
            var rationId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/livestock/feeding/rations/{rationId}", new { Id = rationId });
        }

        [HttpPost("logs")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> LogFeeding([FromBody] LogFeedingActivityCommand command, CancellationToken cancellationToken)
        {
            var logId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/livestock/feeding/logs/{logId}", new { Id = logId });
        }
    }
}
