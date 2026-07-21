using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class WaterUsageBilledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public string SourceName { get; }
        public string PermitNumber { get; }
        public DateTime BillingDate { get; }

        public WaterUsageBilledIntegrationEvent(
            Guid tenantId,
            decimal amount,
            string sourceName,
            string permitNumber,
            DateTime billingDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            SourceName = sourceName;
            PermitNumber = permitNumber;
            BillingDate = billingDate;
        }
    }
}
