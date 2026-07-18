using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Commands.SlaughterAnimal
{
    public record SlaughterAnimalCommand(Guid AnimalId) : IRequest;
}
