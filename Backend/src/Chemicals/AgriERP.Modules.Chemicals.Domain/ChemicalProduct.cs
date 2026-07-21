using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Chemicals.Domain
{
    public class ChemicalProduct : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string ProductName { get; private set; } = null!;
        public string RegistrationNumber { get; private set; } = null!; // EPA permit code
        public int SafetyIntervalHours { get; private set; } // Restricted Entry Interval (REI)
        public decimal StockQuantityLiters { get; private set; }
        public decimal CostPerLiter { get; private set; }

        // Auditing
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected ChemicalProduct()
        {
        }

        public ChemicalProduct(
            Guid tenantId,
            string productName,
            string registrationNumber,
            int safetyIntervalHours,
            decimal stockQuantityLiters,
            decimal costPerLiter)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            ProductName = productName ?? throw new ArgumentNullException(nameof(productName));
            RegistrationNumber = registrationNumber ?? throw new ArgumentNullException(nameof(registrationNumber));
            SafetyIntervalHours = safetyIntervalHours >= 0 ? safetyIntervalHours : throw new ArgumentException("Safety interval cannot be negative.");
            StockQuantityLiters = stockQuantityLiters >= 0 ? stockQuantityLiters : throw new ArgumentException("Stock quantity cannot be negative.");
            CostPerLiter = costPerLiter >= 0 ? costPerLiter : throw new ArgumentException("Cost per liter cannot be negative.");
        }

        public void DeductStock(decimal liters)
        {
            if (liters < 0)
                throw new ArgumentException("Deduction liters cannot be negative.");
            
            if (StockQuantityLiters < liters)
                throw new InvalidOperationException($"Insufficient chemical stock. Available: {StockQuantityLiters} L, Required: {liters} L.");

            StockQuantityLiters -= liters;
        }

        public void AddStock(decimal liters)
        {
            if (liters < 0)
                throw new ArgumentException("Add stock liters cannot be negative.");

            StockQuantityLiters += liters;
        }
    }
}
