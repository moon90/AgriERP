using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Logistics.Application.Common;
using AgriERP.Modules.Logistics.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Logistics.Application.Logistics.Commands.CreateElevator
{
    public record CreateElevatorCommand(
        string Name,
        decimal CapacityTons,
        decimal RentalRatePerTonPerDay
    ) : IRequest<Guid>;

    public class CreateElevatorCommandHandler : IRequestHandler<CreateElevatorCommand, Guid>
    {
        private readonly ILogisticsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateElevatorCommandHandler(ILogisticsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateElevatorCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var elevator = new Elevator(
                tenantId,
                request.Name,
                request.CapacityTons,
                request.RentalRatePerTonPerDay
            );

            await _context.Elevators.AddAsync(elevator, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return elevator.Id;
        }
    }
}
