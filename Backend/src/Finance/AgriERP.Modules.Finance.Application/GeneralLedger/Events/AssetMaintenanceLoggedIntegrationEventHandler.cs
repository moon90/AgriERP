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
    public class AssetMaintenanceLoggedIntegrationEventHandler : INotificationHandler<AssetMaintenanceLoggedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public AssetMaintenanceLoggedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(AssetMaintenanceLoggedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Equipment Maintenance Expense Account (Expense - Code: 5600)
            var maintExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5600" && a.TenantId == tenantId, cancellationToken);

            if (maintExpenseAccount == null)
            {
                maintExpenseAccount = new GeneralLedgerAccount(tenantId, "5600", "Equipment Maintenance Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(maintExpenseAccount, cancellationToken);
            }

            // 2. Fetch or create Cash & Bank Account (Asset - Code: 1010)
            var cashAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1010" && a.TenantId == tenantId, cancellationToken);

            if (cashAccount == null)
            {
                cashAccount = new GeneralLedgerAccount(tenantId, "1010", "Cash & Bank", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(cashAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.ServiceDate,
                description: $"Asset Maintenance expenditure - {notification.AssetName}"
            );

            // Line 1: Debit Maintenance Expense
            journalEntry.AddLine(
                accountId: maintExpenseAccount.Id,
                debitAmount: notification.Cost,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Cash & Bank
            journalEntry.AddLine(
                accountId: cashAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.Cost,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Post and validate
            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
