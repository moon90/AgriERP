using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AgriERP.Modules.Irrigation.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddIrrigationApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            return services;
        }
    }
}
