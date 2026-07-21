using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class ChemicalAppliedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal Amount { get; }
        public string ProductName { get; }
        public string RegistrationNumber { get; }
        public DateTime ApplicationDate { get; }

        public ChemicalAppliedIntegrationEvent(
            Guid tenantId,
            decimal amount,
            string productName,
            string registrationNumber,
            DateTime applicationDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            Amount = amount;
            ProductName = productName;
            RegistrationNumber = registrationNumber;
            ApplicationDate = applicationDate;
        }
    }
}
