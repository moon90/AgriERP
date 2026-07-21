using AgriERP.Modules.Irrigation.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Irrigation.Application.Common
{
    public interface IIrrigationDbContext
    {
        DbSet<WaterSource> WaterSources { get; }
        DbSet<IrrigationLog> IrrigationLogs { get; }
        DbSet<WaterUsageBilling> WaterUsageBillings { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
