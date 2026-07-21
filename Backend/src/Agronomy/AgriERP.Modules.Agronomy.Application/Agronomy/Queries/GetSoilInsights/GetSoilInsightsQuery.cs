using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Agronomy.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Agronomy.Application.Agronomy.Queries.GetSoilInsights
{
    public record SoilSampleDto(
        Guid Id,
        Guid FieldId,
        string SampleCode,
        DateTime SampleDate,
        string LabName,
        decimal PhLevel,
        decimal NitrogenPpm,
        decimal PhosphorusPpm,
        decimal PotassiumPpm,
        decimal OrganicMatterPercentage
    );

    public record AgronomyRecommendationDto(
        Guid Id,
        Guid SoilSampleId,
        string SampleCode,
        string RecommendedFertilizerType,
        decimal TargetApplicationRate,
        DateTime RecommendationDate,
        string AgronomistName,
        string Notes
    );

    public record LabTestingBillingDto(
        Guid Id,
        Guid SoilSampleId,
        string SampleCode,
        decimal TestFee,
        DateTime BillingDate
    );

    public record SoilInsightsDto(
        List<SoilSampleDto> Samples,
        List<AgronomyRecommendationDto> Recommendations,
        List<LabTestingBillingDto> Billings,
        decimal TotalLabExpenses
    );

    public record GetSoilInsightsQuery : IRequest<SoilInsightsDto>;

    public class GetSoilInsightsQueryHandler : IRequestHandler<GetSoilInsightsQuery, SoilInsightsDto>
    {
        private readonly IAgronomyDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetSoilInsightsQueryHandler(IAgronomyDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<SoilInsightsDto> Handle(GetSoilInsightsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load samples
            var samples = await _context.SoilSamples
                .AsNoTracking()
                .Where(s => s.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var sampleDtos = samples.Select(s => new SoilSampleDto(
                s.Id,
                s.FieldId,
                s.SampleCode,
                s.SampleDate,
                s.LabName,
                s.PhLevel,
                s.NitrogenPpm,
                s.PhosphorusPpm,
                s.PotassiumPpm,
                s.OrganicMatterPercentage
            )).ToList();

            // Load recommendations
            var recommendations = await _context.AgronomyRecommendations
                .AsNoTracking()
                .Where(r => r.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var recDtos = recommendations.Select(r => {
                var associatedSample = samples.FirstOrDefault(s => s.Id == r.SoilSampleId);
                return new AgronomyRecommendationDto(
                    r.Id,
                    r.SoilSampleId,
                    associatedSample?.SampleCode ?? "Unknown",
                    r.RecommendedFertilizerType,
                    r.TargetApplicationRate,
                    r.RecommendationDate,
                    r.AgronomistName,
                    r.Notes
                );
            }).ToList();

            // Load billings
            var billings = await _context.LabTestingBillings
                .AsNoTracking()
                .Where(b => b.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var billingDtos = billings.Select(b => {
                var associatedSample = samples.FirstOrDefault(s => s.Id == b.SoilSampleId);
                return new LabTestingBillingDto(
                    b.Id,
                    b.SoilSampleId,
                    associatedSample?.SampleCode ?? "Unknown",
                    b.TestFee,
                    b.BillingDate
                );
            }).ToList();

            decimal totalExpenses = billingDtos.Sum(b => b.TestFee);

            return new SoilInsightsDto(
                sampleDtos,
                recDtos,
                billingDtos,
                totalExpenses
            );
        }
    }
}
