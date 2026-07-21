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
    public class CropCycleHarvestedIntegrationEventHandler : INotificationHandler<CropCycleHarvestedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public CropCycleHarvestedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(CropCycleHarvestedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Finished Crop Stock Account (Asset - Code: 1210)
            var stockAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1210" && a.TenantId == tenantId, cancellationToken);

            if (stockAccount == null)
            {
                stockAccount = new GeneralLedgerAccount(tenantId, "1210", "Finished Crop Stock", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(stockAccount, cancellationToken);
            }

            // 2. Fetch or create Crop WIP Asset Account (Asset - Code: 1410)
            var wipAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1410" && a.TenantId == tenantId, cancellationToken);

            if (wipAccount == null)
            {
                wipAccount = new GeneralLedgerAccount(tenantId, "1410", "Crop WIP Asset", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(wipAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.HarvestDate,
                description: $"Crop Harvest WIP Transfer - {notification.CropType}"
            );

            // Line 1: Debit Finished Goods Inventory
            journalEntry.AddLine(
                accountId: stockAccount.Id,
                debitAmount: notification.TotalWipCost,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Crop WIP Asset
            journalEntry.AddLine(
                accountId: wipAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.TotalWipCost,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
