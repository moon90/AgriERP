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
    public class SalesOrderShippedIntegrationEventHandler : INotificationHandler<SalesOrderShippedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public SalesOrderShippedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(SalesOrderShippedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Accounts Receivable Account (Asset - Code: 1100)
            var arAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1100" && a.TenantId == tenantId, cancellationToken);

            if (arAccount == null)
            {
                arAccount = new GeneralLedgerAccount(tenantId, "1100", "Accounts Receivable", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(arAccount, cancellationToken);
            }

            // 2. Fetch or create Sales Revenue Account (Revenue - Code: 4100)
            var revenueAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "4100" && a.TenantId == tenantId, cancellationToken);

            if (revenueAccount == null)
            {
                revenueAccount = new GeneralLedgerAccount(tenantId, "4100", "Sales Revenue", "Revenue");
                await _context.GeneralLedgerAccounts.AddAsync(revenueAccount, cancellationToken);
            }

            // 3. Fetch or create Cost of Goods Sold Account (Expense - Code: 5200)
            var cogsAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5200" && a.TenantId == tenantId, cancellationToken);

            if (cogsAccount == null)
            {
                cogsAccount = new GeneralLedgerAccount(tenantId, "5200", "Cost of Goods Sold", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(cogsAccount, cancellationToken);
            }

            // 4. Fetch or create Inventory Asset Account (Asset - Code: 1200)
            var inventoryAssetAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1200" && a.TenantId == tenantId, cancellationToken);

            if (inventoryAssetAccount == null)
            {
                inventoryAssetAccount = new GeneralLedgerAccount(tenantId, "1200", "Inventory Asset", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(inventoryAssetAccount, cancellationToken);
            }

            // Save accounts if they were created
            await _context.SaveChangesAsync(cancellationToken);

            // 5. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: DateTime.UtcNow,
                description: $"Sales Shipment - Order {notification.SalesOrderId}"
            );

            // Line 1: Debit Accounts Receivable (Increase Asset)
            journalEntry.AddLine(
                accountId: arAccount.Id,
                debitAmount: notification.TotalSalesRevenue,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Sales Revenue (Increase Revenue)
            journalEntry.AddLine(
                accountId: revenueAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalSalesRevenue,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 3: Debit Cost of Goods Sold (Increase Expense)
            journalEntry.AddLine(
                accountId: cogsAccount.Id,
                debitAmount: notification.TotalCOGS,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 4: Credit Inventory Asset (Decrease Asset)
            journalEntry.AddLine(
                accountId: inventoryAssetAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalCOGS,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Post and validate double-entry constraints
            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
