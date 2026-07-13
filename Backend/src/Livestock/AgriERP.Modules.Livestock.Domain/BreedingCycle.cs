using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Livestock.Domain
{
    public class BreedingCycle : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid FemaleAnimalId { get; private set; }
        public Guid? MaleAnimalId { get; private set; }
        public DateTime InseminationDate { get; private set; }
        public string InseminationType { get; private set; } // Artificial, Natural
        public string Status { get; private set; } // Active, Failed, Successful
        public DateTime? PregnancyCheckDate { get; private set; }
        public string? PregnancyResult { get; private set; } // Positive, Negative, Undetermined
        public DateTime? ExpectedCalvingDate { get; private set; }
        public DateTime? ActualCalvingDate { get; private set; }

        private readonly List<BirthRecord> _birthRecords = new();
        public virtual IReadOnlyCollection<BirthRecord> BirthRecords => _birthRecords.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected BreedingCycle() 
        {
            InseminationType = null!;
            Status = null!;
        }

        public BreedingCycle(Guid tenantId, Guid femaleAnimalId, Guid? maleAnimalId, DateTime inseminationDate, string inseminationType)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FemaleAnimalId = femaleAnimalId;
            MaleAnimalId = maleAnimalId;
            InseminationDate = inseminationDate;
            InseminationType = inseminationType ?? throw new ArgumentNullException(nameof(inseminationType));
            Status = "Active";
            
            // Gestation period averages (e.g. 283 days for cows)
            ExpectedCalvingDate = inseminationDate.AddDays(283);
        }

        public void RecordPregnancyCheck(DateTime checkDate, string result)
        {
            if (Status != "Active")
                throw new InvalidOperationException("Pregnancy check can only be recorded on active breeding cycles.");

            PregnancyCheckDate = checkDate;
            PregnancyResult = result ?? throw new ArgumentNullException(nameof(result));

            if (result.Equals("Negative", StringComparison.OrdinalIgnoreCase))
            {
                Status = "Failed";
                ExpectedCalvingDate = null;
            }
        }

        public void RecordCalving(DateTime calvingDate)
        {
            if (Status != "Active" && PregnancyResult != "Positive")
                throw new InvalidOperationException("Calving can only be recorded for successful positive pregnancies.");

            ActualCalvingDate = calvingDate;
            Status = "Successful";
        }

        public void AddBirthRecord(string gender, decimal birthWeight, string tagNumber, string status)
        {
            if (Status != "Successful")
                throw new InvalidOperationException("Birth records can only be added once calving is registered.");

            var record = new BirthRecord(Id, gender, birthWeight, tagNumber, status);
            _birthRecords.Add(record);
        }
    }
}
