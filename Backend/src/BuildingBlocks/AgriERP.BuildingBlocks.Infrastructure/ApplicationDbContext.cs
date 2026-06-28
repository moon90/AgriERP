using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Infrastructure
{
    public abstract class ApplicationDbContext : DbContext
    {
        // API request asar por JWT token theke ei id ti ekhane set kora hobe
        private readonly ITenantProvider _tenantProvider;

        protected ApplicationDbContext(DbContextOptions options, ITenantProvider tenantProvider) : base(options)
        {
            _tenantProvider = tenantProvider;
        }

        // Dynamic runtime Property
        public Guid CurrentTenantId => _tenantProvider.TenantId;

        // Save korar age automatically TenantId inject korar logic
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<IMultiTenant>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        // Notun data insert er somoy auto TenantId bose jabe
                        if (entry.Entity.TenantId == Guid.Empty)
                        {
                            entry.Entity.TenantId = CurrentTenantId;
                        }
                        break;

                    case EntityState.Modified:
                    case EntityState.Deleted:
                        // Keu jeno onno tenant er data update ba delete korte na pare
                        if (entry.Entity.TenantId != CurrentTenantId)
                        {
                            throw new UnauthorizedAccessException("Security Violation: You cannot modify data of another tenant!");
                        }
                        break;
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
