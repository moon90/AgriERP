using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class LeasePaymentCalculatedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public string LeaseNumber { get; }
        public string PaymentType { get; }
        public DateTime PaymentDate { get; }

        public LeasePaymentCalculatedIntegrationEvent(
            Guid tenantId,
            decimal amount,
            string leaseNumber,
            string paymentType,
            DateTime paymentDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            LeaseNumber = leaseNumber;
            PaymentType = paymentType;
            PaymentDate = paymentDate;
        }
    }
}
