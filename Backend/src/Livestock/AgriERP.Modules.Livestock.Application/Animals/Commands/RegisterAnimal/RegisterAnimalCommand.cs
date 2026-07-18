using AgriERP.Modules.Livestock.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Commands.RegisterAnimal
{
    // এটি একটি Command যা MediatR এর মাধ্যমে প্রসেস হবে। রিটার্ন টাইপ হবে Guid (নতুন পশুর ID)
    public record RegisterAnimalCommand(string TagNumber,string Species,AnimalPurpose Purpose,DateTime DateOfBirth,decimal InitialWeight) : IRequest<Guid>;
}
