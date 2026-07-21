using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class SoilTestBilledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public string LabName { get; }
        public string SampleCode { get; }
        public DateTime BillingDate { get; }

        public SoilTestBilledIntegrationEvent(
            Guid tenantId,
            decimal amount,
            string labName,
            string sampleCode,
            DateTime billingDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            LabName = labName;
            SampleCode = sampleCode;
            BillingDate = billingDate;
        }
    }
}
