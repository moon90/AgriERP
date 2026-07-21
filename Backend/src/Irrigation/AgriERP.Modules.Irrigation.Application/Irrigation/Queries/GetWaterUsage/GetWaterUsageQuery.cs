using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Irrigation.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Irrigation.Application.Irrigation.Queries.GetWaterUsage
{
    public record WaterSourceDto(
        Guid Id,
        string SourceName,
        string PermitNumber,
        decimal MaxAllocatedGallons,
        decimal UsedGallons,
        decimal CompliancePercentage,
        string Status
    );

    public record WaterUsageLogDto(
        Guid Id,
        Guid WaterSourceId,
        string SourceName,
        Guid FieldId,
        decimal GallonsPumped,
        decimal FlowRateGpm,
        DateTime IrrigationDate,
        string Notes
    );

    public record WaterBillingDto(
        Guid Id,
        Guid WaterSourceId,
        string SourceName,
        decimal GallonsUsed,
        decimal CostPerGallon,
        decimal Amount,
        DateTime BillingDate
    );

    public record WaterPortfolioDto(
        List<WaterSourceDto> Sources,
        List<WaterUsageLogDto> Logs,
        List<WaterBillingDto> Billings,
        decimal TotalUtilityExpenses
    );

    public record GetWaterUsageQuery : IRequest<WaterPortfolioDto>;

    public class GetWaterUsageQueryHandler : IRequestHandler<GetWaterUsageQuery, WaterPortfolioDto>
    {
        private readonly IIrrigationDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetWaterUsageQueryHandler(IIrrigationDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<WaterPortfolioDto> Handle(GetWaterUsageQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load sources
            var sources = await _context.WaterSources
                .AsNoTracking()
                .Where(s => s.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var sourceDtos = sources.Select(s => {
                decimal compliance = s.MaxAllocatedGallons > 0 
                    ? (s.UsedGallons / s.MaxAllocatedGallons) * 100 
                    : 0m;
                return new WaterSourceDto(
                    s.Id,
                    s.SourceName,
                    s.PermitNumber,
                    s.MaxAllocatedGallons,
                    s.UsedGallons,
                    compliance,
                    s.Status
                );
            }).ToList();

            // Load logs
            var logs = await _context.IrrigationLogs
                .AsNoTracking()
                .Where(l => l.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var logDtos = logs.Select(l => {
                var associatedSource = sources.FirstOrDefault(s => s.Id == l.WaterSourceId);
                return new WaterUsageLogDto(
                    l.Id,
                    l.WaterSourceId,
                    associatedSource?.SourceName ?? "Unknown Source",
                    l.FieldId,
                    l.GallonsPumped,
                    l.FlowRateGpm,
                    l.IrrigationDate,
                    l.Notes
                );
            }).ToList();

            // Load billings
            var billings = await _context.WaterUsageBillings
                .AsNoTracking()
                .Where(b => b.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var billingDtos = billings.Select(b => {
                var associatedSource = sources.FirstOrDefault(s => s.Id == b.WaterSourceId);
                return new WaterBillingDto(
                    b.Id,
                    b.WaterSourceId,
                    associatedSource?.SourceName ?? "Unknown Source",
                    b.GallonsUsed,
                    b.CostPerGallon,
                    b.Amount,
                    b.BillingDate
                );
            }).ToList();

            decimal totalExpenses = billingDtos.Sum(b => b.Amount);

            return new WaterPortfolioDto(
                sourceDtos,
                logDtos,
                billingDtos,
                totalExpenses
            );
        }
    }
}
