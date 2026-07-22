using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class InsurancePremiumBilledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal PremiumAmount { get; }
        public string ProviderName { get; }
        public string PolicyNumber { get; }
        public DateTime BillingDate { get; }

        public InsurancePremiumBilledIntegrationEvent(
            Guid tenantId,
            decimal premiumAmount,
            string providerName,
            string policyNumber,
            DateTime billingDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            PremiumAmount = premiumAmount;
            ProviderName = providerName;
            PolicyNumber = policyNumber;
            BillingDate = billingDate;
        }
    }
}
