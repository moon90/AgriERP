using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Livestock.Domain
{
    public class FeedRation : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string Name { get; private set; }
        public string TargetSpecies { get; private set; } // Cattle, Poultry, Sheep, Goats

        private readonly List<FeedRationItem> _feedItems = new();
        public virtual IReadOnlyCollection<FeedRationItem> FeedItems => _feedItems.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected FeedRation() 
        {
            Name = null!;
            TargetSpecies = null!;
        }

        public FeedRation(Guid tenantId, string name, string targetSpecies)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            Name = name ?? throw new ArgumentNullException(nameof(name));
            TargetSpecies = targetSpecies ?? throw new ArgumentNullException(nameof(targetSpecies));
        }

        public void AddItem(Guid stockItemId, decimal percentage)
        {
            if (percentage <= 0 || percentage > 100)
                throw new ArgumentException("Percentage must be between 0 and 100.");

            var existingItem = _feedItems.FirstOrDefault(i => i.StockItemId == stockItemId);
            if (existingItem != null)
            {
                existingItem.UpdatePercentage(percentage);
            }
            else
            {
                var item = new FeedRationItem(Id, stockItemId, percentage);
                _feedItems.Add(item);
            }
        }

        public void RemoveItem(Guid stockItemId)
        {
            var item = _feedItems.FirstOrDefault(i => i.StockItemId == stockItemId);
            if (item != null)
            {
                _feedItems.Remove(item);
            }
        }

        public void ValidateFormula()
        {
            var totalPercentage = _feedItems.Sum(i => i.Percentage);
            if (Math.Abs(totalPercentage - 100.0m) > 0.001m)
            {
                throw new InvalidOperationException($"Invalid Feed Formula! Total percentage must sum to exactly 100%. Current sum: {totalPercentage}%.");
            }
        }
    }
}
