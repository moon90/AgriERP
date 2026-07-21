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
    public class WeatherSubscriptionBilledIntegrationEventHandler : INotificationHandler<WeatherSubscriptionBilledIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public WeatherSubscriptionBilledIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(WeatherSubscriptionBilledIntegrationEvent notification, CancellationToken cancellationToken)
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

            // 2. Fetch or create Subscriptions Expense (Expense - Code: 5800)
            var subExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5800" && a.TenantId == tenantId, cancellationToken);

            if (subExpenseAccount == null)
            {
                subExpenseAccount = new GeneralLedgerAccount(tenantId, "5800", "Subscriptions Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(subExpenseAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.BillingDate,
                description: $"Weather Telemetry Service API Subscription"
            );

            // Debit Subscriptions Expense (5800)
            journalEntry.AddLine(
                accountId: subExpenseAccount.Id,
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
