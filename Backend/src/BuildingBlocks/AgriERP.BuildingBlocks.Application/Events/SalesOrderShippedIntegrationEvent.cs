using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class SalesOrderShippedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid SalesOrderId { get; }
        public decimal TotalSalesRevenue { get; }
        public decimal TotalCOGS { get; }

        public SalesOrderShippedIntegrationEvent(Guid tenantId, Guid salesOrderId, decimal totalSalesRevenue, decimal totalCOGS)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            SalesOrderId = salesOrderId;
            TotalSalesRevenue = totalSalesRevenue;
            TotalCOGS = totalCOGS;
        }
    }
}
