using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Irrigation.Application.Common;
using AgriERP.Modules.Irrigation.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Irrigation.Application.Irrigation.Commands.CreateWaterSource
{
    public record CreateWaterSourceCommand(
        string SourceName,
        string PermitNumber,
        decimal MaxAllocatedGallons
    ) : IRequest<Guid>;

    public class CreateWaterSourceCommandHandler : IRequestHandler<CreateWaterSourceCommand, Guid>
    {
        private readonly IIrrigationDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateWaterSourceCommandHandler(IIrrigationDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateWaterSourceCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var source = new WaterSource(
                tenantId,
                request.SourceName,
                request.PermitNumber,
                request.MaxAllocatedGallons
            );

            await _context.WaterSources.AddAsync(source, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return source.Id;
        }
    }
}
