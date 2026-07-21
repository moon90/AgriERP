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
    public class LeasePaymentCalculatedIntegrationEventHandler : INotificationHandler<LeasePaymentCalculatedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public LeasePaymentCalculatedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(LeasePaymentCalculatedIntegrationEvent notification, CancellationToken cancellationToken)
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

            // 2. Fetch or create specific Expense Account
            string expenseCode = notification.PaymentType == "Rent" ? "5400" : "5410";
            string expenseName = notification.PaymentType == "Rent" ? "Land Lease Rent Expense" : "Sharecrop Rent Expense";

            var expenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == expenseCode && a.TenantId == tenantId, cancellationToken);

            if (expenseAccount == null)
            {
                expenseAccount = new GeneralLedgerAccount(tenantId, expenseCode, expenseName, "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(expenseAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.PaymentDate,
                description: $"Lease Payout Allocation - Lease {notification.LeaseNumber} ({notification.PaymentType})"
            );

            // Debit Expense Account
            journalEntry.AddLine(
                accountId: expenseAccount.Id,
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
