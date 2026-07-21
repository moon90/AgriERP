using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Weather.Domain
{
    public class FrostAlertConfig : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid FieldId { get; private set; }
        public decimal TemperatureThreshold { get; private set; } // default 2.0C
        public string AlertEmail { get; private set; } = null!;
        public bool IsAlertActive { get; private set; }

        protected FrostAlertConfig()
        {
        }

        public FrostAlertConfig(
            Guid tenantId,
            Guid fieldId,
            decimal temperatureThreshold,
            string alertEmail,
            bool isAlertActive = true)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FieldId = fieldId;
            TemperatureThreshold = temperatureThreshold;
            AlertEmail = alertEmail ?? throw new ArgumentNullException(nameof(alertEmail));
            IsAlertActive = isAlertActive;
        }

        public void UpdateConfig(decimal temperatureThreshold, string alertEmail, bool isAlertActive)
        {
            TemperatureThreshold = temperatureThreshold;
            AlertEmail = alertEmail ?? throw new ArgumentNullException(nameof(alertEmail));
            IsAlertActive = isAlertActive;
        }
    }
}
