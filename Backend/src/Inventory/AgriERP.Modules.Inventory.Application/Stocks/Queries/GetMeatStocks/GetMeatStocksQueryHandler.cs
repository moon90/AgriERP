using AgriERP.Modules.Inventory.Application.Stocks.Queries.DTOs;
using AgriERP.Modules.Inventory.Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Inventory.Application.Stocks.Queries.GetMeatStocks
{
    public class GetMeatStocksQueryHandler : IRequestHandler<GetMeatStocksQuery, List<MeatStockDto>>
    {
        private readonly InventoryDbContext _context;

        public GetMeatStocksQueryHandler(InventoryDbContext context)
        {
            _context = context;
        }

        public async Task<List<MeatStockDto>> Handle(GetMeatStocksQuery request, CancellationToken cancellationToken)
        {
            // ডাটাবেস থেকে স্টক তুলে আনা এবং DTO তে ম্যাপ করা
            return await _context.MeatStocks
                .AsNoTracking()
                .Select(stock => new MeatStockDto(
                    stock.Id,
                    stock.ItemName,
                    stock.TotalQuantityKg,
                    stock.LastUpdatedAt))
                .ToListAsync(cancellationToken);
        }
    }
}
