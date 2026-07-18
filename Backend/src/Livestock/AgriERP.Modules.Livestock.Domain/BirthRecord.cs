using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class BirthRecord : Entity
    {
        public Guid BreedingCycleId { get; private set; }
        public DateTime CalvingDate { get; private set; }
        public string Gender { get; private set; } // Male, Female
        public decimal BirthWeight { get; private set; }
        public string TagNumber { get; private set; } // Generated tag or ID
        public string Status { get; private set; } // LiveBirth, Stillborn

        protected BirthRecord() 
        {
            Gender = null!;
            TagNumber = null!;
            Status = null!;
        }

        public BirthRecord(Guid breedingCycleId, string gender, decimal birthWeight, string tagNumber, string status)
        {
            Id = Guid.NewGuid();
            BreedingCycleId = breedingCycleId;
            CalvingDate = DateTime.UtcNow;
            Gender = gender ?? throw new ArgumentNullException(nameof(gender));
            BirthWeight = birthWeight >= 0 ? birthWeight : throw new ArgumentException("Birth weight cannot be negative.");
            TagNumber = tagNumber ?? string.Empty;
            Status = status ?? "LiveBirth";
        }
    }
}
