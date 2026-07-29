using AgriERP.Modules.HR.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.HR.Application.Common
{
    public interface IHrDbContext
    {
        DbSet<Employee> Employees { get; }
        DbSet<TimeCard> TimeCards { get; }
        DbSet<PayrollPeriod> PayrollPeriods { get; }
        DbSet<Payslip> Payslips { get; }
        DbSet<FieldLaborAllocation> FieldLaborAllocations { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
