using AgriERP.BuildingBlocks.Domain;
using MediatR;
using System;

namespace AgriERP.Modules.Livestock.Domain.Events
{
    // This is a Domain Event. It is broadcasted across the system using MediatR's INotification mechanism.
    public class AnimalSlaughteredEvent : IDomainEvent
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }

        // Data payload passed to subscribing modules
        public Guid AnimalId { get; }
        public Guid TenantId { get; }
        public decimal MeatYieldKg { get; }

        public AnimalSlaughteredEvent(Guid animalId, Guid tenantId, decimal meatYieldKg)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            AnimalId = animalId;
            TenantId = tenantId;
            MeatYieldKg = meatYieldKg;
        }
    }
}
