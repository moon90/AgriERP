using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Application
{
    public interface ITenantProvider
    {
        Guid TenantId { get; }
        bool IsTenantAvailable { get; }
    }
}
