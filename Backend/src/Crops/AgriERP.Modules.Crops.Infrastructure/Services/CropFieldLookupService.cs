using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Crops.Application.Common;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Crops.Infrastructure.Services
{
    public class CropFieldLookupService : ICropFieldLookupService
    {
        private readonly ICropsDbContext _cropsDb;

        public CropFieldLookupService(ICropsDbContext cropsDb)
        {
            _cropsDb = cropsDb;
        }

        public async Task<List<CropFieldInfoDto>> GetFieldsForTenantAsync(Guid tenantId, CancellationToken cancellationToken = default)
        {
            return await _cropsDb.CropFields
                .AsNoTracking()
                .Where(f => f.TenantId == tenantId)
                .Select(f => new CropFieldInfoDto(f.Id, f.Name, f.AreaAcres))
                .ToListAsync(cancellationToken);
        }
    }
}
