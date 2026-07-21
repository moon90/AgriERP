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
    public class ChemicalAppliedIntegrationEventHandler : INotificationHandler<ChemicalAppliedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public ChemicalAppliedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ChemicalAppliedIntegrationEvent notification, CancellationToken cancellationToken)
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

            // 2. Fetch or create Chemicals & Fertilizer Expense (Expense - Code: 5600)
            var chemicalExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5600" && a.TenantId == tenantId, cancellationToken);

            if (chemicalExpenseAccount == null)
            {
                chemicalExpenseAccount = new GeneralLedgerAccount(tenantId, "5600", "Chemicals & Fertilizer Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(chemicalExpenseAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.ApplicationDate,
                description: $"Chemical Treatment - Product {notification.ProductName} (EPA {notification.RegistrationNumber})"
            );

            // Debit Chemicals & Fertilizer Expense (5600)
            journalEntry.AddLine(
                accountId: chemicalExpenseAccount.Id,
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
