using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Assets.Domain
{
    public class FuelLog : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid AssetId { get; set; }
        public DateTime FuelDate { get; set; }
        public string FuelType { get; set; } = "Diesel";
        public double GallonsFilled { get; set; }
        public double? OdometerReading { get; set; }
        public decimal CostPerGallon { get; set; }
        public decimal TotalCost { get; set; }
        public Guid TenantId { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
