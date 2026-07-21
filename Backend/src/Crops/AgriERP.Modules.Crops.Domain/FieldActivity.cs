using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Crops.Domain
{
    public class FieldActivity : Entity, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid CropCycleId { get; private set; }
        public string ActivityType { get; private set; } = null!; // Tilling, Planting, Fertilizer, Pesticide, Harvesting
        public DateTime ActivityDate { get; private set; }
        public decimal Cost { get; private set; }
        public Guid? InputMaterialId { get; private set; } // Optional reference to raw material stock item consumed
        public decimal? InputQuantity { get; private set; }
        public string Notes { get; private set; } = null!;

        protected FieldActivity()
        {
        }

        public FieldActivity(
            Guid tenantId,
            Guid cropCycleId,
            string activityType,
            DateTime activityDate,
            decimal cost,
            Guid? inputMaterialId,
            decimal? inputQuantity,
            string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            CropCycleId = cropCycleId;
            ActivityType = activityType ?? throw new ArgumentNullException(nameof(activityType));
            ActivityDate = activityDate;
            Cost = cost >= 0 ? cost : throw new ArgumentException("Activity cost cannot be negative.");
            InputMaterialId = inputMaterialId;
            InputQuantity = inputQuantity;
            Notes = notes ?? string.Empty;
        }
    }
}
