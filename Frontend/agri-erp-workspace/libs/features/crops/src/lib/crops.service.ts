import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface CropField {
    id: string;
    tenantId: string;
    name: string;
    areaAcres: number;
    soilType: string;
}

export interface CropCycle {
    id: string;
    fieldName: string;
    cropType: string;
    cropVariety: string;
    status: string;
    plantingDate: string;
    harvestDate?: string;
    expectedYieldTons: number;
    actualYieldTons?: number;
    accumulatedWipCost: number;
    costPerExpectedTon: number;
    costPerActualTon?: number;
}

@Injectable({ providedIn: 'root' })
export class CropsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/crops`;

    createField(command: { name: string; areaAcres: number; soilType: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/fields`, command);
    }

    getFields(): Observable<CropField[]> {
        return this.http.get<CropField[]>(`${this.apiUrl}/fields`);
    }

    createCycle(command: { fieldId: string; cropType: string; cropVariety: string; plantingDate: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/cycles`, command);
    }

    getCycles(): Observable<CropCycle[]> {
        return this.http.get<CropCycle[]>(`${this.apiUrl}/cycles`);
    }

    logActivity(command: {
        cropCycleId: string;
        activityType: string;
        activityDate: string;
        cost: number;
        inputMaterialId?: string;
        inputQuantity?: number;
        notes: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/cycles/activity`, command);
    }

    harvestCycle(command: { cropCycleId: string; harvestDate: string; actualYieldTons: number }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/cycles/harvest`, command);
    }
}
