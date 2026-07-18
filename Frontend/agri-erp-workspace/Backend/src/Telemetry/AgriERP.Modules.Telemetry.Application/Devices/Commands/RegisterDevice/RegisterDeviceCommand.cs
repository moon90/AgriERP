using MediatR;
using System;

namespace AgriERP.Modules.Telemetry.Application.Devices.Commands.RegisterDevice
{
    public record RegisterDeviceCommand(string Name, string DeviceType) : IRequest<Guid>;
}
