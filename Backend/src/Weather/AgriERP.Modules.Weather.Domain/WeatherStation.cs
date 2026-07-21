using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Weather.Domain
{
    public class WeatherStation : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public string StationName { get; private set; } = null!;
        public decimal LocationLatitude { get; private set; }
        public decimal LocationLongitude { get; private set; }
        public bool IsActive { get; private set; }

        protected WeatherStation()
        {
        }

        public WeatherStation(
            Guid tenantId,
            string stationName,
            decimal locationLatitude,
            decimal locationLongitude,
            bool isActive = true)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            StationName = stationName ?? throw new ArgumentNullException(nameof(stationName));
            LocationLatitude = locationLatitude;
            LocationLongitude = locationLongitude;
            IsActive = isActive;
        }

        public void UpdateStatus(bool isActive)
        {
            IsActive = isActive;
        }
    }
}
