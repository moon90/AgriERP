# 0002. Automated Veterinary Vaccination and Breeding Scheduler

**Date**: 2026-08-24  
**Status**: Proposed  

## Summary

This specification introduces automated veterinary scheduling, immunization workflows, and gestation lifecycle tracking for farm livestock. Ranchers and herd veterinarians can schedule mandatory vaccination doses, receive alerts for overdue health interventions, log artificial/natural inseminations with automated 283-day gestation milestone calculations, record pregnancy test confirmations, and register newborn calf births into inventory.

---

## Context

Livestock health management and genetic breeding programs are critical drivers of farm profitability and animal welfare:
- Missed vaccination boosters (Anthrax, FMD, Brucellosis, Blackleg) expose herds to catastrophic disease outbreaks and trade quarantine penalties.
- Insemination and pregnancy verification tracking are often kept in manual paper notebooks, causing missed calving windows, unmonitored maternal health risks, and delayed calf ear-tagging.

Establishing an integrated veterinary scheduler within AgriERP's Clean Architecture allows automated calculation of expected calving dates, tracking of vaccine inventory depletion, and provides a unified Dark Slate Glass calendar view for farm operators.

---

## Requirements

**User stories**:
- As a Herd Manager, I want to schedule vaccination dates for individual cattle or entire batches so our veterinary team stays ahead of immunization deadlines.
- As a Farm Veterinarian, I want to record pregnancy check outcomes and have the system calculate expected calving dates automatically.
- As a Rancher, I want to log newborn calf deliveries directly into inventory upon calving with birth weight and ear tag numbers.

**Acceptance criteria**:
- **AC-1**: `VaccinationSchedule` endpoints allow scheduling new vaccines (`POST /api/v1/livestock/veterinary/vaccinations`), retrieving status-sorted rosters (`GET`), and recording administration completion (`POST .../complete`).
- **AC-2**: Vaccination records past their scheduled date without administration are automatically flagged as `Overdue` with warning badges.
- **AC-3**: `BreedingCycle` endpoints allow registering inseminations (`POST /api/v1/livestock/veterinary/breeding-cycles`), auto-computing expected calving dates (283 days gestation).
- **AC-4**: Pregnancy verification updates cycle state (`Active`, `Positive`, `Failed`), and calving completion records calf birth records into the database.
- **AC-5**: Angular Livestock UI integrates a modern Dark Slate Glassmorphism multi-tab interface (`Animal Inventory`, `Vaccination Scheduler`, `Breeding & Gestation Lifecycle`) with quick action modals and status pills.

---

## Options Considered

### Option 1: Integrated Veterinary & Breeding Domain Sub-Module (Recommended)
Embed vaccination schedules and breeding cycle aggregates directly into `AgriERP.Modules.Livestock` with MediatR CQRS handlers and EF Core mapping.

**Pros**:
- Direct relational integrity with `Animal` entities.
- Zero cross-module RPC latency.
- Leverages existing EF Core DbContext and migration pipeline.

**Cons**:
- Expands the Livestock DbContext (mitigated by clean entity separation and dedicated repository interfaces).

### Option 2: Standalone Microservice for Veterinary Telehealth
Deploy a separate service for health schedules.

**Pros**:
- Independent scaling.

**Cons**:
- Excessive operational complexity for a Modular Monolith with zero functional benefit.

---

## Decision

**Chosen option**: Option 1: Integrated Veterinary & Breeding Domain Sub-Module in `AgriERP.Modules.Livestock`.

---

## Feature Design

### Data Contracts & API Surface (`/api/v1/livestock/veterinary/`)

| Endpoint | Method | Key Inputs | Key Outputs | Description |
|---|---|---|---|---|
| `/vaccinations` | `GET` | Filter (status) | `List<VaccinationScheduleDto>` | Lists scheduled, overdue, and completed vaccinations |
| `/vaccinations` | `POST` | `ScheduleVaccinationCommand` | `Guid` (ScheduleId) | Schedules vaccine for target animal |
| `/vaccinations/{id}/complete` | `POST` | `AdministeredDate`, `Notes` | Result Status | Marks vaccination completed |
| `/breeding-cycles` | `GET` | Filter (status) | `List<BreedingCycleDto>` | Lists active pregnancies and calving timelines |
| `/breeding-cycles` | `POST` | `RecordInseminationCommand` | `Guid` (CycleId) | Registers insemination and computes expected calving |
| `/breeding-cycles/{id}/pregnancy-check` | `POST` | `CheckDate`, `Result` | Result Status | Records pregnancy check confirmation |
| `/breeding-cycles/{id}/calving` | `POST` | `CalvingDate`, `Gender`, `BirthWeight`, `TagNumber` | Result Status | Completes calving and records birth record |

---

## Build Plan

- [ ] **Milestone 1: Backend CQRS Handlers & Controller Endpoints (AC-1, AC-2, AC-3, AC-4)**
  - Implement MediatR queries and commands for Vaccination scheduling and Breeding cycles in `AgriERP.Modules.Livestock.Application`.
  - Create `VeterinaryController` in `AgriERP.Modules.Livestock.Presentation`.
- [ ] **Milestone 2: Frontend Angular Veterinary & Breeding Services (AC-5)**
  - Update `AnimalService` / create `VeterinaryService` in `libs/features/livestock`.
- [ ] **Milestone 3: Modern Dark Glass Veterinary & Breeding UI (AC-5)**
  - Add tabbed navigation to `animal-list.component.ts` (Herd Roster, Vaccination Calendar, Breeding Lifecycle).
  - Add quick action dialogs for scheduling vaccines, recording pregnancy checks, and logging calving deliveries.
- [ ] **Milestone 4: Verification & Automated Tests**
  - Run `/check verify` against `AC-1..5`.
  - Auto-generate xUnit test suite under `/test`.
