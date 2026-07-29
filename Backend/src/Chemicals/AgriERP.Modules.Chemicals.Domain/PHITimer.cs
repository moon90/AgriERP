using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Chemicals.Domain
{
    public class PHITimer : AggregateRoot, IMultiTenant
    {
        public Guid ApplicationLogId { get; set; }
        public Guid CropFieldId { get; set; }
        public int PHIDays { get; set; }
        public DateTime ApplicationDate { get; set; }
        public DateTime SafeHarvestDate { get; set; }
        public bool IsExpired { get; set; }
        public Guid TenantId { get; set; }
    }
}
