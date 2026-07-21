using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Trading.Application.Common;
using AgriERP.Modules.Trading.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Trading.Application.Trading.Commands.CreateSalesContract
{
    public record CreateSalesContractCommand(
        string ContractNumber,
        string CustomerClientId,
        string CropType,
        decimal ContractPricePerTon,
        decimal QuantityTons
    ) : IRequest<Guid>;

    public class CreateSalesContractCommandHandler : IRequestHandler<CreateSalesContractCommand, Guid>
    {
        private readonly ITradingDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateSalesContractCommandHandler(ITradingDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateSalesContractCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var contract = new SalesContract(
                tenantId,
                request.ContractNumber,
                request.CustomerClientId,
                request.CropType,
                request.ContractPricePerTon,
                request.QuantityTons
            );

            await _context.SalesContracts.AddAsync(contract, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return contract.Id;
        }
    }
}
