using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Chemicals.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Chemicals.Application.Chemicals.Queries.GetChemicalAnalytics
{
    public record ChemicalProductDto(
        Guid Id,
        string ProductName,
        string RegistrationNumber,
        int SafetyIntervalHours,
        decimal StockQuantityLiters,
        decimal CostPerLiter,
        decimal TotalStockValue
    );

    public record ApplicationLogDto(
        Guid Id,
        Guid ChemicalProductId,
        string ProductName,
        string RegistrationNumber,
        Guid FieldId,
        decimal QuantityAppliedLiters,
        decimal AreaTreatedAcres,
        decimal DosagePerAcre,
        DateTime ApplicationDate,
        DateTime SafetyIntervalExpiry,
        bool IsCurrentlyRestricted,
        string Notes
    );

    public record ChemicalAnalyticsDto(
        List<ChemicalProductDto> Products,
        List<ApplicationLogDto> Logs,
        decimal TotalTreatmentExpenses,
        int ActiveRestrictedFieldsCount
    );

    public record GetChemicalAnalyticsQuery : IRequest<ChemicalAnalyticsDto>;

    public class GetChemicalAnalyticsQueryHandler : IRequestHandler<GetChemicalAnalyticsQuery, ChemicalAnalyticsDto>
    {
        private readonly IChemicalsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetChemicalAnalyticsQueryHandler(IChemicalsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<ChemicalAnalyticsDto> Handle(GetChemicalAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load products
            var products = await _context.ChemicalProducts
                .AsNoTracking()
                .Where(p => p.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var productDtos = products.Select(p => new ChemicalProductDto(
                p.Id,
                p.ProductName,
                p.RegistrationNumber,
                p.SafetyIntervalHours,
                p.StockQuantityLiters,
                p.CostPerLiter,
                p.StockQuantityLiters * p.CostPerLiter
            )).ToList();

            // Load application logs
            var logs = await _context.ApplicationLogs
                .AsNoTracking()
                .Where(l => l.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var currentTime = DateTime.UtcNow;

            var logDtos = logs.Select(l => {
                var associatedProduct = products.FirstOrDefault(p => p.Id == l.ChemicalProductId);
                bool isRestricted = l.SafetyIntervalExpiry > currentTime;
                return new ApplicationLogDto(
                    l.Id,
                    l.ChemicalProductId,
                    associatedProduct?.ProductName ?? "Unknown Product",
                    associatedProduct?.RegistrationNumber ?? "Unknown Registration",
                    l.FieldId,
                    l.QuantityAppliedLiters,
                    l.AreaTreatedAcres,
                    l.DosagePerAcre,
                    l.ApplicationDate,
                    l.SafetyIntervalExpiry,
                    isRestricted,
                    l.Notes
                );
            }).ToList();

            decimal totalExpenses = logDtos.Sum(l => l.QuantityAppliedLiters * (products.FirstOrDefault(p => p.Id == l.ChemicalProductId)?.CostPerLiter ?? 0m));
            int activeRestrictedCount = logDtos.Count(l => l.IsCurrentlyRestricted);

            return new ChemicalAnalyticsDto(
                productDtos,
                logDtos,
                totalExpenses,
                activeRestrictedCount
            );
        }
    }
}
