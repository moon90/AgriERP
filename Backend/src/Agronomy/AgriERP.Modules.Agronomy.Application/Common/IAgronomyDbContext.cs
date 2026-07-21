using AgriERP.Modules.Agronomy.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Agronomy.Application.Common
{
    public interface IAgronomyDbContext
    {
        DbSet<SoilSample> SoilSamples { get; }
        DbSet<AgronomyRecommendation> AgronomyRecommendations { get; }
        DbSet<LabTestingBilling> LabTestingBillings { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
