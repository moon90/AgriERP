using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Logistics.Domain
{
    public class Elevator : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; } = null!;
        public decimal CapacityTons { get; private set; }
        public decimal CurrentStoredTons { get; private set; }
        public decimal RentalRatePerTonPerDay { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected Elevator()
        {
        }

        public Elevator(Guid tenantId, string name, decimal capacityTons, decimal rentalRatePerTonPerDay)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            CapacityTons = capacityTons > 0 ? capacityTons : throw new ArgumentException("Capacity tons must be greater than zero.");
            RentalRatePerTonPerDay = rentalRatePerTonPerDay >= 0 ? rentalRatePerTonPerDay : throw new ArgumentException("Rental rate cannot be negative.");
            CurrentStoredTons = 0;
        }

        public void Store(decimal tons)
        {
            if (tons <= 0)
                throw new ArgumentException("Tons to store must be greater than zero.");

            if (CurrentStoredTons + tons > CapacityTons)
                throw new InvalidOperationException($"Elevator capacity exceeded. Available: {CapacityTons - CurrentStoredTons} Tons, Requested: {tons} Tons.");

            CurrentStoredTons += tons;
        }

        public void Release(decimal tons)
        {
            if (tons <= 0)
                throw new ArgumentException("Tons to release must be greater than zero.");

            if (CurrentStoredTons - tons < 0)
                throw new InvalidOperationException($"Cannot release more tons than currently stored. Occupancy: {CurrentStoredTons} Tons, Requested: {tons} Tons.");

            CurrentStoredTons -= tons;
        }
    }
}
