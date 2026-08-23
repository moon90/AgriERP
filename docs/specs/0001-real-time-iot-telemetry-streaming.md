# 0001. Real-time IoT Edge Telemetry WebSocket Streaming

**Date**: 2026-08-24  
**Status**: Proposed  

## Summary

This specification adopts ASP.NET Core SignalR and Angular WebSockets for real-time sensor telemetry streaming and edge alert notifications across all agricultural zones. Instead of relying on manual page reloads or polling, edge IoT devices, weather towers, soil probes, and livestock collars stream live telemetry data to the web dashboard with sub-second latency and visual threshold breach alarms.

---

## Context

Modern farm operations rely on real-time environmental awareness:
- Soil moisture levels must be monitored during irrigation cycles to avoid water waste or crop desiccation.
- Weather stations and frost warning alarms must alert operators immediately during sudden temperature drops.
- Livestock health vitals (body temperature, heart rate, ruminate activity) require rapid detection to prevent herd disease outbreaks.

Currently, the telemetry dashboard requires manual page refreshes or periodic HTTP polling, which increases server load and causes delayed notification of critical agricultural risks. Establishing a persistent WebSocket streaming pipeline with ASP.NET Core SignalR provides lightweight bi-directional streaming, zone-based channel subscriptions, and automated threshold alarms.

---

## Requirements

**User stories**:
- As a Farm Operations Manager, I want to observe live sensor telemetry streams (temperature, soil moisture, humidity, battery level) in real time without refreshing the page.
- As an Agronomist, I want to filter the live stream by specific zones (Greenhouse North, Field Plot 3, Livestock Barn 1) so I only see data relevant to my area.
- As a Rancher, I want instant visual and auditory alarm notifications when an animal's vitals or an environmental reading crosses a dangerous safety threshold.

**Acceptance criteria**:
- **AC-1**: SignalR `TelemetryHub` is mapped at `/hubs/telemetry` with support for `SubscribeZone(string zone)` and `UnsubscribeZone(string zone)`.
- **AC-2**: Background IoT simulator / ingestion service publishes telemetry readings every 3 seconds to connected subscribers via `ReceiveTelemetryReading`.
- **AC-3**: Alarms are broadcast immediately via `ReceiveThresholdAlarm` when readings breach preconfigured safety limits (e.g. Frost risk < 0°C, Critical Soil Moisture < 20%, Elevated Livestock Temp > 39.5°C).
- **AC-4**: Angular `TelemetryStreamService` maintains persistent connection with automatic reconnection, heartbeat state, and reactive Signals for `liveReadings` and `activeAlarms`.
- **AC-5**: UI renders a glowing live WebSocket connection indicator, animated real-time SVG trend lines, interactive metric cards, and a live stream event table matching the Dark Slate Glassmorphism design system (`rgba(15, 23, 42, 0.6)`).

---

## Options Considered

### Option 1: ASP.NET Core SignalR with WebSocket Transport (Recommended)
Native .NET 10 real-time communication framework with automatic WebSocket negotiation, Server-Sent Events (SSE) fallback, and built-in client libraries for Angular (`@microsoft/signalr`).

**Pros**:
- Native integration with ASP.NET Core DI, authentication, and background hosted services.
- Group-based multiplexing (`JoinGroupAsync`, `LeaveGroupAsync`) allowing zone-level filtering without separate socket endpoints.
- Lightweight binary and JSON protocol support.

**Cons**:
- Requires persistent WebSocket connection management on load-balanced clusters (mitigated by Azure SignalR or Redis backplane if scaled).

### Option 2: Server-Sent Events (SSE) via HTTP Streaming
Unidirectional HTTP stream from server to client.

**Pros**:
- Simple HTTP-based protocol without special websocket handshake.

**Cons**:
- Unidirectional only (client cannot subscribe or acknowledge via the same stream).
- No built-in group channel management.

---

## Decision

**Chosen option**: Option 1: ASP.NET Core SignalR with WebSocket Transport.

---

## Feature Design

### Data Model & DTOs

```csharp
public record TelemetryReadingDto(
    Guid DeviceId,
    string DeviceName,
    string Zone,
    string SensorType, // "SoilMoisture", "AmbientTemp", "Humidity", "CO2", "AnimalVitals"
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
    string Severity, // "Warning", "Critical"
    string Message,
    double CurrentValue,
    double ThresholdValue,
    DateTime TriggeredAt
);
```

### SignalR Hub Surface (`/hubs/telemetry`)

| Method / Event | Direction | Payload | Description |
|---|---|---|---|
| `SubscribeZone(string zone)` | Client ➔ Hub | `zone` (string) | Joins client connection to specific farm zone group |
| `UnsubscribeZone(string zone)` | Client ➔ Hub | `zone` (string) | Leaves the farm zone group |
| `ReceiveTelemetryReading` | Hub ➔ Client | `TelemetryReadingDto` | Broadcasts latest sensor telemetry to zone subscribers |
| `ReceiveThresholdAlarm` | Hub ➔ Client | `TelemetryAlarmDto` | Emits urgent alarm alerts to all connected dashboards |

---

## Build Plan

- [ ] **Milestone 1: Backend SignalR Hub & Background Publisher (AC-1, AC-2, AC-3)**
  - Configure `TelemetryHub` in `AgriERP.Api` with CORS and JWT bearer token authorization.
  - Implement `TelemetrySimulationWorker` to generate and stream realistic IoT sensor data every 3 seconds.
  - Implement threshold evaluation rules to dispatch `ReceiveThresholdAlarm` on safety limits.
- [ ] **Milestone 2: Frontend SignalR Streaming Service (AC-4)**
  - Install `@microsoft/signalr` in `Frontend/agri-erp-workspace`.
  - Create `TelemetryStreamService` with connection state management, zone filtering, and signal state.
- [ ] **Milestone 3: Modern Dark Slate Glass Telemetry Dashboard UI (AC-5)**
  - Build live pulse indicator (Connected / Reconnecting / Disconnected).
  - Build dynamic gauge cards for Soil Moisture, Barn Temperature, CO2 levels, and Solar battery.
  - Build animated live telemetry stream timeline and flashing alert banner for critical thresholds.
- [ ] **Milestone 4: Verification & Automated Tests**
  - Verify WebSocket handshake, message dispatching, and UI rendering under `/check verify`.
  - Write unit and integration tests under `/test`.
