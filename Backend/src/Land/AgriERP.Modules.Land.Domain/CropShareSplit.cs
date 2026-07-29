using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Land.Domain
{
    public class CropShareSplit : AggregateRoot, IMultiTenant
    {
        public Guid LandLeaseId { get; set; }
        public string CropType { get; set; } = string.Empty;
        public double LandlordSharePercent { get; set; }
        public double TenantSharePercent { get; set; }
        public Guid TenantId { get; set; }
    }
}
