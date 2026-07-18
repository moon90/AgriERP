using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Livestock.Application.Health.Commands.LogMedicalTreatment;
using AgriERP.Modules.Livestock.Application.Health.Commands.ScheduleVaccination;
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
    public class HealthController : ControllerBase
    {
        private readonly ISender _sender;

        public HealthController(ISender sender)
        {
            _sender = sender;
        }

        [HttpPost("treatment")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> LogTreatment([FromBody] LogMedicalTreatmentCommand command, CancellationToken cancellationToken)
        {
            var treatmentId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/livestock/health/treatment/{treatmentId}", new { Id = treatmentId });
        }

        [HttpPost("vaccination")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> ScheduleVaccination([FromBody] ScheduleVaccinationCommand command, CancellationToken cancellationToken)
        {
            var scheduleId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/livestock/health/vaccination/{scheduleId}", new { Id = scheduleId });
        }
    }
}
