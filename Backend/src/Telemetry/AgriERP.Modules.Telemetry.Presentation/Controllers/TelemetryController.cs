using AgriERP.Modules.Auth.Presentation.Authorization;
using AgriERP.Modules.Telemetry.Application.Devices.Commands.RegisterDevice;
using AgriERP.Modules.Telemetry.Application.Devices.Commands.IngestTelemetry;
using AgriERP.Modules.Telemetry.Application.Geofences.Commands.CreateGeofence;
using AgriERP.Modules.Telemetry.Application.Geofences.Commands.LogAnimalLocation;
using AgriERP.Modules.Telemetry.Application.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace AgriERP.Modules.Telemetry.Presentation.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v1/[controller]")]
    public class TelemetryController : ControllerBase
    {
        private readonly ISender _sender;
        private readonly ITelemetryDbContext _context;

        public TelemetryController(ISender sender, ITelemetryDbContext context)
        {
            _sender = sender;
            _context = context;
        }

        [HttpPost("devices")]
        [RequirePermission("Animal.Create")] // Standard permission tag reuse
        public async Task<IActionResult> RegisterDevice([FromBody] RegisterDeviceCommand command, CancellationToken cancellationToken)
        {
            var deviceId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/telemetry/devices/{deviceId}", new { Id = deviceId });
        }

        [HttpPost("ingest")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> IngestReading([FromBody] IngestTelemetryCommand command, CancellationToken cancellationToken)
        {
            await _sender.Send(command, cancellationToken);
            return Ok(new { Message = "Telemetry reading ingested successfully." });
        }

        [HttpPost("geofences")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> CreateGeofence([FromBody] CreateGeofenceCommand command, CancellationToken cancellationToken)
        {
            var geofenceId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/telemetry/geofences/{geofenceId}", new { Id = geofenceId });
        }

        [HttpPost("locations")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> LogLocation([FromBody] LogAnimalLocationCommand command, CancellationToken cancellationToken)
        {
            var locationLogId = await _sender.Send(command, cancellationToken);
            return Created($"/api/v1/telemetry/locations/{locationLogId}", new { Id = locationLogId });
        }

        // ==========================================
        // API-Level Hardware Simulators (No Device Needed)
        // ==========================================

        [HttpPost("simulator/moisture-drop")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> SimulateMoistureDrop([FromQuery] Guid deviceId, CancellationToken cancellationToken)
        {
            // Simulate reading 1: Normal moisture (45%)
            await _sender.Send(new IngestTelemetryCommand(deviceId, "SoilMoisture", 45.0m), cancellationToken);

            // Simulate reading 2: Low moisture (24.5%) - this triggers the smart irrigation actuator logic
            await _sender.Send(new IngestTelemetryCommand(deviceId, "SoilMoisture", 24.5m), cancellationToken);

            // Retrieve updated device state to prove actuator triggered
            var device = await _context.IotDevices.FirstOrDefaultAsync(d => d.Id == deviceId, cancellationToken);

            return Ok(new
            {
                Success = true,
                Message = "Moisture drop simulated successfully.",
                TelemetryLogged = new[] { "SoilMoisture: 45.0%", "SoilMoisture: 24.5%" },
                TriggeredActuatorStatus = device?.Status
            });
        }

        [HttpPost("simulator/gps-breach")]
        [RequirePermission("Animal.Create")]
        public async Task<IActionResult> SimulateGpsBreach([FromQuery] Guid animalId, [FromQuery] Guid geofenceId, CancellationToken cancellationToken)
        {
            var geofence = await _context.GeofenceZones.FirstOrDefaultAsync(z => z.Id == geofenceId, cancellationToken);
            if (geofence == null)
            {
                return NotFound("Geofence zone not found.");
            }

            // Path point 1: Inside pasture bounds
            var latInside = geofence.MinLatitude + 0.001m;
            var longInside = geofence.MinLongitude + 0.001m;
            var logId1 = await _sender.Send(new LogAnimalLocationCommand(animalId, latInside, longInside), cancellationToken);

            // Path point 2: Straying outside pasture bounds (Breaches geofence!)
            var latOutside = geofence.MaxLatitude + 0.0500m;
            var longOutside = geofence.MaxLongitude + 0.0500m;
            var logId2 = await _sender.Send(new LogAnimalLocationCommand(animalId, latOutside, longOutside), cancellationToken);

            var insideLog = await _context.AnimalLocationLogs.FirstOrDefaultAsync(l => l.Id == logId1, cancellationToken);
            var outsideLog = await _context.AnimalLocationLogs.FirstOrDefaultAsync(l => l.Id == logId2, cancellationToken);

            return Ok(new
            {
                Success = true,
                Message = "GPS breach simulation run completed.",
                Steps = new[]
                {
                    new { Label = "Step 1: Animal Inside Bounds", Coordinates = $"{latInside}, {longInside}", IsWithinBounds = insideLog?.IsWithinBounds },
                    new { Label = "Step 2: Animal Outside Bounds (Breached)", Coordinates = $"{latOutside}, {longOutside}", IsWithinBounds = outsideLog?.IsWithinBounds }
                }
            });
        }

        [HttpGet("devices")]
        [RequirePermission("Animal.View")]
        public async Task<IActionResult> GetDevices(CancellationToken cancellationToken)
        {
            var devices = await _context.IotDevices
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(devices);
        }

        [HttpGet("geofences")]
        [RequirePermission("Animal.View")]
        public async Task<IActionResult> GetGeofences(CancellationToken cancellationToken)
        {
            var geofences = await _context.GeofenceZones
                .AsNoTracking()
                .ToListAsync(cancellationToken);
            return Ok(geofences);
        }

        [HttpGet("locations")]
        [RequirePermission("Animal.View")]
        public async Task<IActionResult> GetLocations(CancellationToken cancellationToken)
        {
            var locations = await _context.AnimalLocationLogs
                .AsNoTracking()
                .OrderByDescending(l => l.RecordedAt)
                .Take(50)
                .ToListAsync(cancellationToken);
            return Ok(locations);
        }
    }
}
