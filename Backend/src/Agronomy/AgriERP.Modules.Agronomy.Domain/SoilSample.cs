using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Agronomy.Domain
{
    public class SoilSample : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid FieldId { get; private set; }
        public string SampleCode { get; private set; } = null!;
        public DateTime SampleDate { get; private set; }
        public string LabName { get; private set; } = null!;
        
        // Soil Chemistry Elements
        public decimal PhLevel { get; private set; }
        public decimal NitrogenPpm { get; private set; }
        public decimal PhosphorusPpm { get; private set; }
        public decimal PotassiumPpm { get; private set; }
        public decimal OrganicMatterPercentage { get; private set; }

        // Auditing
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected SoilSample()
        {
        }

        public SoilSample(
            Guid tenantId,
            Guid fieldId,
            string sampleCode,
            DateTime sampleDate,
            string labName,
            decimal phLevel,
            decimal nitrogenPpm,
            decimal phosphorusPpm,
            decimal potassiumPpm,
            decimal organicMatterPercentage)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            FieldId = fieldId;
            SampleCode = sampleCode ?? throw new ArgumentNullException(nameof(sampleCode));
            SampleDate = sampleDate;
            LabName = labName ?? throw new ArgumentNullException(nameof(labName));

            if (phLevel < 0 || phLevel > 14)
                throw new ArgumentException("pH level must be within the range [0.0 - 14.0].");

            PhLevel = phLevel;
            NitrogenPpm = nitrogenPpm >= 0 ? nitrogenPpm : throw new ArgumentException("Nitrogen PPM cannot be negative.");
            PhosphorusPpm = phosphorusPpm >= 0 ? phosphorusPpm : throw new ArgumentException("Phosphorus PPM cannot be negative.");
            PotassiumPpm = potassiumPpm >= 0 ? potassiumPpm : throw new ArgumentException("Potassium PPM cannot be negative.");
            OrganicMatterPercentage = organicMatterPercentage >= 0 && organicMatterPercentage <= 100 
                ? organicMatterPercentage 
                : throw new ArgumentException("Organic matter percentage must be within [0.0 - 100.0].");
        }
    }
}
