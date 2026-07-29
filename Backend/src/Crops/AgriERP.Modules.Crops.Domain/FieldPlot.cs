using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Crops.Domain
{
    public class FieldPlot : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid CropFieldId { get; set; }
        public string Name { get; set; } = string.Empty;
        public double AreaAcres { get; set; }
        public double? GpsLatitude { get; set; }
        public double? GpsLongitude { get; set; }
        public string? SoilType { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
