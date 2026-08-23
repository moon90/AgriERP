using AgriERP.Api.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace AgriERP.Api.BackgroundServices;

public class TelemetrySimulationWorker : BackgroundService
{
    private readonly IHubContext<TelemetryHub, ITelemetryClient> _hubContext;
    private readonly ILogger<TelemetrySimulationWorker> _logger;
    private readonly Random _random = new();

    private readonly List<(Guid Id, string Name, string Zone, string SensorType, string Unit, double MinVal, double MaxVal, double AlarmThreshold, bool AlarmIfBelow)> _sensors = new()
    {
        (Guid.Parse("11111111-1111-1111-1111-111111111111"), "Soil Moisture Probe A-1", "Sector-A North Plot", "SoilMoisture", "%", 15.0, 75.0, 20.0, true),
        (Guid.Parse("22222222-2222-2222-2222-222222222222"), "Greenhouse-1 Climate Tower", "Greenhouse Complex", "AmbientTemp", "°C", -2.0, 38.0, 0.0, true),
        (Guid.Parse("33333333-3333-3333-3333-333333333333"), "Greenhouse-1 CO2 Monitor", "Greenhouse Complex", "CO2", "ppm", 380.0, 1200.0, 1000.0, false),
        (Guid.Parse("44444444-4444-4444-4444-444444444444"), "Cattle-Collar RFID #409", "Livestock Barn 3", "AnimalVitals", "bpm", 55.0, 125.0, 110.0, false),
        (Guid.Parse("55555555-5555-5555-5555-555555555555"), "Irrigation Pump Sector-4", "Sector-B Lower Basin", "WaterFlow", "GPM", 0.0, 450.0, 50.0, true),
        (Guid.Parse("66666666-6666-6666-6666-666666666666"), "Solar Power Battery Bank", "Central Station", "BatteryPower", "%", 40.0, 100.0, 45.0, true)
    };

    public TelemetrySimulationWorker(IHubContext<TelemetryHub, ITelemetryClient> hubContext, ILogger<TelemetrySimulationWorker> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("IoT Telemetry Simulation Worker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                foreach (var sensor in _sensors)
                {
                    // Generate realistic simulated value
                    double jitter = (_random.NextDouble() * 2 - 1) * 3.5;
                    double midPoint = (sensor.MinVal + sensor.MaxVal) / 2.0;
                    double currentVal = Math.Round(midPoint + jitter + (_random.NextDouble() * (sensor.MaxVal - sensor.MinVal) * 0.35 - (sensor.MaxVal - sensor.MinVal) * 0.175), 1);

                    // Clamp
                    currentVal = Math.Max(sensor.MinVal, Math.Min(sensor.MaxVal, currentVal));

                    bool isAlarm = sensor.AlarmIfBelow ? currentVal < sensor.AlarmThreshold : currentVal > sensor.AlarmThreshold;
                    double battery = Math.Round(80.0 + (_random.NextDouble() * 19.5), 1);

                    var reading = new TelemetryReadingDto(
                        sensor.Id,
                        sensor.Name,
                        sensor.Zone,
                        sensor.SensorType,
                        currentVal,
                        sensor.Unit,
                        battery,
                        DateTime.UtcNow,
                        isAlarm
                    );

                    // Broadcast reading to all clients & to specific zone group
                    await _hubContext.Clients.All.ReceiveTelemetryReading(reading);
                    await _hubContext.Clients.Group(sensor.Zone).ReceiveTelemetryReading(reading);

                    // If alarm condition is met, broadcast alarm alert
                    if (isAlarm)
                    {
                        var alarm = new TelemetryAlarmDto(
                            Guid.NewGuid(),
                            sensor.Id,
                            sensor.Name,
                            sensor.Zone,
                            "Critical",
                            $"Threshold breach on {sensor.Name} ({sensor.SensorType}): {currentVal}{sensor.Unit} (Threshold: {sensor.AlarmThreshold}{sensor.Unit})",
                            currentVal,
                            sensor.AlarmThreshold,
                            DateTime.UtcNow
                        );

                        await _hubContext.Clients.All.ReceiveThresholdAlarm(alarm);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during IoT telemetry streaming cycle.");
            }

            await Task.Delay(3000, stoppingToken);
        }
    }
}
