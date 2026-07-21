using AgriERP.Modules.Crops.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Common
{
    public interface ICropsDbContext
    {
        DbSet<CropField> CropFields { get; }
        DbSet<CropCycle> CropCycles { get; }
        DbSet<FieldActivity> FieldActivities { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
