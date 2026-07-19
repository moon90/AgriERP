using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Assets.Domain
{
    public class Asset : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; } = null!;
        public string AssetNumber { get; private set; } = null!;
        public string Category { get; private set; } = null!;
        public DateTime PurchaseDate { get; private set; }
        public decimal PurchasePrice { get; private set; }
        public int UsefulLifeMonths { get; private set; }
        public int RemainingLifeMonths { get; private set; }
        public decimal AccumulatedDepreciation { get; private set; }
        public DateTime? LastDepreciationDate { get; private set; }
        public decimal CurrentRuntimeHours { get; private set; }
        public decimal CurrentOdometerKm { get; private set; }
        public string Status { get; private set; } = "Active"; // Active, UnderMaintenance, Retired

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected Asset()
        {
        }

        public Asset(
            Guid tenantId,
            string name,
            string assetNumber,
            string category,
            DateTime purchaseDate,
            decimal purchasePrice,
            int usefulLifeMonths)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            AssetNumber = assetNumber ?? throw new ArgumentNullException(nameof(assetNumber));
            Category = category ?? throw new ArgumentNullException(nameof(category));
            PurchaseDate = purchaseDate;
            PurchasePrice = purchasePrice >= 0 ? purchasePrice : throw new ArgumentException("Purchase price cannot be negative.");
            UsefulLifeMonths = usefulLifeMonths > 0 ? usefulLifeMonths : throw new ArgumentException("Useful life months must be greater than zero.");
            RemainingLifeMonths = usefulLifeMonths;
            AccumulatedDepreciation = 0;
            Status = "Active";
            CurrentRuntimeHours = 0;
            CurrentOdometerKm = 0;
        }

        public void UpdateMetrics(decimal? runtimeHours, decimal? odometerKm)
        {
            if (runtimeHours.HasValue)
            {
                if (runtimeHours.Value < CurrentRuntimeHours)
                    throw new ArgumentException("New runtime hours cannot be less than current runtime hours.");
                CurrentRuntimeHours = runtimeHours.Value;
            }

            if (odometerKm.HasValue)
            {
                if (odometerKm.Value < CurrentOdometerKm)
                    throw new ArgumentException("New odometer reading cannot be less than current odometer reading.");
                CurrentOdometerKm = odometerKm.Value;
            }
        }

        public void SetStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new ArgumentNullException(nameof(status));
            Status = status;
        }

        public void ApplyDepreciation(decimal amount, DateTime date)
        {
            if (amount < 0)
                throw new ArgumentException("Depreciation amount cannot be negative.");

            if (AccumulatedDepreciation + amount > PurchasePrice)
            {
                amount = PurchasePrice - AccumulatedDepreciation;
            }

            AccumulatedDepreciation += amount;
            LastDepreciationDate = date;

            if (RemainingLifeMonths > 0)
            {
                RemainingLifeMonths--;
            }
        }
    }
}
