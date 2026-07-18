using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Livestock.Application.Data;
using AgriERP.Modules.Livestock.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Livestock.Application.Health.Commands.LogMedicalTreatment
{
    public class LogMedicalTreatmentCommandHandler : IRequestHandler<LogMedicalTreatmentCommand, Guid>
    {
        private readonly ILivestockDbContext _dbContext;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogMedicalTreatmentCommandHandler(ILivestockDbContext dbContext, ITenantProvider tenantProvider, IPublisher publisher)
        {
            _dbContext = dbContext;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogMedicalTreatmentCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;
            if (tenantId == Guid.Empty)
            {
                throw new UnauthorizedAccessException("Tenant ID is missing.");
            }

            // Verify animal exists
            var animalExists = await _dbContext.Animals.AnyAsync(a => a.Id == request.AnimalId && a.TenantId == tenantId, cancellationToken);
            if (!animalExists)
            {
                throw new ArgumentException("Animal not found.");
            }

            var medicalRecord = new MedicalRecord(
                tenantId,
                request.AnimalId,
                request.Diagnosis,
                request.Notes
            );

            // Record each administered drug on the domain model
            if (request.Drugs != null)
            {
                foreach (var drug in request.Drugs)
                {
                    medicalRecord.AdministerDrug(
                        drug.StockItemId,
                        drug.Quantity,
                        drug.DosageInstruction,
                        drug.WithdrawalPeriodDays
                    );
                }
            }

            _dbContext.MedicalRecords.Add(medicalRecord);
            await _dbContext.SaveChangesAsync(cancellationToken);

            // Publish integration events for inventory deduction in background
            if (request.Drugs != null)
            {
                foreach (var drug in request.Drugs)
                {
                    var integrationEvent = new InventoryConsumedIntegrationEvent(
                        tenantId,
                        drug.StockItemId,
                        drug.Quantity,
                        medicalRecord.Id
                    );

                    await _publisher.Publish(integrationEvent, cancellationToken);
                }
            }

            return medicalRecord.Id;
        }
    }
}
