using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using AgriERP.Modules.Finance.Application.Common;

namespace AgriERP.Modules.Finance.Infrastructure.Persistence
{
    public class FinanceDbContext : ApplicationDbContext, IFinanceDbContext
    {
        public DbSet<GeneralLedgerAccount> GeneralLedgerAccounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<TransactionLine> TransactionLines { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<FiscalYearPeriod> FiscalYearPeriods { get; set; }

        public FinanceDbContext(
            DbContextOptions<FinanceDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var changedEntries = ChangeTracker.Entries<JournalEntry>()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified)
                .Select(e => e.Entity)
                .ToList();

            if (changedEntries.Any())
            {
                var tenantId = CurrentTenantId;
                var closedPeriods = await FiscalYearPeriods
                    .Where(p => p.TenantId == tenantId && p.IsClosed)
                    .ToListAsync(cancellationToken);

                foreach (var entry in changedEntries)
                {
                    var isClosed = closedPeriods.Any(p => entry.PostDate.Date >= p.StartDate && entry.PostDate.Date <= p.EndDate);
                    if (isClosed)
                    {
                        if (entry.Description != null && entry.Description.Contains("Closing Entry for Fiscal Year"))
                        {
                            continue;
                        }
                        throw new InvalidOperationException($"Cannot post or modify journal entries in a closed fiscal year period. Date: {entry.PostDate:yyyy-MM-dd} falls inside a closed period.");
                    }
                }
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Separate schema for Finance module
            modelBuilder.HasDefaultSchema("finance");

            modelBuilder.Entity<GeneralLedgerAccount>(entity =>
            {
                entity.ToTable("GeneralLedgerAccounts");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.AccountCode }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<JournalEntry>(entity =>
            {
                entity.ToTable("JournalEntries");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.HasMany(e => e.Lines)
                      .WithOne()
                      .HasForeignKey(l => l.JournalEntryId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<TransactionLine>(entity =>
            {
                entity.ToTable("TransactionLines");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DebitAmount).HasPrecision(18, 2);
                entity.Property(e => e.CreditAmount).HasPrecision(18, 2);
                entity.Property(e => e.ExchangeRate).HasPrecision(18, 6);
            });

            modelBuilder.Entity<Budget>(entity =>
            {
                entity.ToTable("Budgets");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.AccountCode, e.FiscalYear }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
                entity.Property(e => e.AllocatedAmount).HasPrecision(18, 2);
            });

            modelBuilder.Entity<FiscalYearPeriod>(entity =>
            {
                entity.ToTable("FiscalYearPeriods");
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.TenantId, e.Year }).IsUnique();
                entity.HasQueryFilter(x => x.TenantId == CurrentTenantId);
            });
        }
    }
}
