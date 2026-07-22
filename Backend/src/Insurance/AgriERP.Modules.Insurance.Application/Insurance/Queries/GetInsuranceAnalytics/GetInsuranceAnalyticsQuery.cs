using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Insurance.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Insurance.Application.Insurance.Queries.GetInsuranceAnalytics
{
    public record InsurancePolicyDto(
        Guid Id,
        string PolicyNumber,
        string ProviderName,
        decimal CoverageAmount,
        decimal PremiumAmount,
        DateTime StartDate,
        DateTime EndDate,
        Guid FieldId
    );

    public record LossClaimDto(
        Guid Id,
        Guid InsurancePolicyId,
        string PolicyNumber,
        string ClaimNumber,
        DateTime IncidentDate,
        decimal ClaimAmount,
        decimal AdjustedAmount,
        string Status,
        string Description
    );

    public record InsurancePremiumBillingDto(
        Guid Id,
        Guid InsurancePolicyId,
        string PolicyNumber,
        decimal PremiumFee,
        DateTime BillingDate
    );

    public record InsuranceAnalyticsDto(
        List<InsurancePolicyDto> Policies,
        List<LossClaimDto> Claims,
        List<InsurancePremiumBillingDto> Billings,
        decimal TotalCoverageAmount,
        decimal TotalPremiumsPaid,
        decimal TotalClaimsRecovered
    );

    public record GetInsuranceAnalyticsQuery : IRequest<InsuranceAnalyticsDto>;

    public class GetInsuranceAnalyticsQueryHandler : IRequestHandler<GetInsuranceAnalyticsQuery, InsuranceAnalyticsDto>
    {
        private readonly IInsuranceDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetInsuranceAnalyticsQueryHandler(IInsuranceDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<InsuranceAnalyticsDto> Handle(GetInsuranceAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load Policies
            var policies = await _context.InsurancePolicies
                .AsNoTracking()
                .Where(p => p.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var policyDtos = policies.Select(p => new InsurancePolicyDto(
                p.Id,
                p.PolicyNumber,
                p.ProviderName,
                p.CoverageAmount,
                p.PremiumAmount,
                p.StartDate,
                p.EndDate,
                p.FieldId
            )).ToList();

            // Load Loss Claims
            var claims = await _context.LossClaims
                .AsNoTracking()
                .Where(c => c.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var claimDtos = claims.Select(c => {
                var policy = policies.FirstOrDefault(p => p.Id == c.InsurancePolicyId);
                return new LossClaimDto(
                    c.Id,
                    c.InsurancePolicyId,
                    policy?.PolicyNumber ?? "Unknown Policy",
                    c.ClaimNumber,
                    c.IncidentDate,
                    c.ClaimAmount,
                    c.AdjustedAmount,
                    c.Status,
                    c.Description
                );
            }).ToList();

            // Load Premium Billings
            var billings = await _context.InsurancePremiumBillings
                .AsNoTracking()
                .Where(b => b.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var billingDtos = billings.Select(b => {
                var policy = policies.FirstOrDefault(p => p.Id == b.InsurancePolicyId);
                return new InsurancePremiumBillingDto(
                    b.Id,
                    b.InsurancePolicyId,
                    policy?.PolicyNumber ?? "Unknown Policy",
                    b.PremiumFee,
                    b.BillingDate
                );
            }).ToList();

            decimal totalCoverage = policyDtos.Sum(p => p.CoverageAmount);
            decimal totalPremiums = billingDtos.Sum(b => b.PremiumFee);
            decimal totalRecovered = claimDtos.Where(c => c.Status == "Settled").Sum(c => c.AdjustedAmount);

            return new InsuranceAnalyticsDto(
                policyDtos,
                claimDtos,
                billingDtos,
                totalCoverage,
                totalPremiums,
                totalRecovered
            );
        }
    }
}
