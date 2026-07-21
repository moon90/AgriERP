using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Crops.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Application.Crops.Queries.GetCropCycles
{
    public record CropCycleDto(
        Guid Id,
        string FieldName,
        string CropType,
        string CropVariety,
        string Status,
        DateTime PlantingDate,
        DateTime? HarvestDate,
        decimal ExpectedYieldTons,
        decimal? ActualYieldTons,
        decimal AccumulatedWipCost,
        decimal CostPerExpectedTon,
        decimal? CostPerActualTon
    );

    public record GetCropCyclesQuery : IRequest<List<CropCycleDto>>;

    public class GetCropCyclesQueryHandler : IRequestHandler<GetCropCyclesQuery, List<CropCycleDto>>
    {
        private readonly ICropsDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetCropCyclesQueryHandler(ICropsDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<List<CropCycleDto>> Handle(GetCropCyclesQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var cycles = await _context.CropCycles
                .AsNoTracking()
                .Where(c => c.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var fields = await _context.CropFields
                .AsNoTracking()
                .Where(f => f.TenantId == tenantId)
                .ToDictionaryAsync(f => f.Id, f => f.Name, cancellationToken);

            var list = new List<CropCycleDto>();

            foreach (var c in cycles)
            {
                fields.TryGetValue(c.FieldId, out var fieldName);
                fieldName ??= "Unknown Field";

                decimal costPerExpected = c.ExpectedYieldTons > 0 ? c.AccumulatedWipCost / c.ExpectedYieldTons : 0;
                decimal? costPerActual = c.ActualYieldTons.HasValue && c.ActualYieldTons.Value > 0 
                    ? c.AccumulatedWipCost / c.ActualYieldTons.Value 
                    : null;

                list.Add(new CropCycleDto(
                    c.Id,
                    fieldName,
                    c.CropType,
                    c.CropVariety,
                    c.Status,
                    c.PlantingDate,
                    c.HarvestDate,
                    c.ExpectedYieldTons,
                    c.ActualYieldTons,
                    c.AccumulatedWipCost,
                    costPerExpected,
                    costPerActual
                ));
            }

            return list;
        }
    }
}
