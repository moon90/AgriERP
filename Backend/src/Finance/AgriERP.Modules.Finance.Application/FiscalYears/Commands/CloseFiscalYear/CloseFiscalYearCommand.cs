using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.FiscalYears.Commands.CloseFiscalYear
{
    public record CloseFiscalYearCommand(int Year) : IRequest<Guid>;

    public class CloseFiscalYearCommandHandler : IRequestHandler<CloseFiscalYearCommand, Guid>
    {
        private readonly IFinanceDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly ICurrentUserProvider _currentUserProvider;

        public CloseFiscalYearCommandHandler(
            IFinanceDbContext context, 
            ITenantProvider tenantProvider,
            ICurrentUserProvider currentUserProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _currentUserProvider = currentUserProvider;
        }

        public async Task<Guid> Handle(CloseFiscalYearCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Get and validate fiscal year period
            var period = await _context.FiscalYearPeriods
                .FirstOrDefaultAsync(p => p.Year == request.Year, cancellationToken);
            if (period == null)
            {
                throw new InvalidOperationException($"Fiscal year period for {request.Year} does not exist.");
            }
            if (period.IsClosed)
            {
                throw new InvalidOperationException($"Fiscal year period for {request.Year} is already closed.");
            }

            // 2. Fetch Retained Earnings account (3900)
            var retainedEarningsAcc = await _context.GeneralLedgerAccounts
                .FirstOrDefaultAsync(a => a.AccountCode == "3900", cancellationToken);
            if (retainedEarningsAcc == null)
            {
                throw new InvalidOperationException("Retained Earnings Account (3900) must exist in General Ledger to close the fiscal year.");
            }

            // 3. Fetch all General Ledger accounts in context
            var accounts = await _context.GeneralLedgerAccounts
                .ToListAsync(cancellationToken);

            // 4. Fetch all journal transaction lines within the date bounds
            var txLines = await _context.TransactionLines
                .Join(
                    _context.JournalEntries.Where(je => je.IsPosted && je.PostDate.Date >= period.StartDate && je.PostDate.Date <= period.EndDate),
                    line => line.JournalEntryId,
                    entry => entry.Id,
                    (line, entry) => new { line.AccountId, line.DebitAmount, line.CreditAmount }
                )
                .ToListAsync(cancellationToken);

            // 5. Create closing Journal Entry
            var closingJournal = new JournalEntry(
                tenantId,
                period.EndDate, // Last day of the year
                $"Closing Entry for Fiscal Year {request.Year}"
            );

            decimal totalDebits = 0;
            decimal totalCredits = 0;

            foreach (var account in accounts)
            {
                // Only temporary accounts (Revenue, Expense) are closed out
                var typeLower = account.Type.ToLower();
                if (typeLower != "revenue" && typeLower != "expense")
                {
                    continue;
                }

                var accountTx = txLines.Where(tx => tx.AccountId == account.Id).ToList();
                var sumDebits = accountTx.Sum(tx => tx.DebitAmount);
                var sumCredits = accountTx.Sum(tx => tx.CreditAmount);

                if (typeLower == "revenue")
                {
                    var balance = sumCredits - sumDebits; // Revenue credit balance
                    if (balance > 0)
                    {
                        // Debit the revenue account to clear it to zero
                        closingJournal.AddLine(account.Id, balance, 0);
                        totalDebits += balance;
                    }
                    else if (balance < 0)
                    {
                        // Credit the revenue account to clear it to zero
                        closingJournal.AddLine(account.Id, 0, Math.Abs(balance));
                        totalCredits += Math.Abs(balance);
                    }
                }
                else if (typeLower == "expense")
                {
                    var balance = sumDebits - sumCredits; // Expense debit balance
                    if (balance > 0)
                    {
                        // Credit the expense account to clear it to zero
                        closingJournal.AddLine(account.Id, 0, balance);
                        totalCredits += balance;
                    }
                    else if (balance < 0)
                    {
                        // Debit the expense account to clear it to zero
                        closingJournal.AddLine(account.Id, Math.Abs(balance), 0);
                        totalDebits += Math.Abs(balance);
                    }
                }
            }

            // 6. Post balancing entry to Retained Earnings (3900)
            if (totalDebits > totalCredits)
            {
                var profit = totalDebits - totalCredits;
                closingJournal.AddLine(retainedEarningsAcc.Id, 0, profit); // Credit Retained Earnings
            }
            else if (totalCredits > totalDebits)
            {
                var loss = totalCredits - totalDebits;
                closingJournal.AddLine(retainedEarningsAcc.Id, loss, 0); // Debit Retained Earnings
            }
            else
            {
                // No revenues or expenses to close out, but we need at least one line to save
                // Let's check if there are no lines added
                if (!closingJournal.Lines.Any())
                {
                    // No activity recorded in the entire year, nothing to close out
                    period.Close(_currentUserProvider.UserId ?? "System");
                    await _context.SaveChangesAsync(cancellationToken);
                    return period.Id;
                }
            }

            // 7. Post closing journal and update fiscal year period status
            closingJournal.Post();
            await _context.JournalEntries.AddAsync(closingJournal, cancellationToken);
            
            period.Close(_currentUserProvider.UserId ?? "System");

            await _context.SaveChangesAsync(cancellationToken);
            return period.Id;
        }
    }
}
