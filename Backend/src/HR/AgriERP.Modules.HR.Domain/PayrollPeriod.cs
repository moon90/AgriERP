using System;
using AgriERP.BuildingBlocks.Domain;

namespace AgriERP.Modules.HR.Domain
{
    public class PayrollPeriod : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public string Status { get; private set; } = "Draft"; // Draft, Processed, Paid
        public DateTime? ProcessedAt { get; private set; }
        public DateTime? PaidAt { get; private set; }

        private PayrollPeriod() { } // EF Core

        public PayrollPeriod(Guid tenantId, DateTime startDate, DateTime endDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            StartDate = startDate.Date;
            EndDate = endDate.Date;
            Status = "Draft";
        }

        public void MarkProcessed()
        {
            Status = "Processed";
            ProcessedAt = DateTime.UtcNow;
        }

        public void MarkPaid()
        {
            Status = "Paid";
            PaidAt = DateTime.UtcNow;
        }
    }
}
