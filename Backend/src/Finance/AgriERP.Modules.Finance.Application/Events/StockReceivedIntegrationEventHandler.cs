using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Finance.Domain;
using AgriERP.Modules.Finance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.Events
{
    public class StockReceivedIntegrationEventHandler : INotificationHandler<StockReceivedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public StockReceivedIntegrationEventHandler(IFinanceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(StockReceivedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;
            var totalCost = notification.Quantity * notification.CostBasis;

            if (totalCost <= 0) return; // No financial impact if cost is zero

            // 1. Fetch or create Inventory Asset Account (Asset - Code: 1200)
            var inventoryAssetAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters() // Enforce lookup across filters safely
                .FirstOrDefaultAsync(a => a.AccountCode == "1200" && a.TenantId == tenantId, cancellationToken);

            if (inventoryAssetAccount == null)
            {
                inventoryAssetAccount = new GeneralLedgerAccount(tenantId, "1200", "Inventory Asset", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(inventoryAssetAccount, cancellationToken);
            }

            // 2. Fetch or create Accounts Payable Account (Liability - Code: 2100)
            var accountsPayableAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "2100" && a.TenantId == tenantId, cancellationToken);

            if (accountsPayableAccount == null)
            {
                accountsPayableAccount = new GeneralLedgerAccount(tenantId, "2100", "Accounts Payable", "Liability");
                await _context.GeneralLedgerAccounts.AddAsync(accountsPayableAccount, cancellationToken);
            }

            // Save accounts if they were created
            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: DateTime.UtcNow,
                description: $"Inventory Receipt - Batch {notification.BatchNumber} (Qty: {notification.Quantity:F2} @ Cost: {notification.CostBasis:F2})"
            );

            // Debit Asset (Increase inventory)
            journalEntry.AddLine(
                accountId: inventoryAssetAccount.Id,
                debitAmount: totalCost,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Liability (Increase accounts payable)
            journalEntry.AddLine(
                accountId: accountsPayableAccount.Id,
                debitAmount: 0.0m,
                creditAmount: totalCost,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Validate double-entry constraint inside domain model
            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);

            // Persist the journal entry and transaction lines
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
