using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Irrigation.Domain
{
    public class PumpingLog : AggregateRoot, IMultiTenant
    {
        public Guid WaterSourceId { get; set; }
        public DateTime PumpStartTime { get; set; }
        public DateTime? PumpEndTime { get; set; }
        public double GallonsPumped { get; set; }
        public double? EnergyKwh { get; set; }
        public string? Notes { get; set; }
        public Guid TenantId { get; set; }
    }
}
