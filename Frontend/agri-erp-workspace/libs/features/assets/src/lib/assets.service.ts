import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface Asset {
    id: string;
    tenantId: string;
    name: string;
    assetNumber: string;
    category: string;
    purchaseDate: string;
    purchasePrice: number;
    usefulLifeMonths: number;
    remainingLifeMonths: number;
    accumulatedDepreciation: number;
    lastDepreciationDate?: string;
    currentRuntimeHours: number;
    currentOdometerKm: number;
    status: string;
}

export interface MaintenanceLog {
    id: string;
    tenantId: string;
    assetId: string;
    serviceType: string;
    serviceDate: string;
    cost: number;
    performedBy: string;
    description: string;
    runtimeHoursAtService?: number;
    odometerKmAtService?: number;
}

export interface DepreciationScheduleLine {
    monthIndex: number;
    date: string;
    monthlyDepreciation: number;
    accumulatedDepreciation: number;
    remainingBookValue: number;
}

@Injectable({ providedIn: 'root' })
export class AssetsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/assets`;

    createAsset(command: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, command);
    }

    getAssets(): Observable<Asset[]> {
        return this.http.get<Asset[]>(this.apiUrl);
    }

    logMaintenance(command: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/maintenance`, command);
    }

    getMaintenanceLogs(assetId: string): Observable<MaintenanceLog[]> {
        return this.http.get<MaintenanceLog[]>(`${this.apiUrl}/${assetId}/maintenance`);
    }

    runDepreciation(command: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/depreciate`, command);
    }

    getDepreciationSchedule(assetId: string): Observable<DepreciationScheduleLine[]> {
        return this.http.get<DepreciationScheduleLine[]>(`${this.apiUrl}/${assetId}/depreciation-schedule`);
    }
}
