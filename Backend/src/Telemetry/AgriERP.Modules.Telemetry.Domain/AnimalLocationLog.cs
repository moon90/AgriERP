using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Telemetry.Domain
{
    public class AnimalLocationLog : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid AnimalId { get; private set; } // References Animal inside Livestock module
        public decimal Latitude { get; private set; }
        public decimal Longitude { get; private set; }
        public DateTime RecordedAt { get; private set; }
        public bool IsWithinBounds { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected AnimalLocationLog() { }

        public AnimalLocationLog(Guid tenantId, Guid animalId, decimal latitude, decimal longitude, bool isWithinBounds)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AnimalId = animalId;
            Latitude = latitude;
            Longitude = longitude;
            RecordedAt = DateTime.UtcNow;
            IsWithinBounds = isWithinBounds;
        }
    }
}
