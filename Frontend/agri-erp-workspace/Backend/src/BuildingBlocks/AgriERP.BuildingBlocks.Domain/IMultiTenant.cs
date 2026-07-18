using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Domain
{
    public interface IMultiTenant
    {
        Guid TenantId { get; set; }
    }
}
