using AgriERP.Modules.Chemicals.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Chemicals.Application.Common
{
    public interface IChemicalsDbContext
    {
        DbSet<ChemicalProduct> ChemicalProducts { get; }
        DbSet<ApplicationLog> ApplicationLogs { get; }
        DbSet<ActiveIngredient> ActiveIngredients { get; }
        DbSet<PHITimer> PHITimers { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
