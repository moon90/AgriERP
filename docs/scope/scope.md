# Scope: AgriERP

Enterprise Agriculture, Livestock, and Farm Management SaaS Platform for end-to-end farm operations, IoT telemetry, supply chain logistics, and agronomy financial accounting.

**Build approach:** Tracer Bullet (Vertical end-to-end slices through Domain, Application, Presentation, and Angular UI).  
**Workflow:** Beta (After `/develop`, run `/check verify` then `/test`). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· GA`) to do more or less.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Modular Monolith & Clean Architecture Core | Foundation | existing |
| 2 | Dark Slate Glassmorphism Design System | Foundation | existing |
| 3 | Authentication & RBAC Access Control | Foundation | existing |
| 4 | Crop Lifecycle Management & Yield Forecasting | Operations | existing |
| 5 | Livestock & Animal Herd Health Tracking | Operations | existing |
| 6 | Warehouse Stock & Inventory Management | Operations | existing |
| 7 | Procurement & Purchase Orders | Operations | existing |
| 8 | Sales Orders & Customer Contracts | Operations | existing |
| 9 | Machinery, Fleet & Equipment Maintenance | Resources | existing |
| 10 | Human Resources, Attendance & Payroll | Resources | existing |
| 11 | Agronomy Soil Chemistry & Recommendations | Field Science | existing |
| 12 | Hazardous Chemicals, Spray Logs & REI Safety | Field Science | existing |
| 13 | Weather Telemetry Towers & Frost Alarms | Field Science | existing |
| 14 | Irrigation Water Permits & Pump Telemetry | Field Science | existing |
| 15 | Land Leases, Cash Rent & Sharecrop Ledgers | Land & Property | existing |
| 16 | Grain Silos, Weighbridge Logistics & Storage | Supply Chain | existing |
| 17 | Futures Hedging & Forward Sales Trading Board | Market Trading | existing |
| 18 | Crop Insurance Policies, Claims & Payouts | Risk Management | existing |
| 19 | General Ledger, Journal Entries & Financials | Finance | existing |
| 20 | Real-time IoT Edge Telemetry WebSocket Streaming | Next Slices | done |
| 21 | Automated Veterinary Vaccination & Breeding Scheduler | Next Slices | done |
| 22 | Multi-tenant Farm Organization Data Isolation | Next Slices | planned |
| 23 | Mobile-Responsive PWA Offline Sync for Field Workers | Next Slices | planned |

---

## Foundations

### 1. Modular Monolith & Clean Architecture Core · existing
Decoupled modular architecture with ASP.NET Core Web API, MediatR CQRS, and EF Core SQL Server.
**Done when:** All domain modules are partitioned with clean boundaries, MediatR handlers, and outbox event dispatching.
Code in `Backend/src/`

### 2. Dark Slate Glassmorphism Design System · existing
Standardized dark slate glass design system across all 15 Angular frontend modules.
**Done when:** All container cards use `rgba(15, 23, 42, 0.6)`, `.btn-primary`, `.btn-secondary`, `.modern-table`, and `.badge-pill`.
Code in `Frontend/agri-erp-workspace/src/styles.scss`

### 3. Authentication & RBAC Access Control · existing
JWT-based authentication with role-based permission matrix and security filters.
**Done when:** Users can authenticate, manage user accounts, and assign fine-grained module permission codes.
Code in `Backend/src/Auth/` & `Frontend/agri-erp-workspace/src/app/pages/users/`

---

## Operations & Farm Management

### 4. Crop Lifecycle Management & Yield Forecasting · existing
Field plot registry, crop cycle tracking, WIP treatment capitalization, and dynamic yield predictions.
**Done when:** Farmers can register field plots, start growing cycles, log tilling/fertilizer treatments, and record harvest yields.
Code in `Backend/src/Crops/` & `Frontend/agri-erp-workspace/libs/features/crops/`

### 5. Livestock & Animal Herd Health Tracking · existing
Animal inventory roster, biometric records, quarantine management, and feed logs.
**Done when:** Ranchers can track cattle/livestock head counts, medical histories, and active health status.
Code in `Backend/src/Livestock/` & `Frontend/agri-erp-workspace/libs/features/livestock/`

### 6. Warehouse Stock & Inventory Management · existing
Multi-location inventory tracking, stock movements, and low stock threshold alerts.
**Done when:** Warehouse managers can view stock levels, receive goods, and transfer quantities across locations.
Code in `Backend/src/Inventory/` & `Frontend/agri-erp-workspace/libs/features/inventory/`

### 7. Procurement & Purchase Orders · existing
Vendor purchase orders, line item costs, PO status approvals, and warehouse receipts.
**Done when:** Purchasing teams can draft POs, approve contracts, and receive shipments into inventory.
Code in `Backend/src/Inventory/` & `Frontend/agri-erp-workspace/libs/features/inventory/src/lib/procurement/`

### 8. Sales Orders & Customer Contracts · existing
Sales order pipeline, fulfillment workflows, and post-shipment COGS depletions.
**Done when:** Sales teams can draft sales orders, approve shipments, and deduct inventory upon fulfillment.
Code in `Backend/src/Inventory/` & `Frontend/agri-erp-workspace/libs/features/inventory/src/lib/sales/`

---

## Resources & Farm Equipment

### 9. Machinery, Fleet & Equipment Maintenance · existing
Farm equipment roster, depreciation calculations, repair work orders, and service logs.
**Done when:** Fleet managers can log vehicle maintenance, track service histories, and monitor asset book values.
Code in `Backend/src/Assets/` & `Frontend/agri-erp-workspace/libs/features/assets/`

### 10. Human Resources, Attendance & Payroll · existing
Employee directory, attendance logging, tax deductions, and payroll disbursement.
**Done when:** HR managers can onboard staff, record attendance records, and compute payroll periods.
Code in `Backend/src/HR/` & `Frontend/agri-erp-workspace/libs/features/hr/`

---

## Field Science & Telemetry

### 11. Agronomy Soil Chemistry & Recommendations · existing
Soil test sample logs, NPK nutrient analysis, and automated crop advisory recommendations.
**Done when:** Agronomists can record soil chemistry data and issue treatment recommendations.
Code in `Backend/src/Agronomy/` & `Frontend/agri-erp-workspace/libs/features/agronomy/`

### 12. Hazardous Chemicals, Spray Logs & REI Safety · existing
Pesticide registration, application logs, and Worker Restricted Entry Interval (REI) active timers.
**Done when:** Field managers can log chemical sprays and observe real-time REI safety restriction alerts.
Code in `Backend/src/Chemicals/` & `Frontend/agri-erp-workspace/libs/features/chemicals/`

### 13. Weather Telemetry Towers & Frost Alarms · existing
Weather station telemetry feeds, temperature/humidity thresholds, and frost warning triggers.
**Done when:** Weather towers capture environmental readings and flag sub-zero frost risks.
Code in `Backend/src/Weather/` & `Frontend/agri-erp-workspace/libs/features/weather/`

### 14. Irrigation Water Permits & Pump Telemetry · existing
Water rights permit quotas, pump telemetry simulators, and utility allocation ledgers.
**Done when:** Irrigation managers can monitor water usage against annual volume quotas.
Code in `Backend/src/Irrigation/` & `Frontend/agri-erp-workspace/libs/features/irrigation/`

---

## Land, Supply Chain & Market Execution

### 15. Land Leases, Cash Rent & Sharecrop Ledgers · existing
Landlord lease agreements, cash rent terms, and sharecrop percentage payout calculators.
**Done when:** Land managers can track lease contracts, calculate harvest payouts, and record payment ledgers.
Code in `Backend/src/Land/` & `Frontend/agri-erp-workspace/libs/features/land/`

### 16. Grain Silos, Weighbridge Logistics & Storage · existing
Silo facility capacity tracking, inbound weighbridge moisture/impurity tickets, and storage rental ledger.
**Done when:** Logistics operators can log truck weights, compute quality shrink, and post daily storage rental invoices.
Code in `Backend/src/Logistics/` & `Frontend/agri-erp-workspace/libs/features/logistics/`

### 17. Futures Hedging & Forward Sales Trading Board · existing
Forward commodity sales contracts, short/long futures hedging board, and mark-to-market PnL tracking.
**Done when:** Grain traders can hedge crop prices with futures contracts and realize trading PnL upon closure.
Code in `Backend/src/Trading/` & `Frontend/agri-erp-workspace/libs/features/trading/`

### 18. Crop Insurance Policies, Claims & Payouts · existing
Crop insurance policy coverage, loss incident damage claims, adjuster assessments, and settlement payouts.
**Done when:** Farm operators can submit insurance claims, track adjuster reviews, and record indemnity payouts.
Code in `Backend/src/Insurance/` & `Frontend/agri-erp-workspace/libs/features/insurance/`

### 19. General Ledger, Journal Entries & Financials · existing
Double-entry general ledger, chart of accounts, journal entries, and income statements.
**Done when:** Finance teams can inspect debit/credit ledgers, view profit & loss summaries, and export balance sheets.
Code in `Backend/src/Finance/` & `Frontend/agri-erp-workspace/libs/features/finance/`

---

## Next Slices (Planned Pipeline)

### 20. Real-time IoT Edge Telemetry WebSocket Streaming · done
Stream live sensor telemetry (soil moisture, greenhouse climate, animal vital signs) via SignalR/WebSockets.
**Done when:** Telemetry dashboard updates in real-time without page polling, with automated audio/visual threshold alarms.
- [x] Design it (spec): [docs/specs/0001-real-time-iot-telemetry-streaming.md](../specs/0001-real-time-iot-telemetry-streaming.md)
- [x] Build it: `/develop real-time IoT edge telemetry websocket streaming`
   - [x] Backend SignalR Hub & Background Simulation Publisher (AC-1, AC-2, AC-3)
   - [x] Frontend SignalR Streaming Service & Connection State (AC-4)
   - [x] Modern Dark Slate Glass Telemetry Dashboard UI (AC-5)
- [x] Verify it: `/check verify real-time IoT edge telemetry websocket streaming`
- [x] Test it: `/test real-time IoT edge telemetry websocket streaming`
Spec 0001 · code in `Backend/src/Host/AgriERP.Api/Hubs/` & `Frontend/agri-erp-workspace/libs/features/telemetry/`

### 21. Automated Veterinary Vaccination & Breeding Scheduler · done
Rule-based notification engine for animal gestation milestones, mandatory vaccination boosters, and vet visits.
**Done when:** Herd managers receive automated calendar alerts and task lists for upcoming animal health interventions.
- [x] Design it (spec): [docs/specs/0002-automated-veterinary-vaccination-and-breeding-scheduler.md](../specs/0002-automated-veterinary-vaccination-and-breeding-scheduler.md)
- [x] Build it: `/develop automated veterinary vaccination & breeding scheduler`
   - [x] Backend CQRS Handlers & Controller Endpoints (AC-1, AC-2, AC-3, AC-4)
   - [x] Frontend Angular Veterinary & Breeding Services (AC-5)
   - [x] Modern Dark Glass Veterinary & Breeding UI (AC-5)
- [x] Verify it: `/check verify automated veterinary vaccination & breeding scheduler`
- [x] Test it: `/test automated veterinary vaccination & breeding scheduler`
Spec 0002 · code in `Backend/src/Livestock/` & `Frontend/agri-erp-workspace/libs/features/livestock/`

### 22. Multi-tenant Farm Organization Data Isolation · needs a decision · GA
Row-level tenant isolation, multi-tenant database partitioning, and enterprise organization switching.
**Done when:** Multiple independent agricultural enterprises can securely manage separate farm operations on the same platform.
- [ ] Design it (spec): `/architect multi-tenant farm organization data isolation`

### 23. Mobile-Responsive PWA Offline Sync for Field Workers · needs a decision
Progressive Web App support with IndexedDB local caching and background sync for offline field data entry.
**Done when:** Field workers without cellular connectivity can log spray treatments, soil samples, and animal observations offline and sync upon reconnect.
- [ ] Design it (spec): `/architect mobile-responsive PWA offline sync for field workers`

---

## Deferred

Out of scope for the current build pass, kept so the plan stays honest:
- **Satellite Multispectral NDVI Imagery Ingestion**: Automated vegetation index calculation from Sentinel-2 satellite data · needs a decision
- **Drone Spraying Autonomous Flight Route Planner**: Waypoint generation for autonomous agricultural drones · needs a decision
- **Commodity Exchange Automated Broker API Gateway**: Direct API execution with CME/CBOT grain markets · needs a decision · GA

---

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally), so skills locate it by that `(spec)` suffix.

| State | Set by | The feature shows |
|---|---|---|
| `existing` | `/scope` | Pre-existing code built before the workflow |
| `planned` | `/scope` | Entry command (e.g. `/architect`) |
| `in-progress` | `/develop` | Spec link + milestone checklist |
| `done` | `/develop` / `/test` | Spec link + code path + completed milestones |
| `dropped` | `/scope` | Cross-out and note why it was removed |
