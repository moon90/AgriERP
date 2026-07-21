using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Land.Application.Common;
using AgriERP.Modules.Land.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Land.Application.Land.Commands.CreateLandLease
{
    public record CreateLandLeaseCommand(
        string LeaseNumber,
        string LandlordName,
        Guid FieldId,
        string LeaseType,
        decimal CashRentPerAcre,
        decimal AreaAcres,
        decimal LandlordSharePercentage,
        DateTime ContractStartDate,
        DateTime ContractEndDate
    ) : IRequest<Guid>;

    public class CreateLandLeaseCommandHandler : IRequestHandler<CreateLandLeaseCommand, Guid>
    {
        private readonly ILandDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateLandLeaseCommandHandler(ILandDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateLandLeaseCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var lease = new LandLease(
                tenantId,
                request.LeaseNumber,
                request.LandlordName,
                request.FieldId,
                request.LeaseType,
                request.CashRentPerAcre,
                request.AreaAcres,
                request.LandlordSharePercentage,
                request.ContractStartDate,
                request.ContractEndDate
            );

            await _context.LandLeases.AddAsync(lease, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return lease.Id;
        }
    }
}
