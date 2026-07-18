using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordInsemination;
using AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordPregnancyCheck;
using AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordCalving;
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
    public class BreedingController : ControllerBase
    {
        private readonly ISender _sender;

        public BreedingController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("inseminate")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> Inseminate([FromBody] RecordInseminationCommand command, CancellationToken cancellationToken)
        {
            var breedingCycleId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/livestock/breeding/{breedingCycleId}", new { Id = breedingCycleId });
        }

        [HttpPost("pregnancy-check")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> PregnancyCheck([FromBody] RecordPregnancyCheckCommand command, CancellationToken cancellationToken)
        {
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Pregnancy check recorded successfully." });
        }

        [HttpPost("calving")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> Calving([FromBody] RecordCalvingCommand command, CancellationToken cancellationToken)
        {
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Calving activity and birth records logged successfully." });
        }
    }
}
