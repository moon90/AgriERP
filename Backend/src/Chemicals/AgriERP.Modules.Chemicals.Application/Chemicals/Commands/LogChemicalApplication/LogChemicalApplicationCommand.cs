using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Chemicals.Application.Common;
using AgriERP.Modules.Chemicals.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Chemicals.Application.Chemicals.Commands.LogChemicalApplication
{
    public record LogChemicalApplicationCommand(
        Guid ChemicalProductId,
        Guid FieldId,
        decimal QuantityAppliedLiters,
        decimal AreaTreatedAcres,
        DateTime ApplicationDate,
        string Notes
    ) : IRequest<Guid>;

    public class LogChemicalApplicationCommandHandler : IRequestHandler<LogChemicalApplicationCommand, Guid>
    {
        private readonly IChemicalsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public LogChemicalApplicationCommandHandler(
            IChemicalsDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(LogChemicalApplicationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var product = await _context.ChemicalProducts
                .FirstOrDefaultAsync(p => p.Id == request.ChemicalProductId && p.TenantId == tenantId, cancellationToken);

            if (product == null)
            {
                throw new InvalidOperationException($"Chemical product with ID '{request.ChemicalProductId}' does not exist.");
            }

            // 1. Deduct stock quantity
            product.DeductStock(request.QuantityAppliedLiters);

            // 2. Create Application Log
            var log = new ApplicationLog(
                tenantId,
                request.ChemicalProductId,
                request.FieldId,
                request.QuantityAppliedLiters,
                request.AreaTreatedAcres,
                product.SafetyIntervalHours,
                request.ApplicationDate,
                request.Notes
            );

            await _context.ApplicationLogs.AddAsync(log, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // 3. Post financial GL transaction
            decimal appliedCost = request.QuantityAppliedLiters * product.CostPerLiter;
            if (appliedCost > 0)
            {
                var appliedEvent = new ChemicalAppliedIntegrationEvent(
                    tenantId,
                    appliedCost,
                    product.ProductName,
                    product.RegistrationNumber,
                    request.ApplicationDate
                );
                await _publisher.Publish(appliedEvent, cancellationToken);
            }

            return log.Id;
        }
    }
}
