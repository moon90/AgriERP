using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace AgriERP.Modules.Trading.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddTradingApplication(this IServiceCollection services)
        {
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            return services;
        }
    }
}
