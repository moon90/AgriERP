using AgriERP.Api.Hubs;
using Microsoft.AspNetCore.SignalR;
using Moq;
using Xunit;

namespace AgriERP.Architecture.Tests;

public class TelemetryHubTests
{
    [Fact]
    public void TelemetryReadingDto_Initializes_Correctly()
    {
        // Arrange & Act
        var deviceId = Guid.NewGuid();
        var timestamp = DateTime.UtcNow;
        var reading = new TelemetryReadingDto(
            deviceId,
            "Greenhouse Sensor #1",
            "Greenhouse Complex",
            "AmbientTemp",
            24.5,
            "°C",
            98.0,
            timestamp,
            false
        );

        // Assert
        Assert.Equal(deviceId, reading.DeviceId);
        Assert.Equal("Greenhouse Sensor #1", reading.DeviceName);
        Assert.Equal("Greenhouse Complex", reading.Zone);
        Assert.Equal("AmbientTemp", reading.SensorType);
        Assert.Equal(24.5, reading.Value);
        Assert.Equal("°C", reading.Unit);
        Assert.Equal(98.0, reading.BatteryPercentage);
        Assert.False(reading.IsAlarm);
    }

    [Fact]
    public void TelemetryAlarmDto_Flags_Critical_Threshold_Breach()
    {
        // Arrange & Act
        var alarmId = Guid.NewGuid();
        var deviceId = Guid.NewGuid();
        var triggeredAt = DateTime.UtcNow;
        var alarm = new TelemetryAlarmDto(
            alarmId,
            deviceId,
            "Soil Moisture Probe A-1",
            "Sector-A North Plot",
            "Critical",
            "Soil moisture below 20%",
            14.2,
            20.0,
            triggeredAt
        );

        // Assert
        Assert.Equal(alarmId, alarm.AlarmId);
        Assert.Equal("Critical", alarm.Severity);
        Assert.True(alarm.CurrentValue < alarm.ThresholdValue);
        Assert.Equal("Sector-A North Plot", alarm.Zone);
    }

    [Fact]
    public async Task TelemetryHub_SubscribeZone_Adds_Connection_To_Group()
    {
        // Arrange
        var hub = new TelemetryHub();
        var mockGroups = new Mock<IGroupManager>();
        var mockContext = new Mock<HubCallerContext>();

        mockContext.Setup(c => c.ConnectionId).Returns("test-conn-123");
        mockGroups.Setup(g => g.AddToGroupAsync("test-conn-123", "Greenhouse Complex", default))
                  .Returns(Task.CompletedTask);

        hub.Context = mockContext.Object;
        hub.Groups = mockGroups.Object;

        // Act
        await hub.SubscribeZone("Greenhouse Complex");

        // Assert
        mockGroups.Verify(g => g.AddToGroupAsync("test-conn-123", "Greenhouse Complex", default), Times.Once);
    }

    [Fact]
    public async Task TelemetryHub_UnsubscribeZone_Removes_Connection_From_Group()
    {
        // Arrange
        var hub = new TelemetryHub();
        var mockGroups = new Mock<IGroupManager>();
        var mockContext = new Mock<HubCallerContext>();

        mockContext.Setup(c => c.ConnectionId).Returns("test-conn-123");
        mockGroups.Setup(g => g.RemoveFromGroupAsync("test-conn-123", "Greenhouse Complex", default))
                  .Returns(Task.CompletedTask);

        hub.Context = mockContext.Object;
        hub.Groups = mockGroups.Object;

        // Act
        await hub.UnsubscribeZone("Greenhouse Complex");

        // Assert
        mockGroups.Verify(g => g.RemoveFromGroupAsync("test-conn-123", "Greenhouse Complex", default), Times.Once);
    }
}
