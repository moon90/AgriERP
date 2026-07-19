using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.HR.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.HR.Application.Payroll.Commands.PayPayroll
{
    public record PayPayrollCommand(
        Guid PayrollPeriodId
    ) : IRequest<bool>;

    public class PayPayrollCommandHandler : IRequestHandler<PayPayrollCommand, bool>
    {
        private readonly IHrDbContext _context;
        private readonly IPublisher _publisher;
        private readonly ITenantProvider _tenantProvider;

        public PayPayrollCommandHandler(IHrDbContext context, IPublisher publisher, ITenantProvider tenantProvider)
        {
            _context = context;
            _publisher = publisher;
            _tenantProvider = tenantProvider;
        }

        public async Task<bool> Handle(PayPayrollCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var period = await _context.PayrollPeriods
                .FirstOrDefaultAsync(p => p.Id == request.PayrollPeriodId, cancellationToken);

            if (period == null)
            {
                throw new Exception("Payroll period not found.");
            }

            if (period.Status == "Paid")
            {
                throw new Exception("Payroll period has already been paid.");
            }

            if (period.Status != "Processed")
            {
                throw new Exception("Payroll must be processed before it can be paid.");
            }

            var payslips = await _context.Payslips
                .Where(s => s.PayrollPeriodId == period.Id && s.Status == "Unpaid")
                .ToListAsync(cancellationToken);

            if (!payslips.Any())
            {
                throw new Exception("No unpaid payslips found for this period.");
            }

            decimal totalGross = 0;
            decimal totalTax = 0;
            decimal totalNet = 0;

            foreach (var slip in payslips)
            {
                slip.Pay();
                totalGross += slip.GrossEarnings;
                totalTax += slip.TaxDeductions;
                totalNet += slip.NetPay;
            }

            period.MarkPaid();
            await _context.SaveChangesAsync(cancellationToken);

            // Publish integration event to post to General Ledger
            var integrationEvent = new PayrollPaidIntegrationEvent(
                tenantId,
                period.Id,
                totalGross,
                totalTax,
                totalNet
            );

            await _publisher.Publish(integrationEvent, cancellationToken);

            return true;
        }
    }
}
