using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Land.Domain
{
    public class Parcel : AggregateRoot, IMultiTenant, IAuditable
    {
        public string ParcelNumber { get; set; } = string.Empty;
        public string? LegalDescription { get; set; }
        public double TotalAcres { get; set; }
        public string? CountyName { get; set; }
        public string? StateName { get; set; }
        public double? GpsLatitude { get; set; }
        public double? GpsLongitude { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
