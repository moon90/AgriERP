using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordPregnancyCheck
{
    public class RecordPregnancyCheckCommandHandler : IRequestHandler<RecordPregnancyCheckCommand>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        public RecordPregnancyCheckCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(RecordPregnancyCheckCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            var breedingCycle = await _dbContext.BreedingCycles
                .FirstOrDefaultAsync(b => b.Id == request.BreedingCycleId && b.TenantId == tenantId, cancellationToken);

            if (breedingCycle == null)
            {
                throw new ArgumentException("Breeding cycle not found.");
            }

            breedingCycle.RecordPregnancyCheck(request.PregnancyCheckDate, request.Result);
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
