using AgriERP.BuildingBlocks.Application;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace AgriERP.BuildingBlocks.Infrastructure
{
    public class HttpCurrentUserProvider : ICurrentUserProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpCurrentUserProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string? UserId
        {
            get
            {
                var user = _httpContextAccessor.HttpContext?.User;
                
                // Read ClaimTypes.NameIdentifier or fallback to sub claim
                var userId = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                             ?? user?.FindFirst("sub")?.Value;

                return userId;
            }
        }
    }
}
