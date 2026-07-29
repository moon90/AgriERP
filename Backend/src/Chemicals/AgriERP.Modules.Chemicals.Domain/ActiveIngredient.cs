using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Chemicals.Domain
{
    public class ActiveIngredient : Entity
    {
        public Guid ChemicalProductId { get; set; }
        public string IngredientName { get; set; } = string.Empty;
        public double ConcentrationPercent { get; set; }
        public string? EPARegistrationNumber { get; set; }
    }
}
