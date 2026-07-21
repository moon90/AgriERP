using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Trading.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Trading.Commands.CloseHedgePosition
{
    public record CloseHedgePositionCommand(
        Guid HedgingPositionId,
        decimal ExitPricePerTon,
        DateTime CloseDate
    ) : IRequest<bool>;

    public class CloseHedgePositionCommandHandler : IRequestHandler<CloseHedgePositionCommand, bool>
    {
        private readonly ITradingDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public CloseHedgePositionCommandHandler(
            ITradingDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<bool> Handle(CloseHedgePositionCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var position = await _context.HedgingPositions
                .FirstOrDefaultAsync(h => h.Id == request.HedgingPositionId && h.TenantId == tenantId, cancellationToken);

            if (position == null)
            {
                throw new InvalidOperationException($"Hedging position with ID '{request.HedgingPositionId}' does not exist.");
            }

            // Close trade and calculate PnL
            position.Close(request.ExitPricePerTon);
            await _context.SaveChangesAsync(cancellationToken);

            // Publish GL integration event for A/R or cash ledger postings
            var closeEvent = new HedgeClosedIntegrationEvent(
                tenantId,
                position.RealizedPnl,
                position.Symbol,
                request.CloseDate
            );
            await _publisher.Publish(closeEvent, cancellationToken);

            return true;
        }
    }
}
