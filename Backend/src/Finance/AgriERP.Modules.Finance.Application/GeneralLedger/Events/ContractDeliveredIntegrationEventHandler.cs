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
    public class ContractDeliveredIntegrationEventHandler : INotificationHandler<ContractDeliveredIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public ContractDeliveredIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(ContractDeliveredIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Accounts Receivable (Asset - Code: 1100)
            var arAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1100" && a.TenantId == tenantId, cancellationToken);

            if (arAccount == null)
            {
                arAccount = new GeneralLedgerAccount(tenantId, "1100", "Accounts Receivable", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(arAccount, cancellationToken);
            }

            // 2. Fetch or create Sales Revenue (Revenue - Code: 4100)
            var salesAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "4100" && a.TenantId == tenantId, cancellationToken);

            if (salesAccount == null)
            {
                salesAccount = new GeneralLedgerAccount(tenantId, "4100", "Crop Sales Revenue", "Revenue");
                await _context.GeneralLedgerAccounts.AddAsync(salesAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post balanced double-entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.DeliveryDate,
                description: $"Contract Sales Physical Delivery - Contract {notification.ContractNumber}"
            );

            // Debit Accounts Receivable (1100)
            journalEntry.AddLine(
                accountId: arAccount.Id,
                debitAmount: notification.BillingAmount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Sales Revenue (4100)
            journalEntry.AddLine(
                accountId: salesAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.BillingAmount,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
