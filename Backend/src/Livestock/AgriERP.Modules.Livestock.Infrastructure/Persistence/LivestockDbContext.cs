using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AgriERP.Modules.Livestock.Infrastructure.Persistence
{
    public class LivestockDbContext : ApplicationDbContext, ILivestockDbContext
    {
        public DbSet<Animal> Animals { get; set; }
        public DbSet<BreedingCycle> BreedingCycles { get; set; }
        public DbSet<BirthRecord> BirthRecords { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<AdministeredDrug> AdministeredDrugs { get; set; }
        public DbSet<VaccinationSchedule> VaccinationSchedules { get; set; }
        public DbSet<FeedRation> FeedRations { get; set; }
        public DbSet<FeedRationItem> FeedRationItems { get; set; }
        public DbSet<FeedingLog> FeedingLogs { get; set; }
        public DbSet<MilkCollection> MilkCollections { get; set; }
        public DbSet<TankerBatch> TankerBatches { get; set; }

        public LivestockDbContext(DbContextOptions<LivestockDbContext> options, ITenantProvider tenantProvider, IPublisher publisher, ICurrentUserProvider currentUserProvider) : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Database Schema for Livestock module
            modelBuilder.HasDefaultSchema("livestock");

            // Animal Entity Configuration
            modelBuilder.Entity<Animal>(entity =>
            {
                entity.ToTable("Animals");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CurrentWeight).HasPrecision(18, 2);
                entity.HasIndex(e => e.TagNumber).IsUnique();
                entity.HasQueryFilter(a => a.TenantId == CurrentTenantId);
            });

            // Breeding & Birth Configuration
            modelBuilder.Entity<BreedingCycle>(entity =>
            {
                entity.ToTable("BreedingCycles");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
                entity.HasMany(e => e.BirthRecords)
                      .WithOne()
                      .HasForeignKey(r => r.BreedingCycleId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<BirthRecord>(entity =>
            {
                entity.ToTable("BirthRecords");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.BirthWeight).HasPrecision(18, 2);
            });

            // Medical & Vaccination Configuration
            modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.ToTable("MedicalRecords");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
                entity.HasMany(e => e.AdministeredDrugs)
                      .WithOne()
                      .HasForeignKey(d => d.MedicalRecordId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AdministeredDrug>(entity =>
            {
                entity.ToTable("AdministeredDrugs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasPrecision(18, 4);
            });

            modelBuilder.Entity<VaccinationSchedule>(entity =>
            {
                entity.ToTable("VaccinationSchedules");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            // Feed Formulation & Allocation Configuration
            modelBuilder.Entity<FeedRation>(entity =>
            {
                entity.ToTable("FeedRations");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
                entity.HasMany(e => e.FeedItems)
                      .WithOne()
                      .HasForeignKey(i => i.FeedRationId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<FeedRationItem>(entity =>
            {
                entity.ToTable("FeedRationItems");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Percentage).HasPrecision(18, 4);
            });

            modelBuilder.Entity<FeedingLog>(entity =>
            {
                entity.ToTable("FeedingLogs");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.QuantityFed).HasPrecision(18, 4);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<MilkCollection>(entity =>
            {
                entity.ToTable("MilkCollections");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
                entity.HasIndex(e => e.AnimalId);
            });

            modelBuilder.Entity<TankerBatch>(entity =>
            {
                entity.ToTable("TankerBatches");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });
        }
    }
}
