using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.HR.Domain
{
    public class FieldLaborAllocation : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid EmployeeId { get; private set; }
        public Guid FieldId { get; private set; }
        public DateTime AllocationDate { get; private set; }
        public decimal HoursWorked { get; private set; }
        public decimal HourlyRate { get; private set; }
        public decimal TotalLaborCost { get; private set; }
        public string ActivityType { get; private set; } = null!; // Planting, Pruning, Harvesting, Spraying, Weeding, Irrigation
        public string Notes { get; private set; } = "";

        protected FieldLaborAllocation()
        {
        }

        public FieldLaborAllocation(
            Guid tenantId,
            Guid employeeId,
            Guid fieldId,
            DateTime allocationDate,
            decimal hoursWorked,
            decimal hourlyRate,
            string activityType,
            string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            EmployeeId = employeeId;
            FieldId = fieldId;
            AllocationDate = allocationDate;
            HoursWorked = hoursWorked >= 0 ? hoursWorked : throw new ArgumentException("Hours worked cannot be negative.");
            HourlyRate = hourlyRate >= 0 ? hourlyRate : throw new ArgumentException("Hourly rate cannot be negative.");
            TotalLaborCost = Math.Round(HoursWorked * HourlyRate, 2);
            ActivityType = activityType ?? throw new ArgumentNullException(nameof(activityType));
            Notes = notes ?? "";
        }
    }
}
