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
    public class InsurancePremiumBilledIntegrationEventHandler : INotificationHandler<InsurancePremiumBilledIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public InsurancePremiumBilledIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(InsurancePremiumBilledIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Accounts Payable (Liability - Code: 2100)
            var apAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "2100" && a.TenantId == tenantId, cancellationToken);

            if (apAccount == null)
            {
                apAccount = new GeneralLedgerAccount(tenantId, "2100", "Accounts Payable", "Liability");
                await _context.GeneralLedgerAccounts.AddAsync(apAccount, cancellationToken);
            }

            // 2. Fetch or create Insurance Expense (Expense - Code: 5900)
            var insuranceExpenseAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "5900" && a.TenantId == tenantId, cancellationToken);

            if (insuranceExpenseAccount == null)
            {
                insuranceExpenseAccount = new GeneralLedgerAccount(tenantId, "5900", "Insurance Expense", "Expense");
                await _context.GeneralLedgerAccounts.AddAsync(insuranceExpenseAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.BillingDate,
                description: $"Crop Insurance Premium - Policy {notification.PolicyNumber} ({notification.ProviderName})"
            );

            // Debit Insurance Expense (5900)
            journalEntry.AddLine(
                accountId: insuranceExpenseAccount.Id,
                debitAmount: notification.PremiumAmount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Accounts Payable (2100)
            journalEntry.AddLine(
                accountId: apAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.PremiumAmount,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public class InsuranceClaimSettledIntegrationEventHandler : INotificationHandler<InsuranceClaimSettledIntegrationEvent>
    {
        private readonly IFinanceDbContext _context;

        public InsuranceClaimSettledIntegrationEventHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task Handle(InsuranceClaimSettledIntegrationEvent notification, CancellationToken cancellationToken)
        {
            var tenantId = notification.TenantId;

            // 1. Fetch or create Cash & Bank (Asset - Code: 1010)
            var cashAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "1010" && a.TenantId == tenantId, cancellationToken);

            if (cashAccount == null)
            {
                cashAccount = new GeneralLedgerAccount(tenantId, "1010", "Cash & Bank", "Asset");
                await _context.GeneralLedgerAccounts.AddAsync(cashAccount, cancellationToken);
            }

            // 2. Fetch or create Claims Indemnity Income (Revenue - Code: 4900)
            var indemnityIncomeAccount = await _context.GeneralLedgerAccounts
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(a => a.AccountCode == "4900" && a.TenantId == tenantId, cancellationToken);

            if (indemnityIncomeAccount == null)
            {
                indemnityIncomeAccount = new GeneralLedgerAccount(tenantId, "4900", "Claims Indemnity Income", "Revenue");
                await _context.GeneralLedgerAccounts.AddAsync(indemnityIncomeAccount, cancellationToken);
            }

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post Balanced Journal Entry
            var journalEntry = new JournalEntry(
                tenantId: tenantId,
                postDate: notification.SettlementDate,
                description: $"Crop Insurance Indemnity Settlement - Claim {notification.ClaimNumber} (Policy {notification.PolicyNumber})"
            );

            // Debit Cash & Bank (1010)
            journalEntry.AddLine(
                accountId: cashAccount.Id,
                debitAmount: notification.PayoutAmount,
                creditAmount: 0.0m,
                currency: "USD",
                exchangeRate: 1.0m
            );

            // Credit Claims Indemnity Income (4900)
            journalEntry.AddLine(
                accountId: indemnityIncomeAccount.Id,
                debitAmount: 0.0m,
                creditAmount: notification.PayoutAmount,
                currency: "USD",
                exchangeRate: 1.0m
            );

            journalEntry.Post();

            await _context.JournalEntries.AddAsync(journalEntry, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
