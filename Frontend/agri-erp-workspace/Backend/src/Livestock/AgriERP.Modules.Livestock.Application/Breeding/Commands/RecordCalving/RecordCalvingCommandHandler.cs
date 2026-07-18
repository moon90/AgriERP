using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Breeding.Commands.RecordCalving
{
    public class RecordCalvingCommandHandler : IRequestHandler<RecordCalvingCommand>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        public RecordCalvingCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task Handle(RecordCalvingCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            var breedingCycle = await _dbContext.BreedingCycles
                .Include(b => b.BirthRecords)
                .FirstOrDefaultAsync(b => b.Id == request.BreedingCycleId && b.TenantId == tenantId, cancellationToken);

            if (breedingCycle == null)
            {
                throw new ArgumentException("Breeding cycle not found.");
            }

            // Register calving on aggregate
            breedingCycle.RecordCalving(request.CalvingDate);

            // Add each offspring birth record
            if (request.BirthRecords != null)
            {
                foreach (var record in request.BirthRecords)
                {
                    breedingCycle.AddBirthRecord(
                        record.Gender,
                        record.BirthWeight,
                        record.TagNumber,
                        record.Status
                    );
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
