using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Weather.Commands.ProcessWeatherSubscriptionBill
{
    public record ProcessWeatherSubscriptionBillCommand(
        decimal SubscriptionFee,
        DateTime BillingDate
    ) : IRequest<Guid>;

    public class ProcessWeatherSubscriptionBillCommandHandler : IRequestHandler<ProcessWeatherSubscriptionBillCommand, Guid>
    {
        private readonly IWeatherDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public ProcessWeatherSubscriptionBillCommandHandler(
            IWeatherDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(ProcessWeatherSubscriptionBillCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var billing = new WeatherSubscriptionBilling(
                tenantId,
                request.SubscriptionFee,
                request.BillingDate
            );

            await _context.WeatherSubscriptionBillings.AddAsync(billing, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            // Publish integration event for GL postings
            if (billing.SubscriptionFee > 0)
            {
                var billedEvent = new WeatherSubscriptionBilledIntegrationEvent(
                    tenantId,
                    billing.SubscriptionFee,
                    request.BillingDate
                );
                await _publisher.Publish(billedEvent, cancellationToken);
            }

            return billing.Id;
        }
    }
}
