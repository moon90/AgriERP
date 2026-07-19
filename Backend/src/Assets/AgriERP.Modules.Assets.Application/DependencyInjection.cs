using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AgriERP.Modules.Assets.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAssetsApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            return services;
        }
    }
}
