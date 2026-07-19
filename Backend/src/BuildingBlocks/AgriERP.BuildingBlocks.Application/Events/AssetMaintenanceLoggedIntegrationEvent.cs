using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class AssetMaintenanceLoggedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public string AssetName { get; }
        public decimal Cost { get; }
        public DateTime ServiceDate { get; }

        public AssetMaintenanceLoggedIntegrationEvent(Guid tenantId, string assetName, decimal cost, DateTime serviceDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            AssetName = assetName;
            Cost = cost;
            ServiceDate = serviceDate;
        }
    }
}
