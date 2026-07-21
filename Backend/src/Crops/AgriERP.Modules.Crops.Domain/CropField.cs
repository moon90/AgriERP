using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Crops.Domain
{
    public class CropField : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; } = null!;
        public decimal AreaAcres { get; private set; }
        public string SoilType { get; private set; } = null!; // Loam, Clay, Sandy

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected CropField()
        {
        }

        public CropField(Guid tenantId, string name, decimal areaAcres, string soilType)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            AreaAcres = areaAcres > 0 ? areaAcres : throw new ArgumentException("Area acres must be greater than zero.");
            SoilType = soilType ?? throw new ArgumentNullException(nameof(soilType));
        }

        public void UpdateDetails(string name, decimal areaAcres, string soilType)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            AreaAcres = areaAcres > 0 ? areaAcres : throw new ArgumentException("Area acres must be greater than zero.");
            SoilType = soilType ?? throw new ArgumentNullException(nameof(soilType));
        }
    }
}
