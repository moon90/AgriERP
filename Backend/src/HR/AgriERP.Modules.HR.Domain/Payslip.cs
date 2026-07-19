using System;
using AgriERP.BuildingBlocks.Domain;

namespace AgriERP.Modules.HR.Domain
{
    public class Payslip : Entity, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid PayrollPeriodId { get; private set; }
        public Guid EmployeeId { get; private set; }
        public decimal GrossEarnings { get; private set; }
        public decimal TaxDeductions { get; private set; }
        public decimal NetPay { get; private set; }
        public string Status { get; private set; } = "Unpaid"; // Unpaid, Paid

        private Payslip() { } // EF Core

        public Payslip(Guid tenantId, Guid payrollPeriodId, Guid employeeId, decimal grossEarnings, decimal taxRate = 0.15m)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            PayrollPeriodId = payrollPeriodId;
            EmployeeId = employeeId;
            GrossEarnings = grossEarnings;
            TaxDeductions = Math.Round(grossEarnings * taxRate, 2);
            NetPay = grossEarnings - TaxDeductions;
            Status = "Unpaid";
        }

        public void Pay()
        {
            Status = "Paid";
        }
    }
}
