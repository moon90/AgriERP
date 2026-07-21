using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class StorageChargeBilledIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public string TicketNumber { get; }
        public DateTime ChargeDate { get; }

        public StorageChargeBilledIntegrationEvent(Guid tenantId, decimal amount, string ticketNumber, DateTime chargeDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            TicketNumber = ticketNumber;
            ChargeDate = chargeDate;
        }
    }
}
