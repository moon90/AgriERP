using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Finance.Domain;
using AgriERP.Modules.Finance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Events
{
    public class FieldLaborIntegrationEventHandler : INotificationHandler<FieldLaborAllocatedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public FieldLaborIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(FieldLaborAllocatedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Direct Field Labor Expense (Expense - Code: 5110)
            var directLaborExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5110" && a.TenantId == tenantId, cancellationToken);

            if (directLaborExpenseAccount == null)
            {
                directLaborExpenseAccount = new GeneralLedgerAccount(tenantId, "5110", "Direct Field Labor Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(directLaborExpenseAccount, cancellationToken);
            }

            // 2. Fetch or create Accrued Payroll & Labor Liability (Liability - Code: 2210)
            var accruedLaborLiabilityAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "2210" && a.TenantId == tenantId, cancellationToken);

            if (accruedLaborLiabilityAccount == null)
            {
                accruedLaborLiabilityAccount = new GeneralLedgerAccount(tenantId, "2210", "Accrued Payroll & Labor Liability", "Liability");
                await _context.GeneralLedgerAccounts.AddAsync(accruedLaborLiabilityAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.AllocationDate,
                description: $"Direct Field Labor - {notification.ActivityType} ({notification.HoursWorked} hrs @ ${notification.HourlyRate}/hr)"
            );

            // Debit Direct Field Labor Expense (5110)
            journalEntry.AddLine(
                accountId: directLaborExpenseAccount.Id,
                debitAmount: notification.TotalLaborCost,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Accrued Payroll & Labor Liability (2210)
            journalEntry.AddLine(
                accountId: accruedLaborLiabilityAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalLaborCost,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
