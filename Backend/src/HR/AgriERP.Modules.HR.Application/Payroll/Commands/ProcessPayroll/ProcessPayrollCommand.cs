using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.HR.Application.Payroll.Commands.ProcessPayroll
{
    public record ProcessPayrollCommand(
        DateTime StartDate,
        DateTime EndDate
    ) : IRequest<Guid>;

    public class ProcessPayrollCommandHandler : IRequestHandler<ProcessPayrollCommand, Guid>
    {
        private readonly IHrDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public ProcessPayrollCommandHandler(IHrDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(ProcessPayrollCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Get or Create Payroll Period
            var period = await _context.PayrollPeriods
                .FirstOrDefaultAsync(p => p.StartDate == request.StartDate.Date &&
                                          p.EndDate == request.EndDate.Date,
                                     cancellationToken);

            if (period == null)
            {
                period = new PayrollPeriod(tenantId, request.StartDate, request.EndDate);
                _context.PayrollPeriods.Add(period);
            }
            else if (period.Status == "Paid")
            {
                throw new Exception("Payroll for this period has already been paid.");
            }

            // Clean up existing unpaid slips for this run to avoid duplicates
            var existingSlips = await _context.Payslips
                .Where(s => s.PayrollPeriodId == period.Id)
                .ToListAsync(cancellationToken);
            _context.Payslips.RemoveRange(existingSlips);

            // 2. Fetch all active employees
            var employees = await _context.Employees
                .Where(e => e.Status == "Active")
                .ToListAsync(cancellationToken);

            foreach (var employee in employees)
            {
                decimal grossEarnings = 0;

                if (employee.IsHourly)
                {
                    // Sum approved work hours
                    var approvedHours = await _context.TimeCards
                        .Where(tc => tc.EmployeeId == employee.Id &&
                                     tc.Date >= request.StartDate.Date &&
                                     tc.Date <= request.EndDate.Date &&
                                     tc.IsApproved)
                        .SumAsync(tc => (double)tc.HoursWorked, cancellationToken);

                    grossEarnings = (decimal)approvedHours * employee.BaseHourlyRate;
                }
                else
                {
                    grossEarnings = employee.MonthlySalary;
                }

                // If no earnings, skip payslip
                if (grossEarnings <= 0)
                {
                    continue;
                }

                var payslip = new Payslip(tenantId, period.Id, employee.Id, grossEarnings);
                _context.Payslips.Add(payslip);
            }

            period.MarkProcessed();
            await _context.SaveChangesAsync(cancellationToken);

            return period.Id;
        }
    }
}
