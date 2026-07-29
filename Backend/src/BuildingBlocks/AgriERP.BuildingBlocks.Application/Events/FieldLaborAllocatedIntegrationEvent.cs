using MediatR;
using System;

namespace AgriERP.BuildingBlocks.Application.Events
{
    public class FieldLaborAllocatedIntegrationEvent : INotification
    {
        public Guid EventId { get; }
        public DateTime OccurredOn { get; }
        public Guid TenantId { get; }
        public Guid EmployeeId { get; }
        public Guid FieldId { get; }
        public decimal HoursWorked { get; }
        public decimal HourlyRate { get; }
        public decimal TotalLaborCost { get; }
        public string ActivityType { get; }
        public DateTime AllocationDate { get; }

        public FieldLaborAllocatedIntegrationEvent(
            Guid tenantId,
            Guid employeeId,
            Guid fieldId,
            decimal hoursWorked,
            decimal hourlyRate,
            decimal totalLaborCost,
            string activityType,
            DateTime allocationDate)
        {
            EventId = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            TenantId = tenantId;
            EmployeeId = employeeId;
            FieldId = fieldId;
            HoursWorked = hoursWorked;
            HourlyRate = hourlyRate;
            TotalLaborCost = totalLaborCost;
            ActivityType = activityType;
            AllocationDate = allocationDate;
        }
    }
}
