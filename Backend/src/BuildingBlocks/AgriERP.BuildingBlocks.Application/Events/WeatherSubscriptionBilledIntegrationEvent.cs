using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class WeatherSubscriptionBilledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public DateTime BillingDate { get; }

        public WeatherSubscriptionBilledIntegrationEvent(
            Guid tenantId,
            decimal amount,
            DateTime billingDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            BillingDate = billingDate;
        }
    }
}
