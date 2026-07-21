using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class HedgeClosedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public decimal RealizedPnl { get; }
        public string Symbol { get; }
        public DateTime CloseDate { get; }

        public HedgeClosedIntegrationEvent(Guid tenantId, decimal realizedPnl, string symbol, DateTime closeDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            RealizedPnl = realizedPnl;
            Symbol = symbol;
            CloseDate = closeDate;
        }
    }
}
