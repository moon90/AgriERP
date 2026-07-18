using AgriERP.BuildingBlocks.Application;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetIncomeStatement
{
    public record GetIncomeStatementQuery() : IRequest<IncomeStatementDto>;

    public record IncomeStatementDto(
        List<IncomeStatementLineDto> Revenues,
        decimal TotalRevenue,
        List<IncomeStatementLineDto> Expenses,
        decimal TotalExpenses,
        decimal NetIncome
    );

    public record IncomeStatementLineDto(string AccountCode, string AccountName, decimal Balance);

    public class GetIncomeStatementQueryHandler : IRequestHandler<GetIncomeStatementQuery, IncomeStatementDto>
    {
        private readonly ISender _sender;

        public GetIncomeStatementQueryHandler(ISender sender)
        {
            _sender = sender;
        }

        public async Task<IncomeStatementDto> Handle(GetIncomeStatementQuery request, CancellationToken cancellationToken)
        {
            // Reuse GetTrialBalanceQuery to get all net balances
            var trialBalanceQuery = new GetTrialBalance.GetTrialBalanceQuery();
            var trialBalances = await _sender.Send(trialBalanceQuery, cancellationToken);

            var revenues = trialBalances
                .Where(b => b.AccountType.Equals("Revenue", StringComparison.OrdinalIgnoreCase))
                .Select(b => new IncomeStatementLineDto(b.AccountCode, b.AccountName, b.NetBalance))
                .ToList();

            var expenses = trialBalances
                .Where(b => b.AccountType.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                .Select(b => new IncomeStatementLineDto(b.AccountCode, b.AccountName, b.NetBalance))
                .ToList();

            var totalRevenue = revenues.Sum(r => r.Balance);
            var totalExpenses = expenses.Sum(e => e.Balance);
            var netIncome = totalRevenue - totalExpenses;

            return new IncomeStatementDto(revenues, totalRevenue, expenses, totalExpenses, netIncome);
        }
    }
}
