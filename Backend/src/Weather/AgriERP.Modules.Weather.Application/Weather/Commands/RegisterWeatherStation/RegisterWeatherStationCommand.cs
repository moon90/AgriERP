using AgriERP.BuildingBlocks.Application;
using AgriERP.Modules.Weather.Application.Common;
using AgriERP.Modules.Weather.Domain;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Weather.Application.Weather.Commands.RegisterWeatherStation
{
    public record RegisterWeatherStationCommand(
        string StationName,
        decimal LocationLatitude,
        decimal LocationLongitude
    ) : IRequest<Guid>;

    public class RegisterWeatherStationCommandHandler : IRequestHandler<RegisterWeatherStationCommand, Guid>
    {
        private readonly IWeatherDbContext _context;
        private readonly ITenantProvider _tenantProvider;

        public RegisterWeatherStationCommandHandler(IWeatherDbContext context, ITenantProvider tenantProvider)
        {
            _context = context;
            _tenantProvider = tenantProvider;
        }

        public async Task<Guid> Handle(RegisterWeatherStationCommand request, CancellationToken cancellationToken)
        {
            var tenantId = _tenantProvider.TenantId;

            var station = new WeatherStation(
                tenantId,
                request.StationName,
                request.LocationLatitude,
                request.LocationLongitude
            );

            await _context.WeatherStations.AddAsync(station, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            return station.Id;
        }
    }
}
