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
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
