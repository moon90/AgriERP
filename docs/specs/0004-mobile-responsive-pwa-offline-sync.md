# 0004. Mobile-Responsive PWA Offline Sync for Field Workers

**Date**: 2026-08-24  
**Status**: Proposed  

## Summary

This specification implements resilient offline storage and automated background synchronization for agricultural field workers operating in remote farm zones, valleys, and deep greenhouse tunnels with zero or intermittent cellular connectivity. Field operators can capture soil sample diagnostic logs, crop disease scouting notes, and animal health observations offline in IndexedDB, with automated synchronization and conflict-free replay once network access is restored.

---

## Context

Agricultural workers in large farm operations (hundreds of acres) routinely operate outside Wi-Fi or cellular coverage:
- Agronomists taking field soil samples cannot submit laboratory entries in real time.
- Field scouts spotting crop pest infestations or leaf rust need to capture observations on the spot rather than waiting to return to the central office.
- Losing unsubmitted field logs due to sudden network drops causes duplicate sampling and lost labor hours.

---

## Requirements

**User stories**:
- As a Field Agronomist, I want to record soil sample tests and scouting observations while offline in the field and have them saved securely on my device.
- As a Field Scout, I want a clear visual status indicator showing whether I am currently online or offline, along with the count of pending synced items.
- As a Farm Operations Manager, I want offline records to sync automatically without data loss or duplicate records once the device re-establishes internet connectivity.

**Acceptance criteria**:
- **AC-1**: `OfflineSyncService` detects network connectivity states (`online`/`offline`) via browser events and reactive Signals.
- **AC-2**: Offline mutation payloads (e.g. soil samples, veterinary records) are stored in local persistent storage (`IndexedDB` / structured storage) with unique transaction UUIDs and timestamps.
- **AC-3**: When connection is restored, the sync engine dispatches queued transactions sequentially to backend endpoints with HTTP idempotency headers.
- **AC-4**: A floating Dark Slate Glass **Sync Center & Offline Drawer** allows field workers to inspect queued changes, view sync history, trigger manual sync, and simulate offline testing mode.
- **AC-5**: Backend idempotency and bulk endpoints accept replayed transactions without duplicate entity creation.

---

## Options Considered

### Option 1: Client-Side Transaction Outbox with Reactive Background Sync (Recommended)
Store pending JSON mutations in a local persistent FIFO queue, intercept offline HTTP errors, and drain the queue sequentially upon `window.online` event or manual trigger.

**Pros**:
- Zero additional server-side infrastructure required.
- Full offline UX transparency: users see exactly what is queued.
- Completely compatible with existing ASP.NET Core CQRS endpoints and idempotency headers.

**Cons**:
- Potential conflict resolution needed if two field workers edit the same specific record concurrently (mitigated by append-only log model for scouting/sampling).

### Option 2: Full Service Worker BackgroundSync API
Use experimental browser Service Worker `BackgroundSync` event.

**Pros**:
- Can sync even when the web tab is closed.

**Cons**:
- Inconsistent browser support on iOS Safari.

---

## Decision

**Chosen option**: Option 1: Client-Side Transaction Outbox with Reactive Background Sync.

---

## Feature Design

### Local Storage Schema (`agrierp_offline_outbox`)

```typescript
export interface QueuedSyncItem {
    id: string;
    action: string;
    endpoint: string;
    method: 'POST' | 'PUT' | 'DELETE';
    payload: any;
    queuedAt: string;
    status: 'Pending' | 'Syncing' | 'Failed' | 'Synced';
    retryCount: number;
}
```

---

## Build Plan

- [ ] **Milestone 1: Angular Offline Storage & Sync Engine (AC-1, AC-2, AC-3)**
  - Create `OfflineSyncService` in `libs/core/services/offline-sync.service.ts` with network listeners, outbox queue, and automatic retry sync.
- [ ] **Milestone 2: Modern Dark Slate Glass Field Sync Drawer UI (AC-4)**
  - Build `FieldSyncCenterComponent` with connection status pills (`🟢 Online - Synced`, `🟡 Offline - Queued`), pending items inspector, and manual sync action.
  - Integrate floating sync badge into `MainLayoutComponent`.
- [ ] **Milestone 3: Offline Soil & Scouting Integration (AC-5)**
  - Connect `AgronomyComponent` to route submissions through `OfflineSyncService` when offline.
- [ ] **Milestone 4: Verification & Automated Tests**
  - Run `/check verify` against `AC-1..5`.
  - Auto-generate xUnit / Jasmine unit test suite under `/test`.
