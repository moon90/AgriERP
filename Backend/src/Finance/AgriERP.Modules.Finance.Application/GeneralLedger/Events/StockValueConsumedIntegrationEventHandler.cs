using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Events
{
    public class StockValueConsumedIntegrationEventHandler : INotificationHandler<StockValueConsumedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public StockValueConsumedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(StockValueConsumedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;
            var totalCost = notification.TotalCost;

            // If the consumption has zero cost, no ledger entry is needed
            if (totalCost <= 0) return;

            // 1. Get or create the default Asset Account (code "1200")
            var assetAccount = await _context.GeneralLedgerAccounts
                .FirstOrDefaultAsync(a => a.TenantId == tenantId && a.AccountCode == "1200", cancellationToken);

            if (assetAccount == null)
            {
                assetAccount = new GeneralLedgerAccount(tenantId, "1200", "Inventory Asset", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(assetAccount, cancellationToken);
            }

            // 2. Get or create the default Expense Account (code "5100")
            var expenseAccount = await _context.GeneralLedgerAccounts
                .FirstOrDefaultAsync(a => a.TenantId == tenantId && a.AccountCode == "5100", cancellationToken);

            if (expenseAccount == null)
            {
                expenseAccount = new GeneralLedgerAccount(tenantId, "5100", "Feed & Operations Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(expenseAccount, cancellationToken);
            }

            // Persist the seeded accounts so they get IDs assigned
            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create a balanced JournalEntry to record the consumption
            var journalEntry = new JournalEntry(
                tenantId, 
                DateTime.UtcNow, 
                $"FIFO Stock Consumption - Item ID: {notification.StockItemId} (Ref: {notification.ReferenceId})"
            );

            // Debit the Expense account (value outflow/expensed)
            journalEntry.AddLine(expenseAccount.Id, debitAmount: totalCost, creditAmount: 0m);

            // Credit the Asset account (inventory depletion)
            journalEntry.AddLine(assetAccount.Id, debitAmount: 0m, creditAmount: totalCost);

            // Post and validate double-entry balance
            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
