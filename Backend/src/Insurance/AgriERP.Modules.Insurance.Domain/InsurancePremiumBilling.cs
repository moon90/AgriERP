using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Insurance.Domain
{
    public class InsurancePremiumBilling : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid InsurancePolicyId { get; private set; }
        public decimal PremiumFee { get; private set; }
        public DateTime BillingDate { get; private set; }

        protected InsurancePremiumBilling()
        {
        }

        public InsurancePremiumBilling(
            Guid tenantId,
            Guid insurancePolicyId,
            decimal premiumFee,
            DateTime billingDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            InsurancePolicyId = insurancePolicyId;
            PremiumFee = premiumFee >= 0 ? premiumFee : throw new ArgumentException("Premium fee cannot be negative.");
            BillingDate = billingDate;
        }
    }
}
