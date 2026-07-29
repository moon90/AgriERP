using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Finance.Application.Common;
using AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetFieldProfitAndLoss;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetExecutiveBIConsolidation
{
    public record GetExecutiveBIConsolidationQuery() : IRequest<ExecutiveBIConsolidationDto>;

    public record ExecutiveBIConsolidationDto(
        decimal EnterpriseNetRevenue,
        decimal EnterpriseTotalExpense,
        decimal EnterpriseNetIncome,
        decimal OperatingMarginRatioPercent,
        int TotalActiveFields,
        decimal TotalCultivatedAcreage,
        decimal CashAndBankBalance,
        decimal AccountsPayableBalance,
        decimal AccruedLiabilitiesBalance,
        List<ExpenseCategoryDistributionDto> ExpenseCategories,
        List<FieldPnLItemDto> TopPerformingFields
    );

    public record ExpenseCategoryDistributionDto(
        string CategoryName,
        decimal Amount,
        decimal PercentageOfTotal
    );

    public class GetExecutiveBIConsolidationQueryHandler : IRequestHandler<GetExecutiveBIConsolidationQuery, ExecutiveBIConsolidationDto>
    {
        private readonly IFinanceDbContext _financeDb;
        private readonly ICropFieldLookupService _fieldLookup;
        private readonly ISender _sender;
        private readonly ITenantProvider _tenantProvider;

        public GetExecutiveBIConsolidationQueryHandler(
            IFinanceDbContext financeDb,
            ICropFieldLookupService fieldLookup,
            ISender sender,
            ITenantProvider tenantProvider)
        {
            _financeDb = financeDb;
            _fieldLookup = fieldLookup;
            _sender = sender;
            _tenantProvider = tenantProvider;
        }

        public async Task<ExecutiveBIConsolidationDto> Handle(GetExecutiveBIConsolidationQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Fetch Field P&L Report
            var pnlReport = await _sender.Send(new GetFieldProfitAndLossQuery(), cancellationToken);

            // 2. Fetch Cultivated Acreage & Field count via Lookup Service
            var fields = await _fieldLookup.GetFieldsForTenantAsync(tenantId, cancellationToken);
            var activeFieldCount = fields.Count;
            var totalAcreage = fields.Sum(f => f.AreaAcres);

            // 3. Liquidity Balances from General Ledger
            var trialBalance = await _sender.Send(new GetTrialBalance.GetTrialBalanceQuery(), cancellationToken);

            var cashBalance = trialBalance.FirstOrDefault(b => b.AccountCode == "1010")?.NetBalance ?? 0.0m;
            var apBalance = trialBalance.FirstOrDefault(b => b.AccountCode == "2100")?.NetBalance ?? 0.0m;
            var accruedBalance = trialBalance.FirstOrDefault(b => b.AccountCode == "2210")?.NetBalance ?? 0.0m;

            // 4. Calculate Category Distributions
            var totalLabor = pnlReport.Fields.Sum(f => f.DirectLaborExpense);
            var totalChem = pnlReport.Fields.Sum(f => f.ChemicalExpense);
            var totalIrr = pnlReport.Fields.Sum(f => f.IrrigationExpense);
            var totalLease = pnlReport.Fields.Sum(f => f.LandLeaseExpense);
            var totalOther = pnlReport.Fields.Sum(f => f.OtherExpense);
            var grandExp = pnlReport.TotalEnterpriseExpense > 0 ? pnlReport.TotalEnterpriseExpense : 1.0m;

            var categories = new List<ExpenseCategoryDistributionDto>
            {
                new ExpenseCategoryDistributionDto("Direct Field Labor", totalLabor, Math.Round((totalLabor / grandExp) * 100.0m, 2)),
                new ExpenseCategoryDistributionDto("Chemicals & Fertilizers", totalChem, Math.Round((totalChem / grandExp) * 100.0m, 2)),
                new ExpenseCategoryDistributionDto("Irrigation & Water Rights", totalIrr, Math.Round((totalIrr / grandExp) * 100.0m, 2)),
                new ExpenseCategoryDistributionDto("Land Lease & Cash Rent", totalLease, Math.Round((totalLease / grandExp) * 100.0m, 2)),
                new ExpenseCategoryDistributionDto("Other Operating Expenses", totalOther, Math.Round((totalOther / grandExp) * 100.0m, 2))
            };

            var marginRatio = pnlReport.TotalEnterpriseRevenue > 0
                ? Math.Round((pnlReport.TotalEnterpriseNetProfit / pnlReport.TotalEnterpriseRevenue) * 100.0m, 2)
                : 0.0m;

            var topFields = pnlReport.Fields
                .OrderByDescending(f => f.MarginPerAcre)
                .Take(5)
                .ToList();

            return new ExecutiveBIConsolidationDto(
                EnterpriseNetRevenue: pnlReport.TotalEnterpriseRevenue,
                EnterpriseTotalExpense: pnlReport.TotalEnterpriseExpense,
                EnterpriseNetIncome: pnlReport.TotalEnterpriseNetProfit,
                OperatingMarginRatioPercent: marginRatio,
                TotalActiveFields: activeFieldCount,
                TotalCultivatedAcreage: totalAcreage,
                CashAndBankBalance: cashBalance,
                AccountsPayableBalance: apBalance,
                AccruedLiabilitiesBalance: accruedBalance,
                ExpenseCategories: categories,
                TopPerformingFields: topFields
            );
        }
    }
}
