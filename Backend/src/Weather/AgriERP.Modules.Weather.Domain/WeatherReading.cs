using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Weather.Domain
{
    public class WeatherReading : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid WeatherStationId { get; private set; }
        public DateTime ReadingTime { get; private set; }
        public decimal TemperatureCelsius { get; private set; }
        public decimal HumidityPercentage { get; private set; }
        public decimal WindSpeedKph { get; private set; }
        public decimal PrecipitationMm { get; private set; }
        public decimal SoilMoisturePercentage { get; private set; }
        public bool IsFrostRisk { get; private set; }

        protected WeatherReading()
        {
        }

        public WeatherReading(
            Guid tenantId,
            Guid weatherStationId,
            DateTime readingTime,
            decimal temperatureCelsius,
            decimal humidityPercentage,
            decimal windSpeedKph,
            decimal precipitationMm,
            decimal soilMoisturePercentage,
            bool isFrostRisk)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            WeatherStationId = weatherStationId;
            ReadingTime = readingTime;
            TemperatureCelsius = temperatureCelsius;
            HumidityPercentage = humidityPercentage;
            WindSpeedKph = windSpeedKph;
            PrecipitationMm = precipitationMm;
            SoilMoisturePercentage = soilMoisturePercentage;
            IsFrostRisk = isFrostRisk;
        }
    }
}
