using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;

namespace AgriERP.Modules.Telemetry.Domain
{
    public class IotDevice : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; }
        public string DeviceType { get; private set; } // Sensor, Actuator
        public string Status { get; private set; } // Active, Offline
        public DateTime LastSeenAt { get; private set; }

        private readonly List<TelemetryReading> _readings = new();
        public virtual IReadOnlyCollection<TelemetryReading> Readings => _readings.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected IotDevice() 
        {
            Name = null!;
            DeviceType = null!;
            Status = null!;
        }

        public IotDevice(Guid tenantId, string name, string deviceType)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            DeviceType = deviceType ?? throw new ArgumentNullException(nameof(deviceType));
            Status = "Active";
            LastSeenAt = DateTime.UtcNow;
        }

        public void UpdateStatus(string status)
        {
            Status = status ?? throw new ArgumentNullException(nameof(status));
            LastSeenAt = DateTime.UtcNow;
        }

        public void IngestReading(string metricName, decimal metricValue)
        {
            var reading = new TelemetryReading(Id, metricName, metricValue);
            _readings.Add(reading);
            LastSeenAt = DateTime.UtcNow;
        }
    }
}
