using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Irrigation.Domain
{
    public class WaterUsageBilling : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid WaterSourceId { get; private set; }
        public decimal GallonsUsed { get; private set; }
        public decimal CostPerGallon { get; private set; }
        public decimal Amount { get; private set; }
        public DateTime BillingDate { get; private set; }

        protected WaterUsageBilling()
        {
        }

        public WaterUsageBilling(
            Guid tenantId,
            Guid waterSourceId,
            decimal gallonsUsed,
            decimal costPerGallon,
            DateTime billingDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            WaterSourceId = waterSourceId;
            GallonsUsed = gallonsUsed >= 0 ? gallonsUsed : throw new ArgumentException("Gallons used cannot be negative.");
            CostPerGallon = costPerGallon >= 0 ? costPerGallon : throw new ArgumentException("Cost per gallon cannot be negative.");
            Amount = gallonsUsed * costPerGallon;
            BillingDate = billingDate;
        }
    }
}
