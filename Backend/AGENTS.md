# Backend

## Overview

Modular Monolith backend built on .NET 10 (C# 13) and ASP.NET Core Web API. Implements Clean Architecture with distinct module boundaries across 15 agricultural business domains.

## Architecture & Modules

The backend resides in `Backend/src/` partitioned into:
- **Host**: `AgriERP.Api` (Composition root, middleware, Swagger, JWT Bearer configuration)
- **Shared Kernel & Building Blocks**: `AgriERP.Common`
- **Domain Modules**:
  - `Auth` (Users, Roles, Permissions, JWT tokens, RBAC)
  - `Crops` (Field plots, crop cycles, yield forecasts, treatments)
  - `Livestock` (Animal inventory, health records, telemetry)
  - `Inventory` (Warehouses, stock items, procurement POs, sales orders)
  - `Finance` (General ledger, chart of accounts, journal entries, P&L)
  - `HR` (Employees, attendance, payroll calculation)
  - `Assets` (Machinery, vehicles, maintenance work orders, depreciation)
  - `Agronomy` (Soil chemistry, lab samples, crop advisory)
  - `Chemicals` (Pesticide registry, spray logs, REI restrictions)
  - `Weather` (Sensor telemetry, frost warning alerts, subscriptions)
  - `Insurance` (Crop policies, claims, adjuster payouts)
  - `Irrigation` (Water rights, pump telemetry, usage billing)
  - `Land` (Lease agreements, cash rent & sharecrop payouts)
  - `Logistics` (Grain elevators, weighbridge tickets, storage rental ledger)
  - `Trading` (Forward sales contracts, futures short hedges, realized PnL)

## Layer Structure per Module

Each module contains 4 sub-projects:
1. `*.Domain`: Entities, value objects, domain events, repository interfaces. Zero external dependencies.
2. `*.Application`: Commands, Queries, MediatR handlers, DTOs, FluentValidation rules.
3. `*.Infrastructure`: EF Core DbContexts, repository implementations, external service adapters.
4. `*.Presentation`: Controllers / Minimal API endpoints with permission authorization filters.

## Key Conventions

- **Result Pattern**: Handlers return `Result<T>` with standardized error codes.
- **Transactional Outbox**: Save domain events to `OutboxMessages` in the same database transaction.
- **EF Core Migrations**: Run EF migrations per module schema in SQL Server (`AgriErpDb`).

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
