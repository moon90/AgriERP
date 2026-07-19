using System;
using AgriERP.BuildingBlocks.Domain;

namespace AgriERP.Modules.HR.Domain
{
    public class Employee : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public string FirstName { get; private set; } = null!;
        public string LastName { get; private set; } = null!;
        public string Email { get; private set; } = null!;
        public string Phone { get; private set; } = null!;
        public string Role { get; private set; } = null!;
        public decimal BaseHourlyRate { get; private set; }
        public decimal MonthlySalary { get; private set; }
        public bool IsHourly { get; private set; }
        public string Status { get; private set; } = "Active"; // Active, Terminated
        public DateTime JoinedDate { get; private set; }
        public DateTime CreatedAt { get; private set; }

        private Employee() { } // EF Core

        public Employee(Guid tenantId, string firstName, string lastName, string email, string phone, string role, decimal baseHourlyRate, decimal monthlySalary, bool isHourly)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            Role = role;
            BaseHourlyRate = baseHourlyRate;
            MonthlySalary = monthlySalary;
            IsHourly = isHourly;
            Status = "Active";
            JoinedDate = DateTime.UtcNow;
            CreatedAt = DateTime.UtcNow;
        }

        public void Terminate()
        {
            Status = "Terminated";
        }
    }
}
