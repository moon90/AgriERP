# Frontend

## Overview

Angular 19+ standalone enterprise SPA managed inside an Nx Monorepo (`agri-erp-workspace`). Provides real-time telemetry dashboards, agronomy tools, and financial/ERP management views.

## Project Structure

- `src/app/`: Shell application, authentication guard, layout shell (`MainLayoutComponent`), routes (`app.routes.ts`).
- `libs/features/`: Feature domain libraries:
  - `agronomy` (Soil chemistry, lab samples)
  - `assets` (Fleet, equipment maintenance, depreciation)
  - `chemicals` (Hazardous materials, spray logs, REI)
  - `crops` (Field plots, plant cycles, yield predictions)
  - `finance` (General ledger, chart of accounts, income statements)
  - `hr` (Staff directory, attendance, payroll)
  - `insurance` (Crop insurance policies, adjuster payouts)
  - `inventory` (Warehouse inventory, procurement POs, sales orders)
  - `irrigation` (Water permit rights, pump flow sensors)
  - `land` (Land leases, sharecrop payout calculators)
  - `livestock` (Animal list, health logs, telemetry)
  - `logistics` (Silos, weighbridge tickets, grain ledger)
  - `telemetry` (Live IoT sensor telemetry dashboards)
  - `trading` (Futures short hedges, sales contracts)
  - `weather` (Towers, sensor telemetry, frost warning alarms)
- `libs/core/`: Shared models, HTTP interceptors, auth guards, authentication and role services.

## Styling & Design System

- **Design System Tokens (`src/styles.scss`)**:
  - `--bg-dark-slate`: `#0f172a` (Base page background)
  - `--bg-dark-card`: `rgba(15, 23, 42, 0.6)` (Translucent container background)
  - `--primary-emerald`: `#10b981` (Primary accents and CTA glows)
  - `--border-glass`: `rgba(255, 255, 255, 0.08)`
  - `--border-glass-light`: `rgba(255, 255, 255, 0.15)`
- **UI Components & Classes**:
  - `.btn-primary`: Emerald gradient button with subtle glow
  - `.btn-secondary`: Dark slate glass button
  - `.modern-table`: Standardized dark glass data table
  - `.badge-pill`: Rounded status pill badges (`badge-emerald`, `badge-amber`, `badge-blue`, `badge-rose`, `badge-purple`)

## Key Commands

```bash
# Start Frontend Dev Server (http://localhost:4200)
npx nx serve

# Build Production Bundle
npx nx build
```

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
