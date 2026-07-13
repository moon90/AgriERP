using AgriERP.Modules.Auth.Application.Common.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace AgriERP.Modules.Auth.Presentation.Authorization
{
    public class PermissionFilter : IAsyncAuthorizationFilter
    {
        private readonly string _requiredPermission;
        private readonly IAuthDbContext _context;
        private readonly IDistributedCache _cache;

        public PermissionFilter(string requiredPermission, IAuthDbContext context, IDistributedCache cache)
        {
            _requiredPermission = requiredPermission;
            _context = context;
            _cache = cache;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            var user = context.HttpContext.User;

            // 1. Check if user is authenticated
            if (!user.Identity?.IsAuthenticated ?? true)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // 2. Get User ID and Tenant ID from claims
            var userIdClaim = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var tenantIdClaim = user.FindFirst("TenantId")?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId) || !Guid.TryParse(tenantIdClaim, out var tenantId))
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // 3. Check Cache
            string cacheKey = $"auth:tenant:{tenantId}:user:{userId}:permissions";
            var cachedPermissionsString = await _cache.GetStringAsync(cacheKey);
            List<string>? permissions = null;

            if (!string.IsNullOrEmpty(cachedPermissionsString))
            {
                permissions = JsonSerializer.Deserialize<List<string>>(cachedPermissionsString);
            }

            if (permissions == null)
            {
                // Cache Miss: Query Database
                permissions = await _context.UserRoles
                    .Where(ur => ur.UserId == userId)
                    .Join(_context.RolePermissions,
                        ur => ur.RoleId,
                        rp => rp.RoleId,
                        (ur, rp) => rp.PermissionCode)
                    .Distinct()
                    .ToListAsync();

                // Store in Cache with sliding expiration of 15 minutes
                var cacheOptions = new DistributedCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(15)
                };

                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(permissions), cacheOptions);
            }

            // 4. Verify Permission
            if (permissions == null || !permissions.Contains(_requiredPermission))
            {
                context.Result = new ForbidResult(); // 403 Forbidden
            }
        }
    }
}
