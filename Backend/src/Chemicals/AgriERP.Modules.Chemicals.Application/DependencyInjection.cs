using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AgriERP.Modules.Chemicals.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddChemicalsApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            return services;
        }
    }
}
