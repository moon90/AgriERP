using AgriERP.Modules.Trading.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Common
{
    public interface ITradingDbContext
    {
        DbSet<SalesContract> SalesContracts { get; }
        DbSet<HedgingPosition> HedgingPositions { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
