using MediatR;
using System;

namespace AgriERP.Modules.Livestock.Application.Health.Commands.ScheduleVaccination
{
    public record ScheduleVaccinationCommand(
        Guid AnimalId,
        Guid VaccineItemId,
        DateTime ScheduledDate) : IRequest<Guid>;
}
