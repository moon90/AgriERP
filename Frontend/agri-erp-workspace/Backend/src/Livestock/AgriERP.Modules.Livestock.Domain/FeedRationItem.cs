using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class FeedRationItem : Entity
    {
        public Guid FeedRationId { get; private set; }
        public Guid StockItemId { get; private set; } // References Inventory item catalog
        public decimal Percentage { get; private set; } // Percentage of ration (0.00 to 100.00)

        protected FeedRationItem() { }

        public FeedRationItem(Guid feedRationId, Guid stockItemId, decimal percentage)
        {
            Id = Guid.NewGuid();
            FeedRationId = feedRationId;
            StockItemId = stockItemId;
            Percentage = percentage > 0 && percentage <= 100 ? percentage : throw new ArgumentException("Percentage must be between 0 and 100.");
        }

        public void UpdatePercentage(decimal percentage)
        {
            Percentage = percentage > 0 && percentage <= 100 ? percentage : throw new ArgumentException("Percentage must be between 0 and 100.");
        }
    }
}
