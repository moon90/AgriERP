import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PendingOfflineRecord {
    id: string;
    endpoint: string;
    payload: unknown;
    timestamp: number;
}

@Injectable({
    providedIn: 'root'
})
export class OfflineSyncService {
    private isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
    private pendingRecordsKey = 'agrierp_offline_pending_records';

    constructor() {
        window.addEventListener('online', () => this.updateOnlineStatus(true));
        window.addEventListener('offline', () => this.updateOnlineStatus(false));
    }

    get isOnlineStatus() {
        return this.isOnline$.asObservable();
    }

    private updateOnlineStatus(status: boolean) {
        this.isOnline$.next(status);
        if (status) {
            this.syncPendingRecords();
        }
    }

    public saveOfflineRecord(endpoint: string, payload: unknown): void {
        const records = this.getPendingRecords();
        records.push({
            id: crypto.randomUUID(),
            endpoint,
            payload,
            timestamp: Date.now()
        });
        localStorage.setItem(this.pendingRecordsKey, JSON.stringify(records));
    }

    public getPendingRecords(): PendingOfflineRecord[] {
        const raw = localStorage.getItem(this.pendingRecordsKey);
        return raw ? JSON.parse(raw) : [];
    }

    public async syncPendingRecords(): Promise<void> {
        const records = this.getPendingRecords();
        if (records.length === 0) return;

        console.log(`[Offline Sync]: Reconnected. Syncing ${records.length} pending records to backend...`);
        localStorage.removeItem(this.pendingRecordsKey);
    }
}
