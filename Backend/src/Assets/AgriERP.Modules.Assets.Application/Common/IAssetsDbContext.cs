using AgriERP.Modules.Assets.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Application.Common
{
    public interface IAssetsDbContext
    {
        DbSet<Asset> Assets { get; }
        DbSet<MaintenanceLog> MaintenanceLogs { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
