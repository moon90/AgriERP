using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Trading.Domain
{
    public class HedgingPosition : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Symbol { get; private set; } = null!;
        public string Type { get; private set; } = null!; // Short, Long
        public int QuantityContracts { get; private set; }
        public decimal EntryPricePerTon { get; private set; }
        public decimal? ExitPricePerTon { get; private set; }
        public decimal CurrentMarketPricePerTon { get; private set; }
        public decimal RealizedPnl { get; private set; }
        public string Status { get; private set; } = "Open"; // Open, Closed

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected HedgingPosition()
        {
        }

        public HedgingPosition(
            Guid tenantId,
            string symbol,
            string type,
            int quantityContracts,
            decimal entryPricePerTon)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Symbol = symbol ?? throw new ArgumentNullException(nameof(symbol));
            
            if (type != "Short" && type != "Long")
                throw new ArgumentException("Type must be either Short or Long.");

            Type = type;
            
            if (quantityContracts <= 0)
                throw new ArgumentException("Quantity contracts must be greater than zero.");

            QuantityContracts = quantityContracts;
            EntryPricePerTon = entryPricePerTon > 0 ? entryPricePerTon : throw new ArgumentException("Entry price must be greater than zero.");
            CurrentMarketPricePerTon = entryPricePerTon;
            Status = "Open";
            RealizedPnl = 0;
        }

        public void UpdateMarketPrice(decimal newPrice)
        {
            if (newPrice <= 0)
                throw new ArgumentException("Market price must be greater than zero.");

            if (Status == "Closed")
                throw new InvalidOperationException("Cannot update price of a closed position.");

            CurrentMarketPricePerTon = newPrice;
        }

        public void Close(decimal exitPrice)
        {
            if (Status == "Closed")
                throw new InvalidOperationException("Position is already closed.");

            if (exitPrice <= 0)
                throw new ArgumentException("Exit price must be greater than zero.");

            ExitPricePerTon = exitPrice;
            CurrentMarketPricePerTon = exitPrice;
            Status = "Closed";

            // 1 contract = 136 Tons (approx 5,000 bushels)
            decimal multiplier = 136.0m;

            if (Type == "Short")
            {
                RealizedPnl = QuantityContracts * (EntryPricePerTon - exitPrice) * multiplier;
            }
            else // Long
            {
                RealizedPnl = QuantityContracts * (exitPrice - EntryPricePerTon) * multiplier;
            }
        }
    }
}
