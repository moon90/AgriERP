using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;

namespace AgriERP.Api.Infrastructure
{
    public class IdempotencyMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMemoryCache _cache;

        public IdempotencyMiddleware(RequestDelegate next, IMemoryCache cache)
        {
            _next = next;
            _cache = cache;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (HttpMethods.IsPost(context.Request.Method) || HttpMethods.IsPut(context.Request.Method))
            {
                if (context.Request.Headers.TryGetValue("X-Idempotency-Key", out var key) && !string.IsNullOrEmpty(key))
                {
                    var cacheKey = $"idempotency_{key}";
                    if (_cache.TryGetValue(cacheKey, out var _))
                    {
                        context.Response.StatusCode = StatusCodes.Status409Conflict;
                        await context.Response.WriteAsJsonAsync(new
                        {
                            Title = "Duplicate Request Detected",
                            Status = StatusCodes.Status409Conflict,
                            Detail = "A request with this X-Idempotency-Key has already been processed."
                        });
                        return;
                    }

                    _cache.Set(cacheKey, true, TimeSpan.FromMinutes(10));
                }
            }

            await _next(context);
        }
    }
}
