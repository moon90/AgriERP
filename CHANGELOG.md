# Changelog

All notable changes to this project are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Real-Time IoT Edge Telemetry WebSocket Streaming** (Spec [0001](docs/specs/0001-real-time-iot-telemetry-streaming.md)):
  - ASP.NET Core SignalR `TelemetryHub` mapped at `/hubs/telemetry` with zone-based channel subscription (`SubscribeZone`).
  - Background `TelemetrySimulationWorker` hosted service broadcasting live soil moisture, greenhouse temperature, CO2 density, livestock vitals, and solar battery power every 3 seconds.
  - Automated threshold alarms (`ReceiveThresholdAlarm`) dispatching instant alerts on sub-zero frost risks, soil desiccation, and livestock vital anomalies.
  - Angular `TelemetryStreamService` with persistent SignalR connection, automatic reconnection, and reactive Signals.
  - Modern Dark Slate Glass Telemetry Dashboard with pulsing live connection status badge, 5 dynamic sensory metric cards, interactive zone filter tabs, and real-time live ingestion timeline.
  - xUnit automated unit tests for `TelemetryHub` and SignalR DTO contracts.
- **Automated Veterinary Vaccination & Breeding Scheduler** (Spec [0002](docs/specs/0002-automated-veterinary-vaccination-and-breeding-scheduler.md)):
  - ASP.NET Core `VeterinaryController` supporting vaccination dose scheduling, completion records, and automated overdue status evaluations.
  - Breeding cycle gestation lifecycle engine with automated 283-day expected calving calculations, ultrasound pregnancy diagnosis records, and newborn calf delivery registration into herd inventory.
  - Multi-tab Dark Slate Glass Angular UI (`Herd Inventory`, `Vaccination Scheduler`, `Breeding & Gestation Lifecycle`) with quick action modals.
  - xUnit automated unit test suite covering overdue checks, vaccination completion, pregnancy state transitions, and calf birth records.
- **Multi-Tenant Farm Organization Data Isolation** (Spec [0003](docs/specs/0003-multi-tenant-farm-organization-data-isolation.md)):
  - Cryptographic tenant resolution supporting both JWT token claims (`tenant_id`, `TenantId`) and `X-Tenant-Id` header fallbacks via `HttpTenantProvider`.
  - Added `GET /api/v1/auth/tenants` to list active enterprise subsidiaries and `POST /api/v1/auth/switch-tenant` to switch active tenant context with refreshed JWT tokens.
  - Top navigation Dark Slate Glass Organization Switcher dropdown with active farm organization badge and instant reactive tenant partition switching.
  - xUnit automated unit test suite verifying tenant entity activation, claim resolution, and switch-tenant data contracts.
- **Agentic Development Workflow & Durable Context**:
  - Integrated 9 Agent Skills from `jsmastery-pro/skills` under `.agents/skills/`.
  - Created root and nested `AGENTS.md` context files (`Backend/AGENTS.md`, `Frontend/agri-erp-workspace/AGENTS.md`).
  - Created living product scope and roadmap in `docs/scope/scope.md` covering 19 existing modules and 4 planned pipeline slices.

### Changed
- **Unified Dark Slate Glassmorphism Theme Overhaul**:
  - Upgraded all 15 Angular module pages (Crops, Livestock, Inventory, Procurement, Sales, HR, Assets, Agronomy, Chemicals, Weather, Insurance, Irrigation, Land, Logistics, Trading, Users, Roles) to the Dark Slate Glassmorphism design system (`rgba(15, 23, 42, 0.6)`, `.btn-primary`, `.modern-table`, `.badge-pill`).
  - Removed all legacy white card containers and outdated light-themed inputs.
