using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class CropCycleHarvestedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public string CropType { get; }
        public decimal TotalWipCost { get; }
        public DateTime HarvestDate { get; }

        public CropCycleHarvestedIntegrationEvent(Guid tenantId, string cropType, decimal totalWipCost, DateTime harvestDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            CropType = cropType;
            TotalWipCost = totalWipCost;
            HarvestDate = harvestDate;
        }
    }
}
