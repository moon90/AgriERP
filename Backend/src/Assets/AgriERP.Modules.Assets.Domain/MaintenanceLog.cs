using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Assets.Domain
{
    public class MaintenanceLog : Entity, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid AssetId { get; private set; }
        public string ServiceType { get; private set; } = null!;
        public DateTime ServiceDate { get; private set; }
        public decimal Cost { get; private set; }
        public string PerformedBy { get; private set; } = null!;
        public string Description { get; private set; } = null!;
        public decimal? RuntimeHoursAtService { get; private set; }
        public decimal? OdometerKmAtService { get; private set; }

        protected MaintenanceLog()
        {
        }

        public MaintenanceLog(
            Guid tenantId,
            Guid assetId,
            string serviceType,
            DateTime serviceDate,
            decimal cost,
            string performedBy,
            string description,
            decimal? runtimeHoursAtService,
            decimal? odometerKmAtService)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AssetId = assetId;
            ServiceType = serviceType ?? throw new ArgumentNullException(nameof(serviceType));
            ServiceDate = serviceDate;
            Cost = cost >= 0 ? cost : throw new ArgumentException("Maintenance cost cannot be negative.");
            PerformedBy = performedBy ?? throw new ArgumentNullException(nameof(performedBy));
            Description = description ?? throw new ArgumentNullException(nameof(description));
            RuntimeHoursAtService = runtimeHoursAtService;
            OdometerKmAtService = odometerKmAtService;
        }
    }
}
