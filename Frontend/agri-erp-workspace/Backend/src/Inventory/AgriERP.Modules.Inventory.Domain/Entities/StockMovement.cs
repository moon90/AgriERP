using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Inventory.Domain.Entities
{
    public class StockMovement : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid StockBatchId { get; private set; }
        public decimal Quantity { get; private set; } // Positive for addition, negative for deduction
        public string MovementType { get; private set; } // Inflow, Outflow, InternalTransfer
        public DateTime MovementDate { get; private set; }
        public Guid? ReferenceId { get; private set; } // Reference to PO, Sales Order, or Veterinary Treatment

        protected StockMovement() 
        {
            MovementType = null!;
        }

        public StockMovement(Guid tenantId, Guid stockBatchId, decimal quantity, string movementType, Guid? referenceId = null)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            StockBatchId = stockBatchId;
            Quantity = quantity;
            MovementType = movementType ?? throw new ArgumentNullException(nameof(movementType));
            MovementDate = DateTime.UtcNow;
            ReferenceId = referenceId;
        }
    }
}
