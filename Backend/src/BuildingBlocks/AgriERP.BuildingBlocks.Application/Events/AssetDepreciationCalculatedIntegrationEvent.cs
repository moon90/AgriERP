using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class AssetDepreciationCalculatedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal TotalDepreciationAmount { get; }
        public DateTime ExecutionDate { get; }

        public AssetDepreciationCalculatedIntegrationEvent(Guid tenantId, decimal totalDepreciationAmount, DateTime executionDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            TotalDepreciationAmount = totalDepreciationAmount;
            ExecutionDate = executionDate;
        }
    }
}
