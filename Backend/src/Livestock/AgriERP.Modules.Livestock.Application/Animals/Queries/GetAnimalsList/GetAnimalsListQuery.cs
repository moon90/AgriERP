using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Queries.GetAnimalsList
{
    // ফ্রন্টএন্ডে আমরা ঠিক যে যে ডেটা দেখাতে চাই, তার DTO
    public record AnimalDto(
        Guid Id,
        string TagNumber,
        string Species,
        string Purpose,
        string Status,
        decimal CurrentWeight,
        DateTime DateOfBirth);
    // MediatR Query যা AnimalDto এর একটি লিস্ট রিটার্ন করবে
    public record GetAnimalsListQuery : IRequest<IEnumerable<AnimalDto>>;
}
