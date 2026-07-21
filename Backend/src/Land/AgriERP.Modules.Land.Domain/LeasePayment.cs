using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Land.Domain
{
    public class LeasePayment : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid LandLeaseId { get; private set; }
        public string PaymentType { get; private set; } = null!; // Rent, SharecropYieldValue
        public decimal Amount { get; private set; }
        public string CalculationDetails { get; private set; } = null!;
        public DateTime PaymentDate { get; private set; }
        public bool IsPaid { get; private set; }

        protected LeasePayment()
        {
        }

        public LeasePayment(
            Guid tenantId,
            Guid landLeaseId,
            string paymentType,
            decimal amount,
            string calculationDetails,
            DateTime paymentDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            LandLeaseId = landLeaseId;
            PaymentType = paymentType ?? throw new ArgumentNullException(nameof(paymentType));
            Amount = amount >= 0 ? amount : throw new ArgumentException("Payment amount cannot be negative.");
            CalculationDetails = calculationDetails ?? throw new ArgumentNullException(nameof(calculationDetails));
            PaymentDate = paymentDate;
            IsPaid = false;
        }

        public void MarkPaid()
        {
            IsPaid = true;
        }
    }
}
