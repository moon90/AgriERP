using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Telemetry.Domain
{
    public class GeofenceZone : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; }
        
        // Bounding-box boundaries for geospatial polygon check
        public decimal MinLatitude { get; private set; }
        public decimal MaxLatitude { get; private set; }
        public decimal MinLongitude { get; private set; }
        public decimal MaxLongitude { get; private set; }
        
        public bool IsActive { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected GeofenceZone() 
        {
            Name = null!;
        }

        public GeofenceZone(Guid tenantId, string name, decimal minLat, decimal maxLat, decimal minLong, decimal maxLong)
        {
            if (minLat > maxLat || minLong > maxLong)
                throw new ArgumentException("Min boundaries cannot be greater than Max boundaries.");

            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            MinLatitude = minLat;
            MaxLatitude = maxLat;
            MinLongitude = minLong;
            MaxLongitude = maxLong;
            IsActive = true;
        }

        public bool IsCoordinateWithinBounds(decimal latitude, decimal longitude)
        {
            return latitude >= MinLatitude && 
                   latitude <= MaxLatitude && 
                   longitude >= MinLongitude && 
                   longitude <= MaxLongitude;
        }

        public void Deactivate()
        {
            IsActive = false;
        }

        public void Activate()
        {
            IsActive = true;
        }
    }
}
