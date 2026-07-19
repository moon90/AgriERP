using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.HR.Application.Common;
using AgriERP.Modules.HR.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.HR.Infrastructure.Persistence
{
    public class HrDbContext : ApplicationDbContext, IHrDbContext
    {
        public DbSet<Employee> Employees { get; set; } = null!;
        public DbSet<TimeCard> TimeCards { get; set; } = null!;
        public DbSet<PayrollPeriod> PayrollPeriods { get; set; } = null!;
        public DbSet<Payslip> Payslips { get; set; } = null!;

        public HrDbContext(
            DbContextOptions<HrDbContext> options,
            ITenantProvider tenantProvider,
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider)
            : base(options, tenantProvider, publisher, currentUserProvider)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Bounded Context Bounded schema setup
            modelBuilder.HasDefaultSchema("hr");

            modelBuilder.Entity<Employee>(entity =>
            {
                entity.ToTable("Employees");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.BaseHourlyRate).HasPrecision(18, 2);
                entity.Property(e => e.MonthlySalary).HasPrecision(18, 2);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<TimeCard>(entity =>
            {
                entity.ToTable("TimeCards");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.HoursWorked).HasPrecision(18, 4);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<PayrollPeriod>(entity =>
            {
                entity.ToTable("PayrollPeriods");
                entity.HasKey(e => e.Id);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });

            modelBuilder.Entity<Payslip>(entity =>
            {
                entity.ToTable("Payslips");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.GrossEarnings).HasPrecision(18, 2);
                entity.Property(e => e.TaxDeductions).HasPrecision(18, 2);
                entity.Property(e => e.NetPay).HasPrecision(18, 2);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.PayrollPeriodId);
                entity.HasQueryFilter(e => e.TenantId == CurrentTenantId);
            });
        }
    }
}
