using AgriERP.Modules.Finance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.Budgets.Queries.GetBudgetStatus
{
    public record BudgetStatusDto(
        Guid BudgetId,
        string AccountCode,
        string AccountName,
        string AccountType,
        decimal AllocatedAmount,
        decimal SpentAmount,
        decimal RemainingAmount,
        bool IsOverBudget
    );

    public record GetBudgetStatusQuery(int FiscalYear) : IRequest<List<BudgetStatusDto>>;

    public class GetBudgetStatusQueryHandler : IRequestHandler<GetBudgetStatusQuery, List<BudgetStatusDto>>
    {
        private readonly IFinanceDbContext _context;

        public GetBudgetStatusQueryHandler(IFinanceDbContext context)
        {
            _context = context;
        }

        public async Task<List<BudgetStatusDto>> Handle(GetBudgetStatusQuery request, CancellationToken cancellationToken)
        {
            // 1. Get period bounds for the fiscal year
            var period = await _context.FiscalYearPeriods
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Year == request.FiscalYear, cancellationToken);

            var startDate = period?.StartDate ?? new DateTime(request.FiscalYear, 1, 1);
            var endDate = period?.EndDate ?? new DateTime(request.FiscalYear, 12, 31);

            // 2. Fetch all budgets
            var budgets = await _context.Budgets
                .AsNoTracking()
                .Where(b => b.FiscalYear == request.FiscalYear)
                .ToListAsync(cancellationToken);

            // 3. Fetch all General Ledger accounts in context to map names/types
            var accounts = await _context.GeneralLedgerAccounts
                .AsNoTracking()
                .ToListAsync(cancellationToken);

            // 4. Fetch all journal transaction lines within the date bounds
            var txLines = await _context.TransactionLines
                .AsNoTracking()
                .Join(
                    _context.JournalEntries.AsNoTracking().Where(je => je.IsPosted && je.PostDate.Date >= startDate && je.PostDate.Date <= endDate),
                    line => line.JournalEntryId,
                    entry => entry.Id,
                    (line, entry) => new { line.AccountId, line.DebitAmount, line.CreditAmount }
                )
                .ToListAsync(cancellationToken);

            var results = new List<BudgetStatusDto>();

            foreach (var budget in budgets)
            {
                var account = accounts.FirstOrDefault(a => a.AccountCode == budget.AccountCode);
                if (account == null) continue;

                // Sum up debits and credits for this account
                var accountTx = txLines.Where(tx => tx.AccountId == account.Id).ToList();
                var sumDebits = accountTx.Sum(tx => tx.DebitAmount);
                var sumCredits = accountTx.Sum(tx => tx.CreditAmount);

                decimal spent = 0;
                var typeLower = account.Type.ToLower();
                if (typeLower == "asset" || typeLower == "expense")
                {
                    spent = sumDebits - sumCredits;
                }
                else
                {
                    spent = sumCredits - sumDebits;
                }

                // If spent is negative, treat it as 0 or represent actual negative depletion
                var remaining = budget.AllocatedAmount - spent;
                var isOver = spent > budget.AllocatedAmount;

                results.Add(new BudgetStatusDto(
                    budget.Id,
                    budget.AccountCode,
                    account.AccountName,
                    account.Type,
                    budget.AllocatedAmount,
                    spent,
                    remaining,
                    isOver
                ));
            }

            return results;
        }
    }
}
