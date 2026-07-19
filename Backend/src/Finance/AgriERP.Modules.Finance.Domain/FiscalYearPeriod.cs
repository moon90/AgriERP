using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Finance.Domain
{
    public class FiscalYearPeriod : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public int Year { get; private set; }
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public bool IsClosed { get; private set; }
        public DateTime? ClosedAt { get; private set; }
        public string? ClosedBy { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected FiscalYearPeriod()
        {
        }

        public FiscalYearPeriod(Guid tenantId, int year, DateTime startDate, DateTime endDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Year = year;
            StartDate = startDate.Date;
            EndDate = endDate.Date;
            IsClosed = false;
        }

        public void Close(string closedBy)
        {
            if (IsClosed)
                throw new InvalidOperationException($"Fiscal year {Year} is already closed.");

            IsClosed = true;
            ClosedAt = DateTime.UtcNow;
            ClosedBy = closedBy;
        }
    }
}
