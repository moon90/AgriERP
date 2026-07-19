using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Assets.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Application.Assets.Commands.CalculateDepreciation
{
    public record CalculateDepreciationCommand(DateTime ExecutionDate) : IRequest<decimal>;

    public class CalculateDepreciationCommandHandler : IRequestHandler<CalculateDepreciationCommand, decimal>
    {
        private readonly IAssetsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public CalculateDepreciationCommandHandler(
            IAssetsDbContext context, 
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<decimal> Handle(CalculateDepreciationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            var executionDate = request.ExecutionDate.Date;

            // Fetch active assets that haven't been fully depreciated and not depreciated in the same month yet
            var assets = await _context.Assets
                .Where(a => a.TenantId == tenantId && 
                            a.Status == "Active" && 
                            a.AccumulatedDepreciation < a.PurchasePrice &&
                            (a.LastDepreciationDate == null || 
                             a.LastDepreciationDate.Value.Year != executionDate.Year || 
                             a.LastDepreciationDate.Value.Month != executionDate.Month))
                .ToListAsync(cancellationToken);

            if (!assets.Any())
            {
                return 0;
            }

            decimal totalDepreciationAmount = 0;

            foreach (var asset in assets)
            {
                // Calculate monthly straight line depreciation
                decimal monthlyAmount = asset.PurchasePrice / asset.UsefulLifeMonths;
                
                // Cap at remaining depreciable value
                var remainingDepreciableValue = asset.PurchasePrice - asset.AccumulatedDepreciation;
                if (monthlyAmount > remainingDepreciableValue)
                {
                    monthlyAmount = remainingDepreciableValue;
                }

                if (monthlyAmount > 0)
                {
                    asset.ApplyDepreciation(monthlyAmount, executionDate);
                    totalDepreciationAmount += monthlyAmount;
                }
            }

            if (totalDepreciationAmount > 0)
            {
                await _context.SaveChangesAsync(cancellationToken);

                // Publish integration event to Finance
                var depEvent = new AssetDepreciationCalculatedIntegrationEvent(
                    tenantId,
                    totalDepreciationAmount,
                    executionDate
                );
                await _publisher.Publish(depEvent, cancellationToken);
            }

            return totalDepreciationAmount;
        }
    }
}
