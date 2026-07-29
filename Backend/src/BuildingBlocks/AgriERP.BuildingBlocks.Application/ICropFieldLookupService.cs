using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.BuildingBlocks.Application
{
    public record CropFieldInfoDto(Guid Id, string Name, decimal AreaAcres);

    public interface ICropFieldLookupService
    {
        Task<List<CropFieldInfoDto>> GetFieldsForTenantAsync(Guid tenantId, CancellationToken cancellationToken = default);
    }
}
