using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Weather.Domain
{
    public class GDDAccumulation : AggregateRoot, IMultiTenant
    {
        public Guid CropFieldId { get; set; }
        public DateTime AccumulationDate { get; set; }
        public double BaseTempF { get; set; }
        public double DailyGDD { get; set; }
        public double CumulativeGDD { get; set; }
        public Guid TenantId { get; set; }
    }
}
