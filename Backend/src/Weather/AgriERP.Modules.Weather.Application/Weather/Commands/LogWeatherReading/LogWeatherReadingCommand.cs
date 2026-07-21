using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Weather.Commands.LogWeatherReading
{
    public record LogWeatherReadingCommand(
        Guid WeatherStationId,
        Guid FieldId, // Target field to match threshold parameters
        decimal TemperatureCelsius,
        decimal HumidityPercentage,
        decimal WindSpeedKph,
        decimal PrecipitationMm,
        decimal SoilMoisturePercentage
    ) : IRequest<Guid>;

    public class LogWeatherReadingCommandHandler : IRequestHandler<LogWeatherReadingCommand, Guid>
    {
        private readonly IWeatherDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public LogWeatherReadingCommandHandler(IWeatherDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(LogWeatherReadingCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            // Find config for field to extract warning threshold
            var config = await _context.FrostAlertConfigs
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.FieldId == request.FieldId && c.TenantId == tenantId, cancellationToken);

            decimal threshold = config?.IsAlertActive == true ? config.TemperatureThreshold : 2.00m;

            bool isFrostRisk = request.TemperatureCelsius <= threshold;

            var reading = new WeatherReading(
                tenantId,
                request.WeatherStationId,
                DateTime.UtcNow,
                request.TemperatureCelsius,
                request.HumidityPercentage,
                request.WindSpeedKph,
                request.PrecipitationMm,
                request.SoilMoisturePercentage,
                isFrostRisk
            );

            await _context.WeatherReadings.AddAsync(reading, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return reading.Id;
        }
    }
}
