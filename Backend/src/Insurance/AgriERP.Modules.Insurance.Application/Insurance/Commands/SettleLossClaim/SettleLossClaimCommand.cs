using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Insurance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Application.Insurance.Commands.SettleLossClaim
{
    public record SettleLossClaimCommand(
        Guid LossClaimId,
        decimal PayoutAmount,
        DateTime SettlementDate
    ) : IRequest<bool>;

    public class SettleLossClaimCommandHandler : IRequestHandler<SettleLossClaimCommand, bool>
    {
        private readonly IInsuranceDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public SettleLossClaimCommandHandler(
            IInsuranceDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<bool> Handle(SettleLossClaimCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var claim = await _context.LossClaims
                .FirstOrDefaultAsync(c => c.Id == request.LossClaimId && c.TenantId == tenantId, cancellationToken);

            if (claim == null)
            {
                throw new InvalidOperationException($"Loss claim with ID '{request.LossClaimId}' does not exist.");
            }

            // Settle claim
            claim.Settle(request.PayoutAmount);
            await _context.SaveChangesAsync(cancellationToken);

            // Fetch policy for description info
            var policy = await _context.InsurancePolicies
                .FirstOrDefaultAsync(p => p.Id == claim.InsurancePolicyId, cancellationToken);

            // Broadcast integration event for GL Cash / Indemnity Revenue posting
            if (request.PayoutAmount > 0)
            {
                var settledEvent = new InsuranceClaimSettledIntegrationEvent(
                    tenantId,
                    request.PayoutAmount,
                    claim.ClaimNumber,
                    policy?.PolicyNumber ?? "UNKNOWN",
                    request.SettlementDate
                );
                await _publisher.Publish(settledEvent, cancellationToken);
            }

            return true;
        }
    }
}
