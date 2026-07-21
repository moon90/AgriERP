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
    public class StorageChargeBilledIntegrationEventHandler : INotificationHandler<StorageChargeBilledIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public StorageChargeBilledIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(StorageChargeBilledIntegrationEvent notification, CancellationToken cancellationToken)
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

            // 2. Fetch or create Storage Services Revenue Account (Revenue - Code: 4200)
            var revAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "4200" && a.TenantId == tenantId, cancellationToken);

            if (revAccount == null)
            {
                revAccount = new GeneralLedgerAccount(tenantId, "4200", "Storage Rental Revenue", "Revenue");
                await _context.GeneralLedgerAccounts.AddAsync(revAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create Balanced Double-Entry Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.ChargeDate,
                description: $"Storage Charge Billed - Ticket {notification.TicketNumber}"
            );

            // Line 1: Debit Accounts Receivable
            journalEntry.AddLine(
                accountId: arAccount.Id,
                debitAmount: notification.Amount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Line 2: Credit Storage Rental Revenue
            journalEntry.AddLine(
                accountId: revAccount.Id,
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
