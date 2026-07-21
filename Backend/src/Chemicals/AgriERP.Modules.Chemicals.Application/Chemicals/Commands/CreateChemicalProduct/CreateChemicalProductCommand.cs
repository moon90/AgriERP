using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Chemicals.Application.Common;
using AgriERP.Modules.Chemicals.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Chemicals.Application.Chemicals.Commands.CreateChemicalProduct
{
    public record CreateChemicalProductCommand(
        string ProductName,
        string RegistrationNumber,
        int SafetyIntervalHours,
        decimal StockQuantityLiters,
        decimal CostPerLiter
    ) : IRequest<Guid>;

    public class CreateChemicalProductCommandHandler : IRequestHandler<CreateChemicalProductCommand, Guid>
    {
        private readonly IChemicalsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateChemicalProductCommandHandler(IChemicalsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateChemicalProductCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var product = new ChemicalProduct(
                tenantId,
                request.ProductName,
                request.RegistrationNumber,
                request.SafetyIntervalHours,
                request.StockQuantityLiters,
                request.CostPerLiter
            );

            await _context.ChemicalProducts.AddAsync(product, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return product.Id;
        }
    }
}
