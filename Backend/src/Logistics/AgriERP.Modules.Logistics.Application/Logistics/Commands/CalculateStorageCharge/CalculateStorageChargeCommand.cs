using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Logistics.Application.Common;
using AgriERP.Modules.Logistics.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Application.Logistics.Commands.CalculateStorageCharge
{
    public record CalculateStorageChargeCommand(
        Guid WeighbridgeTicketId,
        int DaysStored,
        DateTime ChargeDate
    ) : IRequest<Guid>;

    public class CalculateStorageChargeCommandHandler : IRequestHandler<CalculateStorageChargeCommand, Guid>
    {
        private readonly ILogisticsDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public CalculateStorageChargeCommandHandler(
            ILogisticsDbContext context, 
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(CalculateStorageChargeCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Fetch Weighbridge Ticket
            var ticket = await _context.WeighbridgeTickets
                .FirstOrDefaultAsync(t => t.Id == request.WeighbridgeTicketId && t.TenantId == tenantId, cancellationToken);
            if (ticket == null)
            {
                throw new InvalidOperationException($"Weighbridge ticket with ID '{request.WeighbridgeTicketId}' does not exist.");
            }

            // 2. Fetch Elevator to check rental rates
            var elevator = await _context.Elevators
                .FirstOrDefaultAsync(e => e.Id == ticket.ElevatorId && e.TenantId == tenantId, cancellationToken);
            if (elevator == null)
            {
                throw new InvalidOperationException("Elevator associated with ticket does not exist.");
            }

            // 3. Create Storage Charge
            var charge = new StorageCharge(
                tenantId,
                request.WeighbridgeTicketId,
                request.DaysStored,
                elevator.RentalRatePerTonPerDay,
                ticket.FinalBillableWeightTons,
                request.ChargeDate
            );

            // Mark billed
            charge.MarkBilled();
            ticket.MarkBilled();

            await _context.StorageCharges.AddAsync(charge, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // 4. Publish GL integration event for accounts receivable postings
            if (charge.TotalCharge > 0)
            {
                var billedEvent = new StorageChargeBilledIntegrationEvent(
                    tenantId,
                    charge.TotalCharge,
                    ticket.TicketNumber,
                    request.ChargeDate
                );
                await _publisher.Publish(billedEvent, cancellationToken);
            }

            return charge.Id;
        }
    }
}
