using AgriERP.Modules.Land.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Land.Application.Common
{
    public interface ILandDbContext
    {
        DbSet<LandLease> LandLeases { get; }
        DbSet<LeasePayment> LeasePayments { get; }
        DbSet<Parcel> Parcels { get; }
        DbSet<CropShareSplit> CropShareSplits { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
