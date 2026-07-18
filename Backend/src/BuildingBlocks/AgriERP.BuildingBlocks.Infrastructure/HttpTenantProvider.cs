using AgriERP.BuildingBlocks.Application;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.BuildingBlocks.Infrastructure
{
    public class HttpTenantProvider : ITenantProvider
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private const string TenantHeaderName = "X-Tenant-Id";
        private const string TenantClaimName = "tenant_id"; // Keycloak token claim

        public HttpTenantProvider(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid TenantId
        {
            get
            {
                var httpContext = _httpContextAccessor.HttpContext;
                if (httpContext == null) return Guid.Empty;

                // 1. Try to get from JWT Claims first (Highly Secure)
                var user = httpContext.User;
                var tenantClaim = user?.FindFirst(TenantClaimName)?.Value;
                if (!string.IsNullOrEmpty(tenantClaim) && Guid.TryParse(tenantClaim, out var tenantGuidFromClaim))
                {
                    return tenantGuidFromClaim;
                }

                // 2. Fallback to HTTP Header (For public/login API requests)
                if (httpContext.Request.Headers.TryGetValue(TenantHeaderName, out var headerValue))
                {
                    if (Guid.TryParse(headerValue.ToString(), out var tenantGuidFromHeader))
                    {
                        return tenantGuidFromHeader;
                    }
                }

                return Guid.Empty;
            }
        }

        public bool IsTenantAvailable => TenantId != Guid.Empty;
    }
}
