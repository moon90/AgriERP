import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineSyncService } from '../../../../libs/core/services/offline-sync.service';

@Component({
    selector: 'app-field-sync-center',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Floating Sync Center Trigger Pill -->
    <div style="position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: var(--font-sans);">
      
      <button (click)="isOpen = !isOpen"
              [style.background]="syncService.effectiveOnline() ? 'rgba(15, 23, 42, 0.9)' : 'rgba(245, 158, 11, 0.2)'"
              [style.border]="syncService.effectiveOnline() ? '1px solid var(--border-glass)' : '1px solid rgba(245, 158, 11, 0.5)'"
              style="border-radius: 9999px; padding: 10px 18px; color: #ffffff; display: flex; align-items: center; gap: 10px; cursor: pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.5); backdrop-filter: blur(12px); font-size: 0.85rem; font-weight: 600; transition: all 0.2s;">
        
        <!-- Status Indicator Dot -->
        <span [style.background]="syncService.effectiveOnline() ? 'var(--primary-emerald)' : 'var(--accent-amber)'"
              style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px currentColor; animation: pulse 2s infinite;"></span>
        
        <span *ngIf="syncService.effectiveOnline() && !syncService.isSyncing()">🟢 Cloud Synced</span>
        <span *ngIf="syncService.isSyncing()" style="color: var(--accent-blue);">⚡ Syncing ({{ syncService.pendingCount() }})...</span>
        <span *ngIf="!syncService.effectiveOnline()" style="color: var(--accent-amber);">
          🟡 Offline ({{ syncService.pendingCount() }} Queued)
        </span>

        <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 9999px;">
          {{ syncService.queuedItems().length }}
        </span>
      </button>

      <!-- Slide-Up / Modal Glass Drawer -->
      <div *ngIf="isOpen"
           style="position: absolute; bottom: 55px; right: 0; width: 440px; max-width: 90vw; background: rgba(15, 23, 42, 0.95); border: 1px solid var(--border-glass); border-radius: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.6); backdrop-filter: blur(20px); overflow: hidden; padding: 1.25rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem; margin-bottom: 1rem;">
          <div>
            <h4 style="margin: 0; color: #ffffff; font-size: 1.1rem; font-weight: 700;">📡 PWA Field Sync Center</h4>
            <span style="font-size: 0.75rem; color: var(--text-muted);">IndexedDB Outbox & Remote Sync Engine</span>
          </div>
          <button (click)="isOpen = false" style="background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 1.1rem;">✕</button>
        </div>

        <!-- Offline Simulator Control & Force Sync -->
        <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid var(--border-glass); border-radius: 10px; padding: 10px 12px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 0.85rem; font-weight: 600; color: #ffffff;">Simulate Field Offline</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Test low-connectivity behavior</div>
          </div>
          <button (click)="syncService.toggleSimulatedOffline()"
                  [style.background]="syncService.isSimulatedOffline() ? 'var(--accent-rose)' : 'rgba(255,255,255,0.1)'"
                  style="border: 1px solid var(--border-glass); color: #ffffff; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
            {{ syncService.isSimulatedOffline() ? '🔴 Offline Mode ON' : '⚪ Live Online' }}
          </button>
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
          <button (click)="syncService.syncAll()"
                  [disabled]="!syncService.effectiveOnline() || syncService.isSyncing()"
                  class="btn-primary" style="flex: 1; padding: 6px 12px; font-size: 0.8rem; justify-content: center;">
            ⚡ Force Cloud Sync Now
          </button>
          <button (click)="syncService.clearSynced()" class="btn-secondary" style="padding: 6px 12px; font-size: 0.8rem;">
            🧹 Clear Synced
          </button>
        </div>

        <!-- Queued Transactions List -->
        <div style="max-height: 250px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
          <div *ngFor="let item of syncService.queuedItems()"
               style="background: rgba(30, 41, 59, 0.5); border: 1px solid var(--border-glass); border-radius: 8px; padding: 8px 10px; font-size: 0.8rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="color: #ffffff;">{{ item.action }}</strong>
              <span *ngIf="item.status === 'Synced'" class="badge-pill badge-emerald" style="font-size: 0.65rem;">✅ Synced</span>
              <span *ngIf="item.status === 'Pending'" class="badge-pill badge-amber" style="font-size: 0.65rem;">⏳ Pending</span>
              <span *ngIf="item.status === 'Syncing'" class="badge-pill badge-blue" style="font-size: 0.65rem;">⚡ Syncing</span>
              <span *ngIf="item.status === 'Failed'" class="badge-pill badge-rose" style="font-size: 0.65rem;">⚠️ Failed</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.7rem;">
              <span>{{ item.endpoint }}</span>
              <span>{{ item.queuedAt | date:'shortTime' }}</span>
            </div>
          </div>

          <div *ngIf="syncService.queuedItems().length === 0" style="text-align: center; color: var(--text-muted); padding: 1.5rem; font-size: 0.85rem;">
            No pending outbox transactions. All field logs are synchronized.
          </div>
        </div>

      </div>

    </div>
  `
})
export class FieldSyncCenterComponent {
    syncService = inject(OfflineSyncService);
    isOpen = false;
}
