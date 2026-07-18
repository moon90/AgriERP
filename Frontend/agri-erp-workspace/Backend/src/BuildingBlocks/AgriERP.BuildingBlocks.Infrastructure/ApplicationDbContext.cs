using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.BuildingBlocks.Infrastructure
{
    public abstract class ApplicationDbContext : DbContext
    {
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;
        private readonly ICurrentUserProvider _currentUserProvider;

        protected ApplicationDbContext(
            DbContextOptions options, 
            ITenantProvider tenantProvider, 
            IPublisher publisher,
            ICurrentUserProvider currentUserProvider) : base(options)
        {
            _tenantProvider = tenantProvider;
            _publisher = publisher;
            _currentUserProvider = currentUserProvider;
        }

        public Guid CurrentTenantId => _tenantProvider.TenantId;

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // 1. Multi-Tenancy Resolution
            foreach (var entry in ChangeTracker.Entries<IMultiTenant>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        if (entry.Entity.TenantId == Guid.Empty)
                        {
                            entry.Entity.TenantId = CurrentTenantId;
                        }
                        break;

                    case EntityState.Modified:
                    case EntityState.Deleted:
                        if (entry.Entity.TenantId != CurrentTenantId)
                        {
                            throw new UnauthorizedAccessException("Security Violation: You cannot modify data of another tenant!");
                        }
                        break;
                }
            }

            // 2. Automatic Auditing Resolution
            var currentUserId = _currentUserProvider.UserId;
            foreach (var entry in ChangeTracker.Entries<IAuditable>())
            {
                switch (entry.State)
                {
                    case EntityState.Added:
                        entry.Entity.CreatedAt = DateTime.UtcNow;
                        entry.Entity.CreatedBy = currentUserId;
                        break;

                    case EntityState.Modified:
                        entry.Entity.UpdatedAt = DateTime.UtcNow;
                        entry.Entity.UpdatedBy = currentUserId;
                        break;
                }
            }

            var result = await base.SaveChangesAsync(cancellationToken);

            // 3. Dispatch Domain Events
            var domainEntities = ChangeTracker
                .Entries<AggregateRoot>()
                .Where(x => x.Entity.DomainEvents != null && x.Entity.DomainEvents.Any())
                .ToList();

            var domainEvents = domainEntities
                .SelectMany(x => x.Entity.DomainEvents)
                .ToList();

            domainEntities.ForEach(entity => entity.Entity.ClearDomainEvents());

            foreach (var domainEvent in domainEvents)
            {
                await _publisher.Publish(domainEvent, cancellationToken);
            }

            return result;
        }
    }
}
