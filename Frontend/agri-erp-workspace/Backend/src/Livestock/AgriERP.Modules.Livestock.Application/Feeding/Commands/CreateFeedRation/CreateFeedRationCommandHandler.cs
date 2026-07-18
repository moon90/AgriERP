using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Feeding.Commands.CreateFeedRation
{
    public class CreateFeedRationCommandHandler : IRequestHandler<CreateFeedRationCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        public CreateFeedRationCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateFeedRationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            var ration = new FeedRation(tenantId, request.Name, request.TargetSpecies);

            if (request.FeedItems != null)
            {
                foreach (var item in request.FeedItems)
                {
                    ration.AddItem(item.StockItemId, item.Percentage);
                }
            }

            // Enforce that the ratio percentages sum to exactly 100%
            ration.ValidateFormula();

            _dbContext.FeedRations.Add(ration);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return ration.Id;
        }
    }
}
