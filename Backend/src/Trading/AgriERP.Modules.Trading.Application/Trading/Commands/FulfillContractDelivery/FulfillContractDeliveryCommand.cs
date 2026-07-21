using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Trading.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Trading.Commands.FulfillContractDelivery
{
    public record FulfillContractDeliveryCommand(
        Guid SalesContractId,
        decimal DeliveredTons,
        DateTime DeliveryDate
    ) : IRequest<bool>;

    public class FulfillContractDeliveryCommandHandler : IRequestHandler<FulfillContractDeliveryCommand, bool>
    {
        private readonly ITradingDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public FulfillContractDeliveryCommandHandler(
            ITradingDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<bool> Handle(FulfillContractDeliveryCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var contract = await _context.SalesContracts
                .FirstOrDefaultAsync(c => c.Id == request.SalesContractId && c.TenantId == tenantId, cancellationToken);

            if (contract == null)
            {
                throw new InvalidOperationException($"Sales contract with ID '{request.SalesContractId}' does not exist.");
            }

            // Perform physical delivery
            contract.Deliver(request.DeliveredTons);
            await _context.SaveChangesAsync(cancellationToken);

            // Compute billing value: tons * agreed contract price
            decimal billingValue = request.DeliveredTons * contract.ContractPricePerTon;

            if (billingValue > 0)
            {
                var deliveredEvent = new ContractDeliveredIntegrationEvent(
                    tenantId,
                    billingValue,
                    contract.ContractNumber,
                    request.DeliveryDate
                );
                await _publisher.Publish(deliveredEvent, cancellationToken);
            }

            return true;
        }
    }
}
