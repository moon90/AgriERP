using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Finance.Domain
{
    public class Budget : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string AccountCode { get; private set; }
        public int FiscalYear { get; private set; }
        public decimal AllocatedAmount { get; private set; }

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected Budget()
        {
            AccountCode = null!;
        }

        public Budget(Guid tenantId, string accountCode, int fiscalYear, decimal allocatedAmount)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AccountCode = accountCode ?? throw new ArgumentNullException(nameof(accountCode));
            FiscalYear = fiscalYear;
            AllocatedAmount = allocatedAmount;
        }

        public void UpdateBudget(decimal allocatedAmount)
        {
            AllocatedAmount = allocatedAmount;
        }
    }
}
