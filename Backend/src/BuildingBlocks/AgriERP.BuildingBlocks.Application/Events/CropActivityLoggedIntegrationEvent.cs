using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class CropActivityLoggedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public string CropType { get; }
        public string ActivityType { get; }
        public decimal Cost { get; }
        public bool IsMaterialConsumption { get; }
        public DateTime ActivityDate { get; }

        public CropActivityLoggedIntegrationEvent(
            Guid tenantId,
            string cropType,
            string activityType,
            decimal cost,
            bool isMaterialConsumption,
            DateTime activityDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            CropType = cropType;
            ActivityType = activityType;
            Cost = cost;
            IsMaterialConsumption = isMaterialConsumption;
            ActivityDate = activityDate;
        }
    }
}
