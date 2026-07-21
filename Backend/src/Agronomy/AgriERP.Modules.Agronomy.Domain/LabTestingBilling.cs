using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Agronomy.Domain
{
    public class LabTestingBilling : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid SoilSampleId { get; private set; }
        public decimal TestFee { get; private set; }
        public DateTime BillingDate { get; private set; }

        protected LabTestingBilling()
        {
        }

        public LabTestingBilling(
            Guid tenantId,
            Guid soilSampleId,
            decimal testFee,
            DateTime billingDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            SoilSampleId = soilSampleId;
            TestFee = testFee >= 0 ? testFee : throw new ArgumentException("Testing fee cannot be negative.");
            BillingDate = billingDate;
        }
    }
}
