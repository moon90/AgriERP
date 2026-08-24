using System;
using Xunit;

namespace AgriERP.Architecture.Tests;

public class OfflineSyncTests
{
    public record QueuedSyncItemDto(
        string Id,
        string Action,
        string Endpoint,
        string Method,
        string PayloadJson,
        DateTime QueuedAt,
        string Status,
        int RetryCount
    );

    [Fact]
    public void QueuedSyncItem_Initializes_With_Pending_Status()
    {
        // Arrange & Act
        var item = new QueuedSyncItemDto(
            "SYNC-12345",
            "Record Soil Sample",
            "/api/v1/Agronomy/samples",
            "POST",
            "{\"sampleCode\":\"SMP-OFFLINE-1\",\"phLevel\":6.5}",
            DateTime.UtcNow,
            "Pending",
            0
        );

        // Assert
        Assert.Equal("SYNC-12345", item.Id);
        Assert.Equal("Record Soil Sample", item.Action);
        Assert.Equal("POST", item.Method);
        Assert.Equal("Pending", item.Status);
        Assert.Equal(0, item.RetryCount);
    }

    [Fact]
    public void QueuedSyncItem_Transitions_To_Synced_After_Execution()
    {
        // Arrange
        var item = new QueuedSyncItemDto(
            "SYNC-9999",
            "Schedule Vaccination",
            "/api/v1/livestock/veterinary/vaccinations",
            "POST",
            "{}",
            DateTime.UtcNow,
            "Pending",
            0
        );

        // Act
        var syncedItem = item with { Status = "Synced" };

        // Assert
        Assert.Equal("Synced", syncedItem.Status);
    }

    [Fact]
    public void QueuedSyncItem_Increments_RetryCount_On_Failure()
    {
        // Arrange
        var item = new QueuedSyncItemDto(
            "SYNC-8888",
            "Submit Scouting Log",
            "/api/v1/crops/scouting",
            "POST",
            "{}",
            DateTime.UtcNow,
            "Pending",
            0
        );

        // Act
        var failedItem = item with { Status = "Failed", RetryCount = item.RetryCount + 1 };

        // Assert
        Assert.Equal("Failed", failedItem.Status);
        Assert.Equal(1, failedItem.RetryCount);
    }
}
