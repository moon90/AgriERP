using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Application.Events;
using AgriERP.Modules.Agronomy.Application.Common;
using AgriERP.Modules.Agronomy.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Agronomy.Application.Agronomy.Commands.RecordSoilSample
{
    public record RecordSoilSampleCommand(
        Guid FieldId,
        string SampleCode,
        DateTime SampleDate,
        string LabName,
        decimal PhLevel,
        decimal NitrogenPpm,
        decimal PhosphorusPpm,
        decimal PotassiumPpm,
        decimal OrganicMatterPercentage,
        decimal TestFee
    ) : IRequest<Guid>;

    public class RecordSoilSampleCommandHandler : IRequestHandler<RecordSoilSampleCommand, Guid>
    {
        private readonly IAgronomyDbContext _context;
        private readonly ITenantProvider _tenantProvider;
        private readonly IPublisher _publisher;

        public RecordSoilSampleCommandHandler(
            IAgronomyDbContext context,
            ITenantProvider tenantProvider,
            IPublisher publisher)
        {
            _context = context;
            _tenantProvider = tenantProvider;
            _publisher = publisher;
        }

        public async Task<Guid> Handle(RecordSoilSampleCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // 1. Add Soil Sample result
            var sample = new SoilSample(
                tenantId,
                request.FieldId,
                request.SampleCode,
                request.SampleDate,
                request.LabName,
                request.PhLevel,
                request.NitrogenPpm,
                request.PhosphorusPpm,
                request.PotassiumPpm,
                request.OrganicMatterPercentage
            );
            await _context.SoilSamples.AddAsync(sample, cancellationToken);

            // 2. Add Laboratory Diagnostic Invoice
            var billing = new LabTestingBilling(
                tenantId,
                sample.Id,
                request.TestFee,
                request.SampleDate
            );
            await _context.LabTestingBillings.AddAsync(billing, cancellationToken);

            await _context.SaveChangesAsync(cancellationToken);

            // 3. Publish integration event for GL testing expense posting
            if (billing.TestFee > 0)
            {
                var billedEvent = new SoilTestBilledIntegrationEvent(
                    tenantId,
                    billing.TestFee,
                    request.LabName,
                    request.SampleCode,
                    request.SampleDate
                );
                await _publisher.Publish(billedEvent, cancellationToken);
            }

            return sample.Id;
        }
    }
}
