using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Finance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;

using AgriERP.Modules.Finance.Application.Common;

namespace AgriERP.Modules.Finance.Infrastructure.Persistence
{
    public class FinanceDbContext : ApplicationDbContext, IFinanceDbContext
    {
        public DbSet<GeneralLedgerAccount> GeneralLedgerAccounts { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<TransactionLine> TransactionLines { get; set; }

        public FinanceDbContext(
            DbContextOptions<FinanceDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
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
        }
    }
}
