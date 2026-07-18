using AgriERP.BuildingBlocks.Application;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.Stocks.Queries.GetLowStockAlerts
{
    public record GetLowStockAlertsQuery() : IRequest<List<LowStockAlertDto>>;

    public record LowStockAlertDto(Guid StockItemId, string SKU, string Name, decimal CurrentStock, decimal ReorderLevel);

    public class GetLowStockAlertsQueryHandler : IRequestHandler<GetLowStockAlertsQuery, List<LowStockAlertDto>>
    {
        private readonly Infrastructure.Persistence.InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetLowStockAlertsQueryHandler(Infrastructure.Persistence.InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<List<LowStockAlertDto>> Handle(GetLowStockAlertsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // Fetch catalog items for the active tenant
            var stockItems = await _context.StockItems
                .Where(si => si.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            // Group active batches to find current total quantity per item
            var batchQuantities = await _context.StockBatches
                .Where(sb => sb.TenantId == tenantId && sb.Quantity > 0)
                .GroupBy(sb => sb.StockItemId)
                .Select(g => new
                {
                    StockItemId = g.Key,
                    TotalQuantity = g.Sum(sb => sb.Quantity)
                })
                .ToListAsync(cancellationToken);

            var quantityMap = batchQuantities.ToDictionary(x => x.StockItemId, x => x.TotalQuantity);

            // Build alerts for any item falling below its target ReorderLevel
            var alerts = stockItems
                .Select(si => new LowStockAlertDto(
                    si.Id,
                    si.SKU,
                    si.Name,
                    quantityMap.TryGetValue(si.Id, out var qty) ? qty : 0m,
                    si.ReorderLevel
                ))
                .Where(dto => dto.CurrentStock < dto.ReorderLevel)
                .ToList();

            return alerts;
        }
    }
}
