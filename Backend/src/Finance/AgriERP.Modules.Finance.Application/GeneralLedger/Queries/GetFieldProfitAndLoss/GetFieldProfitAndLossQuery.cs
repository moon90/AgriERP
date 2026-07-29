using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Finance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.GeneralLedger.Queries.GetFieldProfitAndLoss
{
    public record GetFieldProfitAndLossQuery(
        Guid? FieldId = null,
        DateTime? StartDate = null,
        DateTime? EndDate = null
    ) : IRequest<FieldProfitAndLossReportDto>;

    public record FieldProfitAndLossReportDto(
        List<FieldPnLItemDto> Fields,
        decimal TotalEnterpriseRevenue,
        decimal TotalEnterpriseExpense,
        decimal TotalEnterpriseNetProfit,
        decimal AverageMarginPerAcre,
        decimal OverallRoiPercentage
    );

    public record FieldPnLItemDto(
        Guid FieldId,
        string FieldName,
        decimal AreaAcres,
        decimal CropSalesRevenue,
        decimal DirectLaborExpense,
        decimal ChemicalExpense,
        decimal IrrigationExpense,
        decimal LandLeaseExpense,
        decimal OtherExpense,
        decimal TotalRevenue,
        decimal TotalExpense,
        decimal NetProfit,
        decimal MarginPerAcre,
        decimal RoiPercentage
    );

    public class GetFieldProfitAndLossQueryHandler : IRequestHandler<GetFieldProfitAndLossQuery, FieldProfitAndLossReportDto>
    {
        private readonly IFinanceDbContext _financeDb;
        private readonly ICropFieldLookupService _fieldLookup;
        private readonly ITenantProvider _tenantProvider;

        public GetFieldProfitAndLossQueryHandler(
            IFinanceDbContext financeDb,
            ICropFieldLookupService fieldLookup,
            ITenantProvider tenantProvider)
        {
            _financeDb = financeDb;
            _fieldLookup = fieldLookup;
            _tenantProvider = tenantProvider;
        }

        public async Task<FieldProfitAndLossReportDto> Handle(GetFieldProfitAndLossQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Fetch Crop Fields via Lookup Service
            var fields = await _fieldLookup.GetFieldsForTenantAsync(tenantId, cancellationToken);
            if (request.FieldId.HasValue && request.FieldId.Value != Guid.Empty)
            {
                fields = fields.Where(f => f.Id == request.FieldId.Value).ToList();
            }

            // 2. Fetch Journal Entries & Transaction Lines for tenant
            var entriesQuery = _financeDb.JournalEntries.AsNoTracking().Where(j => j.TenantId == tenantId && j.IsPosted);
            if (request.StartDate.HasValue)
            {
                entriesQuery = entriesQuery.Where(j => j.PostDate >= request.StartDate.Value);
            }
            if (request.EndDate.HasValue)
            {
                entriesQuery = entriesQuery.Where(j => j.PostDate <= request.EndDate.Value);
            }

            var entries = await entriesQuery.ToListAsync(cancellationToken);
            var entryIds = entries.Select(e => e.Id).ToList();

            var txLines = await _financeDb.TransactionLines
                .AsNoTracking()
                .Where(t => entryIds.Contains(t.JournalEntryId))
                .ToListAsync(cancellationToken);

            var accounts = await _financeDb.GeneralLedgerAccounts
                .AsNoTracking()
                .Where(a => a.TenantId == tenantId)
                .ToDictionaryAsync(a => a.Id, cancellationToken);

            // Calculate overall account balances
            decimal totalRev = 0.0m;
            decimal totalLabor = 0.0m;
            decimal totalChem = 0.0m;
            decimal totalIrr = 0.0m;
            decimal totalLease = 0.0m;
            decimal totalOther = 0.0m;

            foreach (var line in txLines)
            {
                if (!accounts.TryGetValue(line.AccountId, out var acc)) continue;

                if (acc.Type.Equals("Revenue", StringComparison.OrdinalIgnoreCase))
                {
                    totalRev += (line.CreditAmount - line.DebitAmount);
                }
                else if (acc.Type.Equals("Expense", StringComparison.OrdinalIgnoreCase))
                {
                    var expVal = (line.DebitAmount - line.CreditAmount);
                    switch (acc.AccountCode)
                    {
                        case "5110": totalLabor += expVal; break;
                        case "5300": totalChem += expVal; break;
                        case "5500": totalIrr += expVal; break;
                        case "5400": totalLease += expVal; break;
                        default: totalOther += expVal; break;
                    }
                }
            }

            var pnlItems = new List<FieldPnLItemDto>();
            var totalFieldCount = fields.Count > 0 ? fields.Count : 1;

            foreach (var f in fields)
            {
                // Attribute proportionate operational metrics per field plot
                var fieldShare = 1.0m / totalFieldCount;
                var rev = Math.Round(totalRev * fieldShare, 2);
                var labor = Math.Round(totalLabor * fieldShare, 2);
                var chem = Math.Round(totalChem * fieldShare, 2);
                var irr = Math.Round(totalIrr * fieldShare, 2);
                var lease = Math.Round(totalLease * fieldShare, 2);
                var other = Math.Round(totalOther * fieldShare, 2);

                var totalFieldExp = labor + chem + irr + lease + other;
                var netProfit = rev - totalFieldExp;
                var marginPerAcre = f.AreaAcres > 0 ? Math.Round(netProfit / f.AreaAcres, 2) : 0.0m;
                var roi = totalFieldExp > 0 ? Math.Round((netProfit / totalFieldExp) * 100.0m, 2) : 0.0m;

                pnlItems.Add(new FieldPnLItemDto(
                    FieldId: f.Id,
                    FieldName: f.Name,
                    AreaAcres: f.AreaAcres,
                    CropSalesRevenue: rev,
                    DirectLaborExpense: labor,
                    ChemicalExpense: chem,
                    IrrigationExpense: irr,
                    LandLeaseExpense: lease,
                    OtherExpense: other,
                    TotalRevenue: rev,
                    TotalExpense: totalFieldExp,
                    NetProfit: netProfit,
                    MarginPerAcre: marginPerAcre,
                    RoiPercentage: roi
                ));
            }

            // Fallback if no crop fields exist yet
            if (pnlItems.Count == 0)
            {
                var totalExp = totalLabor + totalChem + totalIrr + totalLease + totalOther;
                var netProfit = totalRev - totalExp;
                var roi = totalExp > 0 ? Math.Round((netProfit / totalExp) * 100.0m, 2) : 0.0m;

                pnlItems.Add(new FieldPnLItemDto(
                    FieldId: Guid.Empty,
                    FieldName: "General Enterprise Plot",
                    AreaAcres: 100.0m,
                    CropSalesRevenue: totalRev,
                    DirectLaborExpense: totalLabor,
                    ChemicalExpense: totalChem,
                    IrrigationExpense: totalIrr,
                    LandLeaseExpense: totalLease,
                    OtherExpense: totalOther,
                    TotalRevenue: totalRev,
                    TotalExpense: totalExp,
                    NetProfit: netProfit,
                    MarginPerAcre: Math.Round(netProfit / 100.0m, 2),
                    RoiPercentage: roi
                ));
            }

            var grandTotalRev = pnlItems.Sum(p => p.TotalRevenue);
            var grandTotalExp = pnlItems.Sum(p => p.TotalExpense);
            var grandNetProfit = grandTotalRev - grandTotalExp;
            var totalAcres = pnlItems.Sum(p => p.AreaAcres);
            var avgMarginPerAcre = totalAcres > 0 ? Math.Round(grandNetProfit / totalAcres, 2) : 0.0m;
            var overallRoi = grandTotalExp > 0 ? Math.Round((grandNetProfit / grandTotalExp) * 100.0m, 2) : 0.0m;

            return new FieldProfitAndLossReportDto(
                Fields: pnlItems,
                TotalEnterpriseRevenue: grandTotalRev,
                TotalEnterpriseExpense: grandTotalExp,
                TotalEnterpriseNetProfit: grandNetProfit,
                AverageMarginPerAcre: avgMarginPerAcre,
                OverallRoiPercentage: overallRoi
            );
        }
    }
}
