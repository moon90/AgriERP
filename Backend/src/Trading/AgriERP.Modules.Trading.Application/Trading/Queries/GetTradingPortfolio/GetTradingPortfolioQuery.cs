using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Trading.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Trading.Queries.GetTradingPortfolio
{
    public record SalesContractDto(
        Guid Id,
        string ContractNumber,
        string CustomerClientId,
        string CropType,
        decimal ContractPricePerTon,
        decimal QuantityTons,
        decimal DeliveredQuantityTons,
        decimal CompliancePercentage,
        string Status
    );

    public record HedgePositionDto(
        Guid Id,
        string Symbol,
        string Type,
        int QuantityContracts,
        decimal EntryPricePerTon,
        decimal? ExitPricePerTon,
        decimal CurrentMarketPricePerTon,
        decimal Pnl,
        string Status
    );

    public record TradingPortfolioDto(
        List<SalesContractDto> SalesContracts,
        List<HedgePositionDto> OpenHedges,
        List<HedgePositionDto> ClosedHedges,
        decimal TotalRealizedPnl
    );

    public record GetTradingPortfolioQuery : IRequest<TradingPortfolioDto>;

    public class GetTradingPortfolioQueryHandler : IRequestHandler<GetTradingPortfolioQuery, TradingPortfolioDto>
    {
        private readonly ITradingDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetTradingPortfolioQueryHandler(ITradingDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<TradingPortfolioDto> Handle(GetTradingPortfolioQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load contracts
            var contracts = await _context.SalesContracts
                .AsNoTracking()
                .Where(c => c.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var contractDtos = contracts.Select(c => new SalesContractDto(
                c.Id,
                c.ContractNumber,
                c.CustomerClientId,
                c.CropType,
                c.ContractPricePerTon,
                c.QuantityTons,
                c.DeliveredQuantityTons,
                c.QuantityTons > 0 ? (c.DeliveredQuantityTons / c.QuantityTons) * 100 : 0,
                c.Status
            )).ToList();

            // Load hedges
            var hedges = await _context.HedgingPositions
                .AsNoTracking()
                .Where(h => h.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var openHedges = hedges.Where(h => h.Status == "Open").Select(h => {
                // Calculate unrealized Pnl dynamically
                decimal multiplier = 136.0m;
                decimal diff = h.Type == "Short" ? h.EntryPricePerTon - h.CurrentMarketPricePerTon : h.CurrentMarketPricePerTon - h.EntryPricePerTon;
                decimal pnl = h.QuantityContracts * diff * multiplier;
                
                return new HedgePositionDto(
                    h.Id,
                    h.Symbol,
                    h.Type,
                    h.QuantityContracts,
                    h.EntryPricePerTon,
                    null,
                    h.CurrentMarketPricePerTon,
                    pnl,
                    h.Status
                );
            }).ToList();

            var closedHedges = hedges.Where(h => h.Status == "Closed").Select(h => new HedgePositionDto(
                h.Id,
                h.Symbol,
                h.Type,
                h.QuantityContracts,
                h.EntryPricePerTon,
                h.ExitPricePerTon,
                h.CurrentMarketPricePerTon,
                h.RealizedPnl,
                h.Status
            )).ToList();

            decimal totalRealized = closedHedges.Sum(c => c.Pnl);

            return new TradingPortfolioDto(
                contractDtos,
                openHedges,
                closedHedges,
                totalRealized
            );
        }
    }
}
