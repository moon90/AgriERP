using MediatR;
using System;

namespace AgriERP.Modules.Telemetry.Application.Geofences.Commands.LogAnimalLocation
{
    public record LogAnimalLocationCommand(Guid AnimalId, decimal Latitude, decimal Longitude) : IRequest<Guid>;
}
