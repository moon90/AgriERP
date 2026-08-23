# AgriERP

Enterprise Agriculture, Livestock, and Farm Management SaaS Platform.

## Stack

- **Backend Runtime**: .NET 10 (C# 13), ASP.NET Core Web API
- **Backend Architecture**: Modular Monolith & Clean Architecture (Domain, Application, Infrastructure, Presentation)
- **Backend Patterns**: CQRS (MediatR), Entity Framework Core (SQL Server), Outbox Pattern, JWT Auth & RBAC
- **Frontend Framework**: Angular 19+ (Standalone Components, Signals, RxJS, Reactive Forms)
- **Frontend Workspace**: Nx Monorepo (`agri-erp-workspace`)
- **Frontend Styling**: Custom Dark Slate Glassmorphism design system (`#0f172a`, emerald accents, glass borders)
- **Database**: Microsoft SQL Server (`AgriErpDb`)

## Build approach

Tracer Bullet (Vertical end-to-end slices through Domain, Application, Presentation, and Angular UI)

## Commands

```bash
# Backend (Run API Server on http://localhost:52566)
dotnet run --project Backend/src/Host/AgriERP.Api/AgriERP.Api.csproj --urls "http://localhost:52566"

# Frontend (Run Dev Server on http://localhost:4200)
cd Frontend/agri-erp-workspace && npx nx serve

# Frontend Build
cd Frontend/agri-erp-workspace && npx nx build

# Backend Tests
dotnet test Backend/AgriERP.sln
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title.md`.

## Rules

- **Clean Architecture Boundaries**: Domain layers have zero external dependencies. Application depends only on Domain. Infrastructure and Presentation depend on Application interfaces.
- **CQRS Pattern**: All state mutations use MediatR Commands with Result objects and FluentValidation. Data reads use Queries and DTOs.
- **Auditable & Outbox Entities**: Domain entities inherit `AuditableEntity` and dispatch domain events via the Outbox pattern.
- **Frontend Standalone Architecture**: All Angular components are standalone with strict TypeScript typing and explicit DI via `inject()`.
- **Unified Dark Slate Glass Design**: Use system CSS variables (`--bg-dark-slate`, `--primary-emerald`, `--border-glass`) and standard classes (`.btn-primary`, `.btn-secondary`, `.modern-table`, `.badge-pill`).
- **Zero White Card Regressions**: Avoid raw `#ffffff` container box styling in UI templates; use `rgba(15, 23, 42, 0.6)` with glass borders.

## Agent skills

- [architect](.agents/skills/architect/): `jsmastery-pro/skills`, Technical build specifications & system design (docs/specs/)
- [audit](.agents/skills/audit/): `jsmastery-pro/skills`, Repository AI context & AGENTS.md management
- [check](.agents/skills/check/): `jsmastery-pro/skills`, Acceptance criteria verification & code reviews (docs/reviews/)
- [debug](.agents/skills/debug/): `jsmastery-pro/skills`, Systematic root cause bug isolation & regression test flows
- [develop](.agents/skills/develop/): `jsmastery-pro/skills`, Feature implementation strictly adhering to specs & boundaries
- [document](.agents/skills/document/): `jsmastery-pro/skills`, PR text, changelogs, release notes & documentation sync
- [scope](.agents/skills/scope/): `jsmastery-pro/skills`, Product roadmap & feature slicing (docs/scope/)
- [sync](.agents/skills/sync/): `jsmastery-pro/skills`, Reconciles durable knowledge & specs with codebase changes
- [test](.agents/skills/test/): `jsmastery-pro/skills`, Automated test suite generation (Unit, Integration & E2E)

## Context files

- [Backend/AGENTS.md](Backend/AGENTS.md) (.NET 10 Modular Monolith backend architecture and conventions)
- [Frontend/agri-erp-workspace/AGENTS.md](Frontend/agri-erp-workspace/AGENTS.md) (Angular Nx Monorepo frontend design system and module structure)

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
