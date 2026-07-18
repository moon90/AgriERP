using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Finance.Domain
{
    public class GeneralLedgerAccount : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string AccountCode { get; private set; }
        public string AccountName { get; private set; }
        public string Type { get; private set; } // Asset, Liability, Equity, Revenue, Expense

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected GeneralLedgerAccount() 
        {
            AccountCode = null!;
            AccountName = null!;
            Type = null!;
        }

        public GeneralLedgerAccount(Guid tenantId, string accountCode, string accountName, string type)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AccountCode = accountCode ?? throw new ArgumentNullException(nameof(accountCode));
            AccountName = accountName ?? throw new ArgumentNullException(nameof(accountName));
            Type = type ?? throw new ArgumentNullException(nameof(type));
        }

        public void UpdateDetails(string accountName, string type)
        {
            AccountName = accountName ?? throw new ArgumentNullException(nameof(accountName));
            Type = type ?? throw new ArgumentNullException(nameof(type));
        }
    }
}
