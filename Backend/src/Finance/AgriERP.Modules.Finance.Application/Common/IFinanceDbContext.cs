using AgriERP.Modules.Finance.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Finance.Application.Common
{
    public interface IFinanceDbContext
    {
        DbSet<GeneralLedgerAccount> GeneralLedgerAccounts { get; }
        DbSet<JournalEntry> JournalEntries { get; }
        DbSet<TransactionLine> TransactionLines { get; }
        DbSet<Budget> Budgets { get; }
        DbSet<FiscalYearPeriod> FiscalYearPeriods { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
