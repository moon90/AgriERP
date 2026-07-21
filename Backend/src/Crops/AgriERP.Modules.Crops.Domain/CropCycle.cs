using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Crops.Domain
{
    public class CropCycle : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid FieldId { get; private set; }
        public string CropType { get; private set; } = null!; // Corn, Wheat, Soybeans
        public string CropVariety { get; private set; } = null!;
        public string Status { get; private set; } = "Planned"; // Planned, Planted, Growing, Harvested, Aborted
        public DateTime PlantingDate { get; private set; }
        public DateTime? HarvestDate { get; private set; }
        public decimal ExpectedYieldTons { get; private set; }
        public decimal? ActualYieldTons { get; private set; }
        public decimal AccumulatedWipCost { get; private set; }

        // Flags for dynamic forecasting multipliers
        public bool HasTilled { get; private set; }
        public bool HasFertilized { get; private set; }
        public bool HasPesticided { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected CropCycle()
        {
        }

        public CropCycle(
            Guid tenantId,
            Guid fieldId,
            string cropType,
            string cropVariety,
            DateTime plantingDate,
            decimal fieldArea,
            string soilType)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FieldId = fieldId;
            CropType = cropType ?? throw new ArgumentNullException(nameof(cropType));
            CropVariety = cropVariety ?? throw new ArgumentNullException(nameof(cropVariety));
            PlantingDate = plantingDate;
            Status = "Planned";
            AccumulatedWipCost = 0;
            
            HasTilled = false;
            HasFertilized = false;
            HasPesticided = false;

            RecalculateForecast(fieldArea, soilType);
        }

        public void SetStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new ArgumentNullException(nameof(status));
            Status = status;
        }

        public void AccumulateCost(decimal cost)
        {
            if (cost < 0)
                throw new ArgumentException("WIP cost cannot be negative.");
            AccumulatedWipCost += cost;
        }

        public void RegisterActivity(string activityType, decimal fieldArea, string soilType)
        {
            switch (activityType.ToLower())
            {
                case "tilling":
                    HasTilled = true;
                    break;
                case "fertilizer":
                case "fertilizing":
                case "fertilizer application":
                    HasFertilized = true;
                    break;
                case "pesticide":
                case "pesticide application":
                    HasPesticided = true;
                    break;
            }

            RecalculateForecast(fieldArea, soilType);
        }

        public void RecalculateForecast(decimal fieldArea, string soilType)
        {
            decimal baseYield = CropType.ToLower() switch
            {
                "corn" => 4.5m,
                "wheat" => 2.2m,
                "soybeans" => 1.8m,
                _ => 2.0m
            };

            decimal soilFactor = soilType.ToLower() switch
            {
                "loam" => 1.2m,
                "clay" => 0.9m,
                "sandy" => 0.7m,
                _ => 1.0m
            };

            decimal activityFactor = 0.65m;
            if (HasTilled) activityFactor += 0.10m;
            if (HasFertilized) activityFactor += 0.15m;
            if (HasPesticided) activityFactor += 0.10m;

            ExpectedYieldTons = fieldArea * baseYield * soilFactor * activityFactor;
        }

        public void Harvest(DateTime harvestDate, decimal actualYield)
        {
            if (Status == "Harvested")
                throw new InvalidOperationException("This crop cycle has already been harvested.");

            HarvestDate = harvestDate;
            ActualYieldTons = actualYield;
            Status = "Harvested";
        }
    }
}
