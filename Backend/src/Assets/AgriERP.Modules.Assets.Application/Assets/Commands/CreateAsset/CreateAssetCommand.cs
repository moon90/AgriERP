using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Assets.Application.Common;
using AgriERP.Modules.Assets.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Assets.Application.Assets.Commands.CreateAsset
{
    public record CreateAssetCommand(
        string Name,
        string AssetNumber,
        string Category,
        DateTime PurchaseDate,
        decimal PurchasePrice,
        int UsefulLifeMonths
    ) : IRequest<Guid>;

    public class CreateAssetCommandHandler : IRequestHandler<CreateAssetCommand, Guid>
    {
        private readonly IAssetsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateAssetCommandHandler(IAssetsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateAssetCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var asset = new Asset(
                tenantId,
                request.Name,
                request.AssetNumber,
                request.Category,
                request.PurchaseDate,
                request.PurchasePrice,
                request.UsefulLifeMonths
            );

            await _context.Assets.AddAsync(asset, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return asset.Id;
        }
    }
}
