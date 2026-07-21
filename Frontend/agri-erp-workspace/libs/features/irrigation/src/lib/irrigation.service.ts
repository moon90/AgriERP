import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface WaterSource {
    id: string;
    sourceName: string;
    permitNumber: string;
    maxAllocatedGallons: number;
    usedGallons: number;
    compliancePercentage: number;
    status: string;
}

export interface WaterUsageLog {
    id: string;
    waterSourceId: string;
    sourceName: string;
    fieldId: string;
    gallonsPumped: number;
    flowRateGpm: number;
    irrigationDate: string;
    notes: string;
}

export interface WaterBilling {
    id: string;
    waterSourceId: string;
    sourceName: string;
    gallonsUsed: number;
    costPerGallon: number;
    amount: number;
    billingDate: string;
}

export interface WaterPortfolio {
    sources: WaterSource[];
    logs: WaterUsageLog[];
    billings: WaterBilling[];
    totalUtilityExpenses: number;
}

@Injectable({ providedIn: 'root' })
export class IrrigationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/irrigation`;

    createSource(command: {
        sourceName: string;
        permitNumber: string;
        maxAllocatedGallons: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/sources`, command);
    }

    logTelemetry(command: {
        waterSourceId: string;
        fieldId: string;
        gallonsPumped: number;
        flowRateGpm: number;
        costPerGallon: number;
        irrigationDate: string;
        notes: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/telemetry`, command);
    }

    getPortfolio(): Observable<WaterPortfolio> {
        return this.http.get<WaterPortfolio>(`${this.apiUrl}/portfolio`);
    }
}
