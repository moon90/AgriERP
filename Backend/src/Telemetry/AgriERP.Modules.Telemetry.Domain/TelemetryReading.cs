using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Telemetry.Domain
{
    public class TelemetryReading : Entity
    {
        public Guid DeviceId { get; private set; }
        public string MetricName { get; private set; } // SoilMoisture, Temperature, WaterFlow
        public decimal MetricValue { get; private set; }
        public DateTime RecordedAt { get; private set; }

        protected TelemetryReading() 
        {
            MetricName = null!;
        }

        public TelemetryReading(Guid deviceId, string metricName, decimal metricValue)
        {
            DeviceId = deviceId;
            MetricName = metricName ?? throw new ArgumentNullException(nameof(metricName));
            MetricValue = metricValue;
            RecordedAt = DateTime.UtcNow;
        }
    }
}
