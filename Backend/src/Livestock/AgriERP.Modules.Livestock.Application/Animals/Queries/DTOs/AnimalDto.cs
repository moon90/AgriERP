using AgriERP.Modules.Livestock.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Animals.Queries.DTOs
{
    public record AnimalDto
    {
        public Guid Id { get; init; }
        public string TagNumber { get; init; } = string.Empty;
        public string Species { get; init; } = string.Empty;
        public AnimalPurpose Purpose { get; init; }
        public AnimalStatus Status { get; init; }
        public DateTime DateOfBirth { get; init; }
        public decimal CurrentWeight { get; init; }
    }
}
