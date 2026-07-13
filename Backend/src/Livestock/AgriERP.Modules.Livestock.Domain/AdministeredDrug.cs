using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class AdministeredDrug : Entity
    {
        public Guid MedicalRecordId { get; private set; }
        public Guid StockItemId { get; private set; } // References Inventory Item catalog
        public decimal Quantity { get; private set; }
        public string DosageInstruction { get; private set; }
        public int WithdrawalPeriodDays { get; private set; }
        public DateTime WithdrawalEndDate { get; private set; }

        protected AdministeredDrug() 
        {
            DosageInstruction = null!;
        }

        public AdministeredDrug(Guid medicalRecordId, Guid stockItemId, decimal quantity, string dosageInstruction, int withdrawalPeriodDays)
        {
            Id = Guid.NewGuid();
            MedicalRecordId = medicalRecordId;
            StockItemId = stockItemId;
            Quantity = quantity > 0 ? quantity : throw new ArgumentException("Quantity must be greater than zero.");
            DosageInstruction = dosageInstruction ?? throw new ArgumentNullException(nameof(dosageInstruction));
            WithdrawalPeriodDays = withdrawalPeriodDays >= 0 ? withdrawalPeriodDays : throw new ArgumentException("Withdrawal period cannot be negative.");
            
            // Calculate withdrawal release lock date
            WithdrawalEndDate = DateTime.UtcNow.AddDays(withdrawalPeriodDays);
        }
    }
}
