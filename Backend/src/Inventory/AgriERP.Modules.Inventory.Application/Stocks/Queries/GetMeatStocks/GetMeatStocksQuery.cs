using AgriERP.Modules.Inventory.Application.Stocks.Queries.DTOs;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Inventory.Application.Stocks.Queries.GetMeatStocks
{
    public record GetMeatStocksQuery() : IRequest<List<MeatStockDto>>;
}
