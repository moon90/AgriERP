using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Logistics.Application.Common;
using AgriERP.Modules.Logistics.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Application.Logistics.Commands.CreateWeighbridgeTicket
{
    public record CreateWeighbridgeTicketCommand(
        string TicketNumber,
        Guid ElevatorId,
        string VehicleNumber,
        decimal GrossWeightTons,
        decimal TareWeightTons,
        decimal MoisturePercentage,
        decimal ImpurityPercentage,
        string? ContractClientId,
        DateTime TicketDate
    ) : IRequest<Guid>;

    public class CreateWeighbridgeTicketCommandHandler : IRequestHandler<CreateWeighbridgeTicketCommand, Guid>
    {
        private readonly ILogisticsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateWeighbridgeTicketCommandHandler(ILogisticsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateWeighbridgeTicketCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Fetch Elevator and verify capacity
            var elevator = await _context.Elevators
                .FirstOrDefaultAsync(e => e.Id == request.ElevatorId && e.TenantId == tenantId, cancellationToken);
            
            if (elevator == null)
            {
                throw new InvalidOperationException($"Elevator with ID '{request.ElevatorId}' does not exist.");
            }

            decimal netWeight = request.GrossWeightTons - request.TareWeightTons;

            // Increment occupancy
            elevator.Store(netWeight);

            // 2. Create and approve ticket
            var ticket = new WeighbridgeTicket(
                tenantId,
                request.TicketNumber,
                request.ElevatorId,
                request.VehicleNumber,
                request.GrossWeightTons,
                request.TareWeightTons,
                request.MoisturePercentage,
                request.ImpurityPercentage,
                request.ContractClientId,
                request.TicketDate
            );

            ticket.Approve(); // Transition status Draft -> Approved

            await _context.WeighbridgeTickets.AddAsync(ticket, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return ticket.Id;
        }
    }
}
