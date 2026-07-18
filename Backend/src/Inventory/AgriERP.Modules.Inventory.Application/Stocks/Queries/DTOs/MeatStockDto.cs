using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Inventory.Application.Stocks.Queries.DTOs
{
    public record MeatStockDto(
        Guid Id,
        string ItemName,
        decimal TotalQuantityKg,
        DateTime LastUpdatedAt);
}
