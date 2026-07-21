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
    public class HedgeClosedIntegrationEventHandler : INotificationHandler<HedgeClosedIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public HedgeClosedIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(HedgeClosedIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;
            decimal absAmount = Math.Abs(notification.RealizedPnl);
            if (absAmount == 0) return;

            // 1. Fetch or create Cash & Broker Account (Asset - Code: 1010)
            var cashAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1010" && a.TenantId == tenantId, cancellationToken);

            if (cashAccount == null)
            {
                cashAccount = new GeneralLedgerAccount(tenantId, "1010", "Cash & Broker Margin", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(cashAccount, cancellationToken);
            }

            // 2. Fetch or create account based on Profit / Loss
            GeneralLedgerAccount targetAccount;
            if (notification.RealizedPnl > 0) // Profit
            {
                // Create/Fetch Hedging Gains (Revenue - Code: 4300)
                var gainAcc = await _context.GeneralLedgerAccounts
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(a => a.AccountCode == "4300" && a.TenantId == tenantId, cancellationToken);

                if (gainAcc == null)
                {
                    gainAcc = new GeneralLedgerAccount(tenantId, "4300", "Realized Hedging Gains", "Revenue");
                    await _context.GeneralLedgerAccounts.AddAsync(gainAcc, cancellationToken);
                }
                targetAccount = gainAcc;
            }
            else // Loss
            {
                // Create/Fetch Hedging Losses (Expense - Code: 5300)
                var lossAcc = await _context.GeneralLedgerAccounts
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(a => a.AccountCode == "5300" && a.TenantId == tenantId, cancellationToken);

                if (lossAcc == null)
                {
                    lossAcc = new GeneralLedgerAccount(tenantId, "5300", "Realized Hedging Losses", "Expense");
                    await _context.GeneralLedgerAccounts.AddAsync(lossAcc, cancellationToken);
                }
                targetAccount = lossAcc;
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Create balanced double-entry journal entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.CloseDate,
                description: $"Hedge Closed Out realized P&L - Symbol {notification.Symbol}"
            );

            if (notification.RealizedPnl > 0) // Profit: Debit Cash (1010) / Credit Gains (4300)
            {
                journalEntry.AddLine(
                    accountId: cashAccount.Id,
                    debitAmount: absAmount,
                    creditAmount: 0.0m,
                    currency: "USD",
                    exchangeRate: 1.0m
                );

                journalEntry.AddLine(
                    accountId: targetAccount.Id,
                    debitAmount: 0.0m,
                    creditAmount: absAmount,
                    currency: "USD",
                    exchangeRate: 1.0m
                );
            }
            else // Loss: Debit Losses (5300) / Credit Cash (1010)
            {
                journalEntry.AddLine(
                    accountId: targetAccount.Id,
                    debitAmount: absAmount,
                    creditAmount: 0.0m,
                    currency: "USD",
                    exchangeRate: 1.0m
                );

                journalEntry.AddLine(
                    accountId: cashAccount.Id,
                    debitAmount: 0.0m,
                    creditAmount: absAmount,
                    currency: "USD",
                    exchangeRate: 1.0m
                );
            }

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
