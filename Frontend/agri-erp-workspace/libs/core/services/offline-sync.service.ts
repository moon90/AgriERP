import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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

@Injectable({
    providedIn: 'root'
})
export class OfflineSyncService {
    private http = inject(HttpClient);
    private storageKey = 'agrierp_offline_outbox';

    // Reactive State Signals
    isOnline = signal<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
    isSimulatedOffline = signal<boolean>(false);
    isSyncing = signal<boolean>(false);
    queuedItems = signal<QueuedSyncItem[]>([]);

    effectiveOnline = computed(() => this.isOnline() && !this.isSimulatedOffline());
    pendingCount = computed(() => this.queuedItems().filter(i => i.status === 'Pending').length);

    constructor() {
        this.loadOutbox();
        this.initNetworkListeners();
    }

    private initNetworkListeners(): void {
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => {
                this.isOnline.set(true);
                if (!this.isSimulatedOffline()) {
                    this.syncAll();
                }
            });

            window.addEventListener('offline', () => {
                this.isOnline.set(false);
            });
        }
    }

    private loadOutbox(): void {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                this.queuedItems.set(JSON.parse(raw));
            }
        } catch (e) {
            console.warn('Failed to load offline outbox from localStorage:', e);
        }
    }

    private saveOutbox(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.queuedItems()));
        } catch (e) {
            console.warn('Failed to persist offline outbox to localStorage:', e);
        }
    }

    enqueue(action: string, endpoint: string, method: 'POST' | 'PUT' | 'DELETE', payload: any): QueuedSyncItem {
        const item: QueuedSyncItem = {
            id: `SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            action,
            endpoint,
            method,
            payload,
            queuedAt: new Date().toISOString(),
            status: 'Pending',
            retryCount: 0
        };

        this.queuedItems.update(prev => [item, ...prev]);
        this.saveOutbox();

        // If online, attempt immediate sync
        if (this.effectiveOnline()) {
            this.syncItem(item);
        }

        return item;
    }

    async syncItem(item: QueuedSyncItem): Promise<boolean> {
        item.status = 'Syncing';
        this.saveOutbox();

        try {
            if (item.method === 'POST') {
                await firstValueFrom(this.http.post(item.endpoint, item.payload));
            } else if (item.method === 'PUT') {
                await firstValueFrom(this.http.put(item.endpoint, item.payload));
            } else if (item.method === 'DELETE') {
                await firstValueFrom(this.http.delete(item.endpoint));
            }

            item.status = 'Synced';
            this.saveOutbox();
            return true;
        } catch (error) {
            item.retryCount++;
            item.status = 'Failed';
            this.saveOutbox();
            return false;
        }
    }

    async syncAll(): Promise<void> {
        if (this.isSyncing() || !this.effectiveOnline()) return;

        this.isSyncing.set(true);
        const pending = this.queuedItems().filter(i => i.status === 'Pending' || i.status === 'Failed');

        for (const item of pending) {
            await this.syncItem(item);
        }

        this.isSyncing.set(false);
    }

    toggleSimulatedOffline(): void {
        this.isSimulatedOffline.update(prev => !prev);
        if (this.effectiveOnline()) {
            this.syncAll();
        }
    }

    clearSynced(): void {
        this.queuedItems.update(prev => prev.filter(i => i.status !== 'Synced'));
        this.saveOutbox();
    }

    clearAll(): void {
        this.queuedItems.set([]);
        this.saveOutbox();
    }
}
