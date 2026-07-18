using FluentValidation;
using System;

namespace AgriERP.Modules.Inventory.Application.Stocks.Commands.ReceiveStock
{
    public class ReceiveStockCommandValidator : AbstractValidator<ReceiveStockCommand>
    {
        public ReceiveStockCommandValidator()
        {
            RuleFor(x => x.PurchaseOrderId)
                .NotEmpty().WithMessage("Purchase Order ID is required.");

            RuleFor(x => x.StockItemId)
                .NotEmpty().WithMessage("Stock Item ID is required.");

            RuleFor(x => x.WarehouseId)
                .NotEmpty().WithMessage("Warehouse ID is required.");

            RuleFor(x => x.BatchNumber)
                .NotEmpty().WithMessage("Batch Number is required.")
                .MaximumLength(100).WithMessage("Batch Number cannot exceed 100 characters.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Quantity must be greater than zero.");

            RuleFor(x => x.CostBasis)
                .GreaterThanOrEqualTo(0).WithMessage("Cost basis cannot be negative.");

            RuleFor(x => x.ExpirationDate)
                .Must(date => !date.HasValue || date.Value > DateTime.UtcNow)
                .WithMessage("Expiration date must be in the future.");
        }
    }
}
