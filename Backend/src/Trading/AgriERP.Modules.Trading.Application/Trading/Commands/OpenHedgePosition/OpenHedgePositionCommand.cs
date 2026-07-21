using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Trading.Application.Common;
using AgriERP.Modules.Trading.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Trading.Commands.OpenHedgePosition
{
    public record OpenHedgePositionCommand(
        string Symbol,
        string Type,
        int QuantityContracts,
        decimal EntryPricePerTon
    ) : IRequest<Guid>;

    public class OpenHedgePositionCommandHandler : IRequestHandler<OpenHedgePositionCommand, Guid>
    {
        private readonly ITradingDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public OpenHedgePositionCommandHandler(ITradingDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(OpenHedgePositionCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var position = new HedgingPosition(
                tenantId,
                request.Symbol,
                request.Type,
                request.QuantityContracts,
                request.EntryPricePerTon
            );

            await _context.HedgingPositions.AddAsync(position, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return position.Id;
        }
    }
}
