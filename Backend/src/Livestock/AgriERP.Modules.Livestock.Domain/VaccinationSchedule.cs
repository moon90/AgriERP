using AgriERP.BuildingBlocks.Domain;
using System;

namespace AgriERP.Modules.Livestock.Domain
{
    public class VaccinationSchedule : AggregateRoot, IMultiTenant, IAuditable
    {
        public Guid TenantId { get; set; }
        public Guid AnimalId { get; private set; }
        public Guid VaccineItemId { get; private set; } // References Inventory Item catalog
        public DateTime ScheduledDate { get; private set; }
        public DateTime? AdministeredDate { get; private set; }
        public string Status { get; private set; } // Scheduled, Completed, Overdue

        // Auditing properties
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? UpdatedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }

        protected VaccinationSchedule() 
        {
            Status = null!;
        }

        public VaccinationSchedule(Guid tenantId, Guid animalId, Guid vaccineItemId, DateTime scheduledDate)
        {
            Id = Guid.NewGuid();
            TenantId = tenantId;
            AnimalId = animalId;
            VaccineItemId = vaccineItemId;
            ScheduledDate = scheduledDate;
            Status = "Scheduled";
        }

        public void Complete(DateTime administeredDate)
        {
            if (Status == "Completed")
                throw new InvalidOperationException("Vaccination is already completed.");

            AdministeredDate = administeredDate;
            Status = "Completed";
        }

        public void CheckOverdue()
        {
            if (Status == "Scheduled" && DateTime.UtcNow.Date > ScheduledDate.Date)
            {
                Status = "Overdue";
            }
        }
    }
}
