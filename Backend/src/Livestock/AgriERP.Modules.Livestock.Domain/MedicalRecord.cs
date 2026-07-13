using AgriERP.BuildingBlocks.Domain;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AgriERP.Modules.Livestock.Domain
{
    public class MedicalRecord : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid AnimalId { get; private set; }
        public string Diagnosis { get; private set; }
        public DateTime TreatmentDate { get; private set; }
        public string Notes { get; private set; }

        private readonly List<AdministeredDrug> _administeredDrugs = new();
        public virtual IReadOnlyCollection<AdministeredDrug> AdministeredDrugs => _administeredDrugs.AsReadOnly();

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected MedicalRecord() 
        {
            Diagnosis = null!;
            Notes = null!;
        }

        public MedicalRecord(Guid tenantId, Guid animalId, string diagnosis, string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AnimalId = animalId;
            Diagnosis = diagnosis ?? throw new ArgumentNullException(nameof(diagnosis));
            Notes = notes ?? string.Empty;
            TreatmentDate = DateTime.UtcNow;
        }

        public void AdministerDrug(Guid stockItemId, decimal quantity, string dosageInstruction, int withdrawalPeriodDays)
        {
            var drug = new AdministeredDrug(Id, stockItemId, quantity, dosageInstruction, withdrawalPeriodDays);
            _administeredDrugs.Add(drug);
        }
    }
}
