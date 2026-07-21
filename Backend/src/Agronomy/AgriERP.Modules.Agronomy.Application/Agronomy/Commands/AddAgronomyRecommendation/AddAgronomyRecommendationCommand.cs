using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Agronomy.Application.Common;
using AgriERP.Modules.Agronomy.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Agronomy.Application.Agronomy.Commands.AddAgronomyRecommendation
{
    public record AddAgronomyRecommendationCommand(
        Guid SoilSampleId,
        string RecommendedFertilizerType,
        decimal TargetApplicationRate,
        DateTime RecommendationDate,
        string AgronomistName,
        string Notes
    ) : IRequest<Guid>;

    public class AddAgronomyRecommendationCommandHandler : IRequestHandler<AddAgronomyRecommendationCommand, Guid>
    {
        private readonly IAgronomyDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public AddAgronomyRecommendationCommandHandler(IAgronomyDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(AddAgronomyRecommendationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Verify sample exists
            var sample = await _context.SoilSamples
                .FirstOrDefaultAsync(s => s.Id == request.SoilSampleId && s.TenantId == tenantId, cancellationToken);

            if (sample == null)
            {
                throw new InvalidOperationException($"Soil sample with ID '{request.SoilSampleId}' does not exist.");
            }

            var recommendation = new AgronomyRecommendation(
                tenantId,
                request.SoilSampleId,
                request.RecommendedFertilizerType,
                request.TargetApplicationRate,
                request.RecommendationDate,
                request.AgronomistName,
                request.Notes
            );

            await _context.AgronomyRecommendations.AddAsync(recommendation, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return recommendation.Id;
        }
    }
}
