using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Trading.Domain
{
    public class SalesContract : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string ContractNumber { get; private set; } = null!;
        public string CustomerClientId { get; private set; } = null!;
        public string CropType { get; private set; } = null!;
        public decimal ContractPricePerTon { get; private set; }
        public decimal QuantityTons { get; private set; }
        public decimal DeliveredQuantityTons { get; private set; }
        public string Status { get; private set; } = "Active"; // Active, Completed

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected SalesContract()
        {
        }

        public SalesContract(
            Guid tenantId,
            string contractNumber,
            string customerClientId,
            string cropType,
            decimal contractPricePerTon,
            decimal quantityTons)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            ContractNumber = contractNumber ?? throw new ArgumentNullException(nameof(contractNumber));
            CustomerClientId = customerClientId ?? throw new ArgumentNullException(nameof(customerClientId));
            CropType = cropType ?? throw new ArgumentNullException(nameof(cropType));
            
            ContractPricePerTon = contractPricePerTon > 0 ? contractPricePerTon : throw new ArgumentException("Price must be greater than zero.");
            QuantityTons = quantityTons > 0 ? quantityTons : throw new ArgumentException("Quantity must be greater than zero.");
            DeliveredQuantityTons = 0;
            Status = "Active";
        }

        public void Deliver(decimal tons)
        {
            if (tons <= 0)
                throw new ArgumentException("Delivered tons must be greater than zero.");

            if (Status == "Completed")
                throw new InvalidOperationException("Contract has already been fully delivered and completed.");

            DeliveredQuantityTons += tons;

            if (DeliveredQuantityTons >= QuantityTons)
            {
                Status = "Completed";
            }
        }
    }
}
