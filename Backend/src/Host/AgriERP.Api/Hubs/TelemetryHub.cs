using Microsoft.AspNetCore.SignalR;

namespace AgriERP.Api.Hubs;

public record TelemetryReadingDto(
    Guid DeviceId,
    string DeviceName,
    string Zone,
    string SensorType,
    double Value,
    string Unit,
    double BatteryPercentage,
    DateTime Timestamp,
    bool IsAlarm
);

public record TelemetryAlarmDto(
    Guid AlarmId,
    Guid DeviceId,
    string DeviceName,
    string Zone,
    string Severity,
    string Message,
    double CurrentValue,
    double ThresholdValue,
    DateTime TriggeredAt
);

public interface ITelemetryClient
{
    Task ReceiveTelemetryReading(TelemetryReadingDto reading);
    Task ReceiveThresholdAlarm(TelemetryAlarmDto alarm);
}

public class TelemetryHub : Hub<ITelemetryClient>
{
    public async Task SubscribeZone(string zone)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, zone);
    }

    public async Task UnsubscribeZone(string zone)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, zone);
    }
}
