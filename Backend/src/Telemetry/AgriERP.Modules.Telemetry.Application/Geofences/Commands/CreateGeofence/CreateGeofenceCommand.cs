using MediatR;
using System;

namespace AgriERP.Modules.Telemetry.Application.Geofences.Commands.CreateGeofence
{
    public record CreateGeofenceCommand(
        string Name, 
        decimal MinLatitude, 
        decimal MaxLatitude, 
        decimal MinLongitude, 
        decimal MaxLongitude) : IRequest<Guid>;
}
