using MediatR;
using System;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordPregnancyCheck
{
    public record RecordPregnancyCheckCommand(
        Guid BreedingCycleId,
        DateTime PregnancyCheckDate,
        string Result) : IRequest;
}
