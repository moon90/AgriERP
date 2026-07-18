using MediatR;
using System;

namespace AgriERP.Modules.Inventory.Application.Stocks.Commands.ReceiveStock
{
    public record ReceiveStockCommand(
        Guid PurchaseOrderId,
        Guid StockItemId,
        Guid WarehouseId,
        string BatchNumber,
        decimal Quantity,
        decimal CostBasis,
        DateTime? ExpirationDate) : IRequest<Guid>;
}
