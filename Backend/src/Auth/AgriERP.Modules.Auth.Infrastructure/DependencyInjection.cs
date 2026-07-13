using AgriERP.BuildingBlocks.Application;
using AgriERP.BuildingBlocks.Infrastructure;
using AgriERP.Modules.Auth.Application.Common.Interfaces;
using AgriERP.Modules.Auth.Infrastructure.Authentication;
using AgriERP.Modules.Auth.Infrastructure.Seeding;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace AgriERP.Modules.Auth.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAuthInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IAuthDbSeeder, AuthDbSeeder>();
            services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();

            return services;
        }
    }
}
