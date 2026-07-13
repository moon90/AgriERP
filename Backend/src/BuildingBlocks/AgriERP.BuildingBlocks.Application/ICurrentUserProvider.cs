using System;

namespace AgriERP.BuildingBlocks.Application
{
    public interface ICurrentUserProvider
    {
        string? UserId { get; }
    }
}
