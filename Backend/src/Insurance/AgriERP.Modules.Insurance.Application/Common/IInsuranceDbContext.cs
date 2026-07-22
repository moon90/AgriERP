using AgriERP.Modules.Insurance.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Application.Common
{
    public interface IInsuranceDbContext
    {
        DbSet<InsurancePolicy> InsurancePolicies { get; }
        DbSet<LossClaim> LossClaims { get; }
        DbSet<InsurancePremiumBilling> InsurancePremiumBillings { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
