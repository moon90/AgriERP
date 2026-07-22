using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Insurance.Application.Common;
using AgriERP.Modules.Insurance.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Application.Insurance.Commands.CreateInsurancePolicy
{
    public record CreateInsurancePolicyCommand(
        string PolicyNumber,
        string ProviderName,
        decimal CoverageAmount,
        decimal PremiumAmount,
        DateTime StartDate,
        DateTime EndDate,
        Guid FieldId
    ) : IRequest<Guid>;

    public class CreateInsurancePolicyCommandHandler : IRequestHandler<CreateInsurancePolicyCommand, Guid>
    {
        private readonly IInsuranceDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public CreateInsurancePolicyCommandHandler(
            IInsuranceDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(CreateInsurancePolicyCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Create Policy
            var policy = new InsurancePolicy(
                tenantId,
                request.PolicyNumber,
                request.ProviderName,
                request.CoverageAmount,
                request.PremiumAmount,
                request.StartDate,
                request.EndDate,
                request.FieldId
            );
            await _context.InsurancePolicies.AddAsync(policy, cancellationToken);

            // 2. Create Premium Billing Statement
            var billing = new InsurancePremiumBilling(
                tenantId,
                policy.Id,
                request.PremiumAmount,
                request.StartDate
            );
            await _context.InsurancePremiumBillings.AddAsync(billing, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Trigger integration event for GL premium expense posting
            if (policy.PremiumAmount > 0)
            {
                var premiumEvent = new InsurancePremiumBilledIntegrationEvent(
                    tenantId,
                    policy.PremiumAmount,
                    request.ProviderName,
                    request.PolicyNumber,
                    request.StartDate
                );
                await _publisher.Publish(premiumEvent, cancellationToken);
            }

            return policy.Id;
        }
    }
}
