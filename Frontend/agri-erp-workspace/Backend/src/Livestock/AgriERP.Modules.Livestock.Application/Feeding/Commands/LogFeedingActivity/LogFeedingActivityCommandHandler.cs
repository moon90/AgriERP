using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Feeding.Commands.LogFeedingActivity
{
    public class LogFeedingActivityCommandHandler : IRequestHandler<LogFeedingActivityCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogFeedingActivityCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider, IPublisher publisher)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogFeedingActivityCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            // Fetch the feed ration with its formula items
            var ration = await _dbContext.FeedRations
                .Include(r => r.FeedItems)
                .FirstOrDefaultAsync(r => r.Id == request.FeedRationId && r.TenantId == tenantId, cancellationToken);

            if (ration == null)
            {
                throw new ArgumentException("Feed ration not found.");
            }

            var feedingLog = new FeedingLog(
                tenantId,
                request.FeedRationId,
                request.PenOrBarnId,
                request.QuantityFed
            );

            _dbContext.FeedingLogs.Add(feedingLog);
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Compute and publish inventory consumption for each formula item
            foreach (var item in ration.FeedItems)
            {
                var portionWeight = request.QuantityFed * (item.Percentage / 100.0m);

                var integrationEvent = new InventoryConsumedIntegrationEvent(
                    tenantId,
                    item.StockItemId,
                    portionWeight,
                    feedingLog.Id
                );

                await _publisher.Publish(integrationEvent, cancellationToken);
            }

            return feedingLog.Id;
        }
    }
}
