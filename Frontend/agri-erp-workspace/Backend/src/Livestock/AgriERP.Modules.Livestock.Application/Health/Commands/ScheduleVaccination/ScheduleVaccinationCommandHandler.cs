using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Health.Commands.ScheduleVaccination
{
    public class ScheduleVaccinationCommandHandler : IRequestHandler<ScheduleVaccinationCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;

        public ScheduleVaccinationCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(ScheduleVaccinationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            var animalExists = await _dbContext.Animals.AnyAsync(a => a.Id == request.AnimalId && a.TenantId == tenantId, cancellationToken);
            if (!animalExists)
            {
                throw new ArgumentException("Animal not found.");
            }

            var schedule = new VaccinationSchedule(
                tenantId,
                request.AnimalId,
                request.VaccineItemId,
                request.ScheduledDate
            );

            _dbContext.VaccinationSchedules.Add(schedule);
            await _dbContext.SaveChangesAsync(cancellationToken);

            return schedule.Id;
        }
    }
}
