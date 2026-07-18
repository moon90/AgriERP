using AgriERP.BuildingBlocks.Application;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetTrialBalance
{
    public record GetTrialBalanceQuery() : IRequest<List<TrialBalanceDto>>;

    public record TrialBalanceDto(
        Guid AccountId, 
        string AccountCode, 
        string AccountName, 
        string AccountType,
        decimal TotalDebits, 
        decimal TotalCredits, 
        decimal NetBalance
    );

    public class GetTrialBalanceQueryHandler : IRequestHandler<GetTrialBalanceQuery, List<TrialBalanceDto>>
    {
        private readonly Common.IFinanceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetTrialBalanceQueryHandler(Common.IFinanceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<List<TrialBalanceDto>> Handle(GetTrialBalanceQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // Get all general ledger accounts for the active tenant
            var accounts = await _context.GeneralLedgerAccounts
                .Where(a => a.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            // Get posted transaction line items
            var transactionLines = await (from tl in _context.TransactionLines
                                           join je in _context.JournalEntries on tl.JournalEntryId equals je.Id
                                           where je.TenantId == tenantId && je.IsPosted
                                           select tl)
                                           .ToListAsync(cancellationToken);

            var lineMap = transactionLines.GroupBy(l => l.AccountId)
                .ToDictionary(g => g.Key, g => new
                {
                    Debits = g.Sum(x => x.DebitAmount * x.ExchangeRate),
                    Credits = g.Sum(x => x.CreditAmount * x.ExchangeRate)
                });

            var trialBalance = accounts.Select(acc =>
            {
                var hasLines = lineMap.TryGetValue(acc.Id, out var totals);
                var debits = hasLines ? totals!.Debits : 0m;
                var credits = hasLines ? totals!.Credits : 0m;

                // Calculate Net Balance:
                // Assets & Expenses increase with Debits: Balance = Debits - Credits
                // Liabilities, Equity & Revenue increase with Credits: Balance = Credits - Debits
                decimal netBalance = 0m;
                if (acc.Type.Equals("Asset", StringComparison.OrdinalIgnoreCase) || 
                    acc.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                {
                    netBalance = debits - credits;
                }
                else
                {
                    netBalance = credits - debits;
                }

                return new TrialBalanceDto(acc.Id, acc.AccountCode, acc.AccountName, acc.Type, debits, credits, netBalance);
            })
            .ToList();

            return trialBalance;
        }
    }
}
