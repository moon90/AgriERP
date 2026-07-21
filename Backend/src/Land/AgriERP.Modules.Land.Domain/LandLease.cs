using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Land.Domain
{
    public class LandLease : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public string LeaseNumber { get; private set; } = null!;
        public string LandlordName { get; private set; } = null!;
        public Guid FieldId { get; private set; }
        public string LeaseType { get; private set; } = null!; // CashRent, Sharecrop
        public decimal CashRentPerAcre { get; private set; }
        public decimal AreaAcres { get; private set; }
        public decimal LandlordSharePercentage { get; private set; }
        public DateTime ContractStartDate { get; private set; }
        public DateTime ContractEndDate { get; private set; }
        public string Status { get; private set; } = "Active"; // Active, Closed

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected LandLease()
        {
        }

        public LandLease(
            Guid tenantId,
            string leaseNumber,
            string landlordName,
            Guid fieldId,
            string leaseType,
            decimal cashRentPerAcre,
            decimal areaAcres,
            decimal landlordSharePercentage,
            DateTime contractStartDate,
            DateTime contractEndDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            LeaseNumber = leaseNumber ?? throw new ArgumentNullException(nameof(leaseNumber));
            LandlordName = landlordName ?? throw new ArgumentNullException(nameof(landlordName));
            FieldId = fieldId;
            
            if (leaseType != "CashRent" && leaseType != "Sharecrop")
                throw new ArgumentException("Lease type must be either CashRent or Sharecrop.");
            
            LeaseType = leaseType;
            CashRentPerAcre = cashRentPerAcre >= 0 ? cashRentPerAcre : throw new ArgumentException("Cash rent cannot be negative.");
            AreaAcres = areaAcres > 0 ? areaAcres : throw new ArgumentException("Area acres must be greater than zero.");
            
            if (landlordSharePercentage < 0 || landlordSharePercentage > 1.0m)
                throw new ArgumentException("Landlord share percentage must be between 0 and 100% (0.0 to 1.0).");

            LandlordSharePercentage = landlordSharePercentage;
            ContractStartDate = contractStartDate;
            ContractEndDate = contractEndDate;
            Status = "Active";
        }

        public void Close()
        {
            Status = "Closed";
        }
    }
}
