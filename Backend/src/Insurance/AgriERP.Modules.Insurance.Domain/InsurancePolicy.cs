using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Insurance.Domain
{
    public class InsurancePolicy : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public string PolicyNumber { get; private set; } = null!;
        public string ProviderName { get; private set; } = null!;
        public decimal CoverageAmount { get; private set; }
        public decimal PremiumAmount { get; private set; }
        public DateTime StartDate { get; private set; }
        public DateTime EndDate { get; private set; }
        public Guid FieldId { get; private set; }

        protected InsurancePolicy()
        {
        }

        public InsurancePolicy(
            Guid tenantId,
            string policyNumber,
            string providerName,
            decimal coverageAmount,
            decimal premiumAmount,
            DateTime startDate,
            DateTime endDate,
            Guid fieldId)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            PolicyNumber = policyNumber ?? throw new ArgumentNullException(nameof(policyNumber));
            ProviderName = providerName ?? throw new ArgumentNullException(nameof(providerName));
            CoverageAmount = coverageAmount >= 0 ? coverageAmount : throw new ArgumentException("Coverage amount cannot be negative.");
            PremiumAmount = premiumAmount >= 0 ? premiumAmount : throw new ArgumentException("Premium amount cannot be negative.");
            StartDate = startDate;
            EndDate = endDate >= startDate ? endDate : throw new ArgumentException("End date must be greater than or equal to start date.");
            FieldId = fieldId;
        }
    }
}
