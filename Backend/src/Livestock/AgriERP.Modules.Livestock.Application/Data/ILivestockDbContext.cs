using AgriERP.Modules.Livestock.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Livestock.Application.Data
{
    public interface ILivestockDbContext
    {
        DbSet<Animal> Animals { get; }
        DbSet<BreedingCycle> BreedingCycles { get; }
        DbSet<BirthRecord> BirthRecords { get; }
        DbSet<MedicalRecord> MedicalRecords { get; }
        DbSet<AdministeredDrug> AdministeredDrugs { get; }
        DbSet<VaccinationSchedule> VaccinationSchedules { get; }
        DbSet<FeedRation> FeedRations { get; }
        DbSet<FeedRationItem> FeedRationItems { get; }
        DbSet<FeedingLog> FeedingLogs { get; }

        // ডেটাবেসে ট্রানজেকশন সেভ করার জন্য
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
