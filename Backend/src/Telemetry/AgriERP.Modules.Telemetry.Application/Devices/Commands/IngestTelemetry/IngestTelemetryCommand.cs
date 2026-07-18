using MediatR;
using System;

namespace AgriERP.Modules.Telemetry.Application.Devices.Commands.IngestTelemetry
{
    public record IngestTelemetryCommand(Guid DeviceId, string MetricName, decimal MetricValue) : IRequest;
}
