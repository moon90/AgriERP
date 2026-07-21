using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class ContractDeliveredIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal BillingAmount { get; }
        public string ContractNumber { get; }
        public DateTime DeliveryDate { get; }

        public ContractDeliveredIntegrationEvent(Guid tenantId, decimal billingAmount, string contractNumber, DateTime deliveryDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            BillingAmount = billingAmount;
            ContractNumber = contractNumber;
            DeliveryDate = deliveryDate;
        }
    }
}
