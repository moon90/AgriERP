using AgriERP.Modules.Weather.Domain;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Common
{
    public interface IWeatherDbContext
    {
        DbSet<WeatherStation> WeatherStations { get; }
        DbSet<WeatherReading> WeatherReadings { get; }
        DbSet<FrostAlertConfig> FrostAlertConfigs { get; }
        DbSet<WeatherSubscriptionBilling> WeatherSubscriptionBillings { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
    }
}
