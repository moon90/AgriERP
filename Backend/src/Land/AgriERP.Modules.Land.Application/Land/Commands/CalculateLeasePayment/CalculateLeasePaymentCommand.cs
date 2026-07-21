using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Land.Application.Common;
using AgriERP.Modules.Land.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Land.Application.Land.Commands.CalculateLeasePayment
{
    public record CalculateLeasePaymentCommand(
        Guid LandLeaseId,
        decimal? ActualYieldTons,
        decimal? CropPricePerTon,
        DateTime PaymentDate
    ) : IRequest<Guid>;

    public class CalculateLeasePaymentCommandHandler : IRequestHandler<CalculateLeasePaymentCommand, Guid>
    {
        private readonly ILandDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public CalculateLeasePaymentCommandHandler(
            ILandDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(CalculateLeasePaymentCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var lease = await _context.LandLeases
                .FirstOrDefaultAsync(l => l.Id == request.LandLeaseId && l.TenantId == tenantId, cancellationToken);

            if (lease == null)
            {
                throw new InvalidOperationException($"Land lease contract with ID '{request.LandLeaseId}' does not exist.");
            }

            decimal amount = 0;
            string details = "";

            if (lease.LeaseType == "CashRent")
            {
                amount = lease.AreaAcres * lease.CashRentPerAcre;
                details = $"Cash Rent: {lease.AreaAcres} Acres @ {lease.CashRentPerAcre:C}/Acre";
            }
            else // Sharecrop
            {
                decimal yield = request.ActualYieldTons ?? 0m;
                decimal price = request.CropPricePerTon ?? 0m;
                
                amount = yield * lease.LandlordSharePercentage * price;
                details = $"Sharecrop: {yield} Tons @ {price:C}/Ton (Share: {lease.LandlordSharePercentage * 100}%)";
            }

            var payment = new LeasePayment(
                tenantId,
                request.LandLeaseId,
                lease.LeaseType == "CashRent" ? "Rent" : "SharecropYieldValue",
                amount,
                details,
                request.PaymentDate
            );

            await _context.LeasePayments.AddAsync(payment, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Publish GL integration event for accounts payable expense postings
            if (amount > 0)
            {
                var paymentEvent = new LeasePaymentCalculatedIntegrationEvent(
                    tenantId,
                    amount,
                    lease.LeaseNumber,
                    payment.PaymentType,
                    request.PaymentDate
                );
                await _publisher.Publish(paymentEvent, cancellationToken);
            }

            return payment.Id;
        }
    }
}
