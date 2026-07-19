using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class PayrollPaidIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid PayrollPeriodId { get; }
        public decimal TotalGrossEarnings { get; }
        public decimal TotalTaxDeductions { get; }
        public decimal TotalNetPay { get; }

        public PayrollPaidIntegrationEvent(Guid tenantId, Guid payrollPeriodId, decimal totalGrossEarnings, decimal totalTaxDeductions, decimal totalNetPay)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            PayrollPeriodId = payrollPeriodId;
            TotalGrossEarnings = totalGrossEarnings;
            TotalTaxDeductions = totalTaxDeductions;
            TotalNetPay = totalNetPay;
        }
    }
}
