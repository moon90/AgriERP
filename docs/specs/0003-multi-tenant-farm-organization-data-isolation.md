# 0003. Multi-tenant Farm Organization Data Isolation

**Date**: 2026-08-24  
**Status**: Proposed  

## Summary

This specification delivers enterprise-grade multi-tenant organization isolation and seamless dynamic farm switching for AgriERP. Agri-business enterprises managing multiple subsidiaries, distinct agricultural estates, or joint-venture farm operations can securely isolate financial, livestock, telemetry, and crop records while providing executives with an instant one-click Organization Switcher in the top navigation bar.

---

## Context

Enterprise agricultural operations frequently manage distinct operational branches:
- A dairy operation and an organic horticulture farm operating under separate corporate LLCs must keep financials, supply chains, and compliance records strictly partitioned.
- Farm managers, agronomists, and veterinarians often oversee multiple properties and need to switch operational context seamlessly without logging out and back in.
- Data breaches between tenants represent a critical compliance violation and SaaS operational risk.

---

## Requirements

**User stories**:
- As an Enterprise Agricultural Owner, I want all records (crops, livestock, finance, inventory) isolated by `TenantId` at the database query level so there is zero data leakage between farm entities.
- As a Farm Manager overseeing multiple farms, I want to switch between my assigned farm organizations from a dropdown in the top header and have the dashboard instantly reload with that farm's live data.
- As a Security Administrator, I want tenant context enforced cryptographically via JWT claims (`tenant_id`) and verified on every API request.

**Acceptance criteria**:
- **AC-1**: `GET /api/v1/auth/tenants` lists all active farm organizations registered in the platform.
- **AC-2**: `POST /api/v1/auth/switch-tenant` issues a refreshed JWT token with the new `tenant_id` claim and updated permission set.
- **AC-3**: EF Core global query filters (`a.TenantId == CurrentTenantId`) in all module DbContexts enforce row-level isolation for all CRUD operations.
- **AC-4**: Angular `AuthService` and `TenantService` handle active tenant switching, storing `tenant_id` and refreshing application state.
- **AC-5**: Angular `MainLayoutComponent` renders an executive Dark Slate Glass Organization Switcher dropdown in the top header displaying the active farm name, logo/badge, and quick-switch options.

---

## Options Considered

### Option 1: Shared Database with Discriminator Column & EF Core Global Query Filter (Recommended)
Every entity implements `IMultiTenant`, and EF Core enforces `entity.HasQueryFilter(e => e.TenantId == CurrentTenantId)` with runtime JWT claim extraction.

**Pros**:
- Cost-effective database footprint.
- Straightforward schema migrations across all tenants simultaneously.
- Supported natively by existing `HttpTenantProvider` and `ApplicationDbContext`.

**Cons**:
- Requires diligent query filter testing on all domain aggregates.

### Option 2: Database-per-tenant Architecture
Separate physical SQL database for each tenant.

**Pros**:
- Physical hardware-level data isolation.

**Cons**:
- Extreme operational overhead for migrations and cross-tenant aggregate analytics.

---

## Decision

**Chosen option**: Option 1: Shared Database with Discriminator Column & EF Core Global Query Filter.

---

## Feature Design

### API Surface (`/api/v1/auth/`)

| Endpoint | Method | Payload | Output | Description |
|---|---|---|---|---|
| `/tenants` | `GET` | — | `List<TenantDto>` | Lists available farm organizations |
| `/switch-tenant` | `POST` | `{ "tenantId": "guid" }` | `{ "accessToken": "jwt", "tenantId": "guid", "tenantName": "string", "permissions": [] }` | Switches active tenant context and issues refreshed JWT |

---

## Build Plan

- [ ] **Milestone 1: Backend Organization Switching & Tenant Endpoints (AC-1, AC-2, AC-3)**
  - Add `GetTenantsQuery` and `SwitchTenantCommand` in `AgriERP.Modules.Auth.Application`.
  - Add `/tenants` and `/switch-tenant` endpoints to `AuthController`.
  - Verify `ITenantProvider` and EF Core `HasQueryFilter` across module DbContexts.
- [ ] **Milestone 2: Frontend Tenant Switcher State (AC-4)**
  - Add `switchTenant()` and `getTenants()` to `AuthService` in `libs/core/services/auth.service.ts`.
- [ ] **Milestone 3: Modern Dark Slate Glass Organization Switcher Header UI (AC-5)**
  - Integrate interactive Dark Glass Organization dropdown into `main-layout.ts`.
  - Add active farm badge and instant reactive tenant switching.
- [ ] **Milestone 4: Verification & Automated Tests**
  - Run `/check verify` against `AC-1..5`.
  - Auto-generate xUnit test suite under `/test`.
