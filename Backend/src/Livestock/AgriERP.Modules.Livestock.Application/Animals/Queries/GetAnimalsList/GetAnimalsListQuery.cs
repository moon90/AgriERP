using AgriERP.Modules.Livestock.Application.Animals.Queries.DTOs;
using AgriERP.Modules.Livestock.Domain.Enums;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Queries.GetAnimalsList
{
    // MediatR Query যা AnimalDto এর একটি লিস্ট রিটার্ন করবে
    public record GetAnimalsListQuery : IRequest<IEnumerable<AnimalDto>>;
}
