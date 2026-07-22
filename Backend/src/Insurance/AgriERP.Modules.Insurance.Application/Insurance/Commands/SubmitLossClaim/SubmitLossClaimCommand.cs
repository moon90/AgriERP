using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Insurance.Application.Common;
using AgriERP.Modules.Insurance.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Application.Insurance.Commands.SubmitLossClaim
{
    public record SubmitLossClaimCommand(
        Guid InsurancePolicyId,
        string ClaimNumber,
        DateTime IncidentDate,
        decimal ClaimAmount,
        string Description
    ) : IRequest<Guid>;

    public class SubmitLossClaimCommandHandler : IRequestHandler<SubmitLossClaimCommand, Guid>
    {
        private readonly IInsuranceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public SubmitLossClaimCommandHandler(IInsuranceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(SubmitLossClaimCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Verify policy exists
            var policy = await _context.InsurancePolicies
                .FirstOrDefaultAsync(p => p.Id == request.InsurancePolicyId && p.TenantId == tenantId, cancellationToken);

            if (policy == null)
            {
                throw new InvalidOperationException($"Insurance policy with ID '{request.InsurancePolicyId}' does not exist.");
            }

            var claim = new LossClaim(
                tenantId,
                request.InsurancePolicyId,
                request.ClaimNumber,
                request.IncidentDate,
                request.ClaimAmount,
                request.Description
            );

            await _context.LossClaims.AddAsync(claim, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return claim.Id;
        }
    }
}
