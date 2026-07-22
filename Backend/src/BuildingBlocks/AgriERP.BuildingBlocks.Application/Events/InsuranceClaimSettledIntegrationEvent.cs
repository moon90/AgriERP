using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class InsuranceClaimSettledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal PayoutAmount { get; }
        public string ClaimNumber { get; }
        public string PolicyNumber { get; }
        public DateTime SettlementDate { get; }

        public InsuranceClaimSettledIntegrationEvent(
            Guid tenantId,
            decimal payoutAmount,
            string claimNumber,
            string policyNumber,
            DateTime settlementDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            PayoutAmount = payoutAmount;
            ClaimNumber = claimNumber;
            PolicyNumber = policyNumber;
            SettlementDate = settlementDate;
        }
    }
}
