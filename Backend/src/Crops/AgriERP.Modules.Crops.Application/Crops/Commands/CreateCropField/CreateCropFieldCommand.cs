using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropField
{
    public record CreateCropFieldCommand(
        string Name,
        decimal AreaAcres,
        string SoilType
    ) : IRequest<Guid>;

    public class CreateCropFieldCommandHandler : IRequestHandler<CreateCropFieldCommand, Guid>
    {
        private readonly ICropsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateCropFieldCommandHandler(ICropsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateCropFieldCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var field = new CropField(
                tenantId,
                request.Name,
                request.AreaAcres,
                request.SoilType
            );

            await _context.CropFields.AddAsync(field, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return field.Id;
        }
    }
}
