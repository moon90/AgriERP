using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Weather.Application.Common;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Weather.Queries.GetWeatherAnalytics
{
    public record WeatherStationDto(
        Guid Id,
        string StationName,
        decimal LocationLatitude,
        decimal LocationLongitude,
        bool IsActive
    );

    public record WeatherReadingDto(
        Guid Id,
        Guid WeatherStationId,
        string StationName,
        DateTime ReadingTime,
        decimal TemperatureCelsius,
        decimal HumidityPercentage,
        decimal WindSpeedKph,
        decimal PrecipitationMm,
        decimal SoilMoisturePercentage,
        bool IsFrostRisk
    );

    public record FrostAlertConfigDto(
        Guid Id,
        Guid FieldId,
        decimal TemperatureThreshold,
        string AlertEmail,
        bool IsAlertActive
    );

    public record WeatherSubscriptionBillingDto(
        Guid Id,
        decimal SubscriptionFee,
        DateTime BillingDate
    );

    public record WeatherAnalyticsDto(
        List<WeatherStationDto> Stations,
        List<WeatherReadingDto> Readings,
        List<FrostAlertConfigDto> FrostConfigs,
        List<WeatherSubscriptionBillingDto> Billings,
        decimal TotalSubscriptionExpenses
    );

    public record GetWeatherAnalyticsQuery : IRequest<WeatherAnalyticsDto>;

    public class GetWeatherAnalyticsQueryHandler : IRequestHandler<GetWeatherAnalyticsQuery, WeatherAnalyticsDto>
    {
        private readonly IWeatherDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public GetWeatherAnalyticsQueryHandler(IWeatherDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<WeatherAnalyticsDto> Handle(GetWeatherAnalyticsQuery request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Stations
            var stations = await _context.WeatherStations
                .AsNoTracking()
                .Where(s => s.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var stationDtos = stations.Select(s => new WeatherStationDto(
                s.Id,
                s.StationName,
                s.LocationLatitude,
                s.LocationLongitude,
                s.IsActive
            )).ToList();

            // Readings
            var readings = await _context.WeatherReadings
                .AsNoTracking()
                .Where(r => r.TenantId == tenantId)
                .OrderByDescending(r => r.ReadingTime)
                .Take(50)
                .ToListAsync(cancellationToken);

            var readingDtos = readings.Select(r => {
                var station = stations.FirstOrDefault(s => s.Id == r.WeatherStationId);
                return new WeatherReadingDto(
                    r.Id,
                    r.WeatherStationId,
                    station?.StationName ?? "Unknown Station",
                    r.ReadingTime,
                    r.TemperatureCelsius,
                    r.HumidityPercentage,
                    r.WindSpeedKph,
                    r.PrecipitationMm,
                    r.SoilMoisturePercentage,
                    r.IsFrostRisk
                );
            }).ToList();

            // Alert Configs
            var configs = await _context.FrostAlertConfigs
                .AsNoTracking()
                .Where(c => c.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var configDtos = configs.Select(c => new FrostAlertConfigDto(
                c.Id,
                c.FieldId,
                c.TemperatureThreshold,
                c.AlertEmail,
                c.IsAlertActive
            )).ToList();

            // Billings
            var billings = await _context.WeatherSubscriptionBillings
                .AsNoTracking()
                .Where(b => b.TenantId == tenantId)
                .ToListAsync(cancellationToken);

            var billingDtos = billings.Select(b => new WeatherSubscriptionBillingDto(
                b.Id,
                b.SubscriptionFee,
                b.BillingDate
            )).ToList();

            decimal totalExpenses = billingDtos.Sum(b => b.SubscriptionFee);

            return new WeatherAnalyticsDto(
                stationDtos,
                readingDtos,
                configDtos,
                billingDtos,
                totalExpenses
            );
        }
    }
}
