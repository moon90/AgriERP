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
    public class PayrollPaidIntegrationEventHandler : INotificationHandler<PayrollPaidIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public PayrollPaidIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(PayrollPaidIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Wages & Salaries Expense Account (Expense - Code: 5100)
            var wagesExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5100" && a.TenantId == tenantId, cancellationToken);

            if (wagesExpenseAccount == null)
            {
                wagesExpenseAccount = new GeneralLedgerAccount(tenantId, "5100", "Wages & Salaries Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(wagesExpenseAccount, cancellationToken);
            }

            // 2. Fetch or create Payroll Tax Liability Account (Liability - Code: 2200)
            var taxLiabilityAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "2200" && a.TenantId == tenantId, cancellationToken);

            if (taxLiabilityAccount == null)
            {
                taxLiabilityAccount = new GeneralLedgerAccount(tenantId, "2200", "Payroll Tax Liability", "Liability");
                await _context.GeneralLedgerAccounts.AddAsync(taxLiabilityAccount, cancellationToken);
            }

            // 3. Fetch or create Cash & Bank Account (Asset - Code: 1010)
            var cashAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1010" && a.TenantId == tenantId, cancellationToken);

            if (cashAccount == null)
            {
                cashAccount = new GeneralLedgerAccount(tenantId, "1010", "Cash & Bank", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(cashAccount, cancellationToken);
            }

            // Save accounts if any were newly created
            await _context.SaveChangesAsync(cancellationToken);

            // 4. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: DateTime.UtcNow,
                description: $"Payroll Disbursement - Period {notification.PayrollPeriodId}"
            );

            // Line 1: Debit Wages & Salaries Expense (Gross Earnings)
            journalEntry.AddLine(
                accountId: wagesExpenseAccount.Id,
                debitAmount: notification.TotalGrossEarnings,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Payroll Tax Liability (Withholdings)
            journalEntry.AddLine(
                accountId: taxLiabilityAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalTaxDeductions,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 3: Credit Cash & Bank (Net Pay disbursed)
            journalEntry.AddLine(
                accountId: cashAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalNetPay,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Post and validate double-entry matching (Debit Sum == Credit Sum)
            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
