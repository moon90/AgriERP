using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Insurance.Domain
{
    public class LossClaim : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid InsurancePolicyId { get; private set; }
        public string ClaimNumber { get; private set; } = null!;
        public DateTime IncidentDate { get; private set; }
        public decimal ClaimAmount { get; private set; }
        public decimal AdjustedAmount { get; private set; }
        public string Status { get; private set; } = "Submitted"; // Submitted, Approved, Settled, Rejected
        public string Description { get; private set; } = "";

        protected LossClaim()
        {
        }

        public LossClaim(
            Guid tenantId,
            Guid insurancePolicyId,
            string claimNumber,
            DateTime incidentDate,
            decimal claimAmount,
            string description)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            InsurancePolicyId = insurancePolicyId;
            ClaimNumber = claimNumber ?? throw new ArgumentNullException(nameof(claimNumber));
            IncidentDate = incidentDate;
            ClaimAmount = claimAmount >= 0 ? claimAmount : throw new ArgumentException("Claim amount cannot be negative.");
            AdjustedAmount = 0.0m;
            Status = "Submitted";
            Description = description ?? "";
        }

        public void Approve(decimal adjustedAmount)
        {
            if (Status == "Settled" || Status == "Rejected")
                throw new InvalidOperationException($"Cannot approve claim in status '{Status}'.");

            AdjustedAmount = adjustedAmount >= 0 ? adjustedAmount : throw new ArgumentException("Adjusted amount cannot be negative.");
            Status = "Approved";
        }

        public void Settle(decimal finalPayoutAmount)
        {
            if (Status == "Rejected")
                throw new InvalidOperationException("Cannot settle a rejected claim.");

            AdjustedAmount = finalPayoutAmount >= 0 ? finalPayoutAmount : throw new ArgumentException("Payout amount cannot be negative.");
            Status = "Settled";
        }

        public void Reject()
        {
            Status = "Rejected";
        }
    }
}
