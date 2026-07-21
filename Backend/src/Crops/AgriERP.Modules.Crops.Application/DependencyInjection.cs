using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AgriERP.Modules.Crops.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddCropsApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            return services;
        }
    }
}
