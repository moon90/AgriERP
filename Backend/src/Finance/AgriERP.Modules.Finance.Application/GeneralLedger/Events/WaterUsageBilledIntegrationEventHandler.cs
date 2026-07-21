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
    public class WaterUsageBilledIntegrationEventHandler : INotificationHandler<WaterUsageBilledIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public WaterUsageBilledIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(WaterUsageBilledIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Accounts Payable (Liability - Code: 2100)
            var apAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "2100" && a.TenantId == tenantId, cancellationToken);

            if (apAccount == null)
            {
                apAccount = new GeneralLedgerAccount(tenantId, "2100", "Accounts Payable", "Liability");
                await _context.GeneralLedgerAccounts.AddAsync(apAccount, cancellationToken);
            }

            // 2. Fetch or create Water & Utility Expense (Expense - Code: 5500)
            var waterExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5500" && a.TenantId == tenantId, cancellationToken);

            if (waterExpenseAccount == null)
            {
                waterExpenseAccount = new GeneralLedgerAccount(tenantId, "5500", "Water & Utility Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(waterExpenseAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.BillingDate,
                description: $"Water Utility Billing - Source {notification.SourceName} (Permit {notification.PermitNumber})"
            );

            // Debit Water & Utility Expense (5500)
            journalEntry.AddLine(
                accountId: waterExpenseAccount.Id,
                debitAmount: notification.Amount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Accounts Payable (2100)
            journalEntry.AddLine(
                accountId: apAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.Amount,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
