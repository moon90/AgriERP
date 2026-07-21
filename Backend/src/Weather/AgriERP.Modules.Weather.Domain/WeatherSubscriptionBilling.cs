using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Weather.Domain
{
    public class WeatherSubscriptionBilling : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public decimal SubscriptionFee { get; private set; }
        public DateTime BillingDate { get; private set; }

        protected WeatherSubscriptionBilling()
        {
        }

        public WeatherSubscriptionBilling(
            Guid tenantId,
            decimal subscriptionFee,
            DateTime billingDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            SubscriptionFee = subscriptionFee >= 0 ? subscriptionFee : throw new ArgumentException("Subscription fee cannot be negative.");
            BillingDate = billingDate;
        }
    }
}
