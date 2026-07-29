using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Assets.Domain
{
    public class DepreciationSchedule : AggregateRoot, IMultiTenant
    {
        public Guid AssetId { get; set; }
        public string Method { get; set; } = "StraightLine";
        public int UsefulLifeYears { get; set; }
        public decimal SalvageValue { get; set; }
        public decimal DepreciationPerYear { get; set; }
        public decimal AccumulatedDepreciation { get; set; }
        public Guid TenantId { get; set; }
    }
}
