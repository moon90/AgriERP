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
    public class CropActivityLoggedIntegrationEventHandler : INotificationHandler<CropActivityLoggedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public CropActivityLoggedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(CropActivityLoggedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Crop WIP Asset Account (Asset - Code: 1410)
            var wipAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1410" && a.TenantId == tenantId, cancellationToken);

            if (wipAccount == null)
            {
                wipAccount = new GeneralLedgerAccount(tenantId, "1410", "Crop WIP Asset", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(wipAccount, cancellationToken);
            }

            // 2. Fetch credit account (Inventory Asset 1200 or Cash & Bank 1010)
            string creditAccountCode = notification.IsMaterialConsumption ? "1200" : "1010";
            string creditAccountName = notification.IsMaterialConsumption ? "Inventory Asset" : "Cash & Bank";

            var creditAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == creditAccountCode && a.TenantId == tenantId, cancellationToken);

            if (creditAccount == null)
            {
                creditAccount = new GeneralLedgerAccount(tenantId, creditAccountCode, creditAccountName, "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(creditAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.ActivityDate,
                description: $"Crop WIP Capitalization - {notification.CropType} {notification.ActivityType}"
            );

            // Line 1: Debit Crop WIP Asset
            journalEntry.AddLine(
                accountId: wipAccount.Id,
                debitAmount: notification.Cost,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Cash or Inventory Asset
            journalEntry.AddLine(
                accountId: creditAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.Cost,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
