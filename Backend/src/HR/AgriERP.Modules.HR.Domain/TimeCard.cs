using System;
using AgriERP.BuildingBlocks.Domain;

namespace AgriERP.Modules.HR.Domain
{
    public class TimeCard : Entity, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid EmployeeId { get; private set; }
        public DateTime Date { get; private set; }
        public TimeSpan ClockIn { get; private set; }
        public TimeSpan ClockOut { get; private set; }
        public decimal HoursWorked { get; private set; }
        public bool IsApproved { get; private set; }
        public string? ApprovedBy { get; private set; }
        public DateTime? ApprovedAt { get; private set; }

        private TimeCard() { } // EF Core

        public TimeCard(Guid tenantId, Guid employeeId, DateTime date, TimeSpan clockIn, TimeSpan clockOut)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            EmployeeId = employeeId;
            Date = date.Date;
            ClockIn = clockIn;
            ClockOut = clockOut;
            
            // Compute hours worked
            var diff = clockOut - clockIn;
            HoursWorked = (decimal)Math.Round(diff.TotalHours, 2);
            IsApproved = false;
        }

        public void Approve(string managerName)
        {
            IsApproved = true;
            ApprovedBy = managerName;
            ApprovedAt = DateTime.UtcNow;
        }
    }
}
