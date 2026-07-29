using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Insurance.Domain
{
    public class Adjustment : AggregateRoot, IMultiTenant
    {
        public Guid LossClaimId { get; set; }
        public string? AdjusterName { get; set; }
        public DateTime AdjustmentDate { get; set; }
        public decimal AssessedLossAmount { get; set; }
        public decimal SettlementAmount { get; set; }
        public string? Notes { get; set; }
        public Guid TenantId { get; set; }
    }
}
