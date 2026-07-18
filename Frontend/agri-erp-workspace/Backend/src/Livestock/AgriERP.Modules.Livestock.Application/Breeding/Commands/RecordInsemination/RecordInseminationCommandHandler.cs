using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordInsemination
{
    public class RecordInseminationCommandHandler : IRequestHandler<RecordInseminationCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        public RecordInseminationCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(RecordInseminationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            // Verify female animal exists and belongs to the tenant
            var femaleExists = await _dbContext.Animals.AnyAsync(a => a.Id == request.FemaleAnimalId && a.TenantId == tenantId, cancellationToken);
            if (!femaleExists)
            {
                throw new ArgumentException("Female animal not found.");
            }

            var breedingCycle = new BreedingCycle(
                tenantId,
                request.FemaleAnimalId,
                request.MaleAnimalId,
                request.InseminationDate,
                request.InseminationType
            );

            _dbContext.BreedingCycles.Add(breedingCycle);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return breedingCycle.Id;
        }
    }
}
