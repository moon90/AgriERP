using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Crops.Application.Common;
using AgriERP.Modules.Crops.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Crops.Commands.CreateCropCycle
{
    public record CreateCropCycleCommand(
        Guid FieldId,
        string CropType,
        string CropVariety,
        DateTime PlantingDate
    ) : IRequest<Guid>;

    public class CreateCropCycleCommandHandler : IRequestHandler<CreateCropCycleCommand, Guid>
    {
        private readonly ICropsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public CreateCropCycleCommandHandler(ICropsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(CreateCropCycleCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Load the crop field to evaluate field area and soil attributes
            var field = await _context.CropFields
                .FirstOrDefaultAsync(f => f.Id == request.FieldId && f.TenantId == tenantId, cancellationToken);
            
            if (field == null)
            {
                throw new InvalidOperationException($"Field with ID '{request.FieldId}' does not exist.");
            }

            var cycle = new CropCycle(
                tenantId,
                request.FieldId,
                request.CropType,
                request.CropVariety,
                request.PlantingDate,
                field.AreaAcres,
                field.SoilType
            );

            await _context.CropCycles.AddAsync(cycle, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return cycle.Id;
        }
    }
}
