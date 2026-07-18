using MediatR;
using System;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordInsemination
{
    public record RecordInseminationCommand(
        Guid FemaleAnimalId,
        Guid? MaleAnimalId,
        DateTime InseminationDate,
        string InseminationType) : IRequest<Guid>;
}
