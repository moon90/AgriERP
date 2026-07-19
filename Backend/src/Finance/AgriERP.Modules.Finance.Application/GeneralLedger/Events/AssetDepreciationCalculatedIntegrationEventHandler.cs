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
    public class AssetDepreciationCalculatedIntegrationEventHandler : INotificationHandler<AssetDepreciationCalculatedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public AssetDepreciationCalculatedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(AssetDepreciationCalculatedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Depreciation Expense Account (Expense - Code: 5500)
            var depExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5500" && a.TenantId == tenantId, cancellationToken);

            if (depExpenseAccount == null)
            {
                depExpenseAccount = new GeneralLedgerAccount(tenantId, "5500", "Depreciation Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(depExpenseAccount, cancellationToken);
            }

            // 2. Fetch or create Accumulated Depreciation Account (Asset - Code: 1250)
            var accumDepAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1250" && a.TenantId == tenantId, cancellationToken);

            if (accumDepAccount == null)
            {
                accumDepAccount = new GeneralLedgerAccount(tenantId, "1250", "Accumulated Depreciation", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(accumDepAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.ExecutionDate,
                description: $"Asset Depreciation Run - {notification.ExecutionDate:yyyy-MM-dd}"
            );

            // Line 1: Debit Depreciation Expense
            journalEntry.AddLine(
                accountId: depExpenseAccount.Id,
                debitAmount: notification.TotalDepreciationAmount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Accumulated Depreciation
            journalEntry.AddLine(
                accountId: accumDepAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalDepreciationAmount,
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
