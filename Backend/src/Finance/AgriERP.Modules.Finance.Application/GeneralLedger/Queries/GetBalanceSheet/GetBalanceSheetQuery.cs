using AgriERP.BuildingBlocks.Application;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetBalanceSheet
{
    public record GetBalanceSheetQuery() : IRequest<BalanceSheetDto>;

    public record BalanceSheetDto(
        List<BalanceSheetLineDto> Assets,
        decimal TotalAssets,
        List<BalanceSheetLineDto> Liabilities,
        decimal TotalLiabilities,
        List<BalanceSheetLineDto> Equity,
        decimal TotalEquity,
        decimal TotalLiabilitiesAndEquity
    );

    public record BalanceSheetLineDto(string AccountCode, string AccountName, decimal Balance);

    public class GetBalanceSheetQueryHandler : IRequestHandler<GetBalanceSheetQuery, BalanceSheetDto>
    {
        private readonly ISender _sender;

        public GetBalanceSheetQueryHandler(ISender sender)
        {
            _sender = sender;
        }

        public async Task<BalanceSheetDto> Handle(GetBalanceSheetQuery request, CancellationToken cancellationToken)
        {
            // 1. Get trial balance
            var trialBalanceQuery = new GetTrialBalance.GetTrialBalanceQuery();
            var trialBalances = await _sender.Send(trialBalanceQuery, cancellationToken);

            // 2. Get Income Statement for Net Income addition to Equity
            var incomeStatementQuery = new GetIncomeStatement.GetIncomeStatementQuery();
            var incomeStatement = await _sender.Send(incomeStatementQuery, cancellationToken);
            var netIncome = incomeStatement.NetIncome;

            var assets = trialBalances
                .Where(b => b.AccountType.Equals("Asset", StringComparison.OrdinalIgnoreCase))
                .Select(b => new BalanceSheetLineDto(b.AccountCode, b.AccountName, b.NetBalance))
                .ToList();

            var liabilities = trialBalances
                .Where(b => b.AccountType.Equals("Liability", StringComparison.OrdinalIgnoreCase))
                .Select(b => new BalanceSheetLineDto(b.AccountCode, b.AccountName, b.NetBalance))
                .ToList();

            var equity = trialBalances
                .Where(b => b.AccountType.Equals("Equity", StringComparison.OrdinalIgnoreCase))
                .Select(b => new BalanceSheetLineDto(b.AccountCode, b.AccountName, b.NetBalance))
                .ToList();

            // Inject Current Period Retained Earnings from Net Income into Equity list
            equity.Add(new BalanceSheetLineDto("3900", "Retained Earnings (Current Period)", netIncome));

            var totalAssets = assets.Sum(a => a.Balance);
            var totalLiabilities = liabilities.Sum(l => l.Balance);
            var totalEquity = equity.Sum(e => e.Balance);
            var totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

            return new BalanceSheetDto(
                assets, 
                totalAssets, 
                liabilities, 
                totalLiabilities, 
                equity, 
                totalEquity, 
                totalLiabilitiesAndEquity
            );
        }
    }
}
