using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Chemicals.Domain
{
    public class ApplicationLog : AggregateRoot, IMultiTenant
    {
        public Guid TenantId { get; set; }
        public Guid ChemicalProductId { get; private set; }
        public Guid FieldId { get; private set; }
        public decimal QuantityAppliedLiters { get; private set; }
        public decimal AreaTreatedAcres { get; private set; }
        public decimal DosagePerAcre { get; private set; } // Liters per Acre
        public DateTime ApplicationDate { get; private set; }
        public DateTime SafetyIntervalExpiry { get; private set; }
        public string Notes { get; private set; } = "";

        protected ApplicationLog()
        {
        }

        public ApplicationLog(
            Guid tenantId,
            Guid chemicalProductId,
            Guid fieldId,
            decimal quantityAppliedLiters,
            decimal areaTreatedAcres,
            int safetyHours,
            DateTime applicationDate,
            string notes)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            ChemicalProductId = chemicalProductId;
            FieldId = fieldId;
            QuantityAppliedLiters = quantityAppliedLiters >= 0 ? quantityAppliedLiters : throw new ArgumentException("Quantity applied cannot be negative.");
            AreaTreatedAcres = areaTreatedAcres > 0 ? areaTreatedAcres : throw new ArgumentException("Area treated acres must be greater than zero.");
            
            // Dosage = Quantity / Area
            DosagePerAcre = quantityAppliedLiters / areaTreatedAcres;
            ApplicationDate = applicationDate;
            SafetyIntervalExpiry = applicationDate.AddHours(safetyHours);
            Notes = notes ?? "";
        }
    }
}
