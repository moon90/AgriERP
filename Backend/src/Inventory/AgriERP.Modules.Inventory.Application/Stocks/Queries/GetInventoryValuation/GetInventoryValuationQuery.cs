using AgriERP.BuildingBlocks.Application;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Inventory.Application.Stocks.Queries.GetInventoryValuation
{
    public record GetInventoryValuationQuery() : IRequest<List<WarehouseValuationDto>>;

    public record WarehouseValuationDto(Guid WarehouseId, string WarehouseName, List<CategoryValuationDto> Categories);
    public record CategoryValuationDto(string Category, decimal TotalQuantity, decimal TotalValue);

    public class GetInventoryValuationQueryHandler : IRequestHandler<GetInventoryValuationQuery, List<WarehouseValuationDto>>
    {
        private readonly Infrastructure.Persistence.InventoryDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetInventoryValuationQueryHandler(Infrastructure.Persistence.InventoryDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<List<WarehouseValuationDto>> Handle(GetInventoryValuationQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
                throw new UnauthorizedAccessException("Tenant context missing.");

            // Fetch active stock batches with parent item category and warehouse details
            var queryResult = await (from sb in _context.StockBatches
                                     join si in _context.StockItems on sb.StockItemId equals si.Id
                                     join wh in _context.Warehouses on sb.WarehouseId equals wh.Id
                                     where sb.TenantId == tenantId && sb.Quantity > 0
                                     select new
                                     {
                                         WarehouseId = wh.Id,
                                         WarehouseName = wh.Name,
                                         Category = si.Category,
                                         Quantity = sb.Quantity,
                                         Value = sb.Quantity * sb.CostBasis
                                     })
                                     .ToListAsync(cancellationToken);

            // Group by Warehouse and Category to build valuation report
            var grouped = queryResult
                .GroupBy(x => new { x.WarehouseId, x.WarehouseName })
                .Select(g => new WarehouseValuationDto(
                    g.Key.WarehouseId,
                    g.Key.WarehouseName,
                    g.GroupBy(c => c.Category)
                     .Select(cg => new CategoryValuationDto(
                         cg.Key,
                         cg.Sum(x => x.Quantity),
                         cg.Sum(x => x.Value)
                     )).ToList()
                )).ToList();

            return grouped;
        }
    }
}
