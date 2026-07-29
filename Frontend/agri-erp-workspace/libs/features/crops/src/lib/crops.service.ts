import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

export interface FieldPlot {
    id?: string;
    cropFieldId: string;
    name: string;
    areaAcres: number;
    gpsLatitude?: number;
    gpsLongitude?: number;
    soilType?: string;
}

export interface HarvestRecord {
    id?: string;
    cropCycleId: string;
    harvestDate: string;
    yieldBushels: number;
    moisturePercent: number;
    qualityGrade?: string;
    notes?: string;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
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

    getFieldsPaged(params: { pageNumber?: number; pageSize?: number; search?: string; sortOrder?: string }): Observable<PagedResult<CropField>> {
        let httpParams = new HttpParams();
        if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber);
        if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
        if (params.search) httpParams = httpParams.set('search', params.search);
        if (params.sortOrder) httpParams = httpParams.set('sortOrder', params.sortOrder);

        return this.http.get<PagedResult<CropField>>(`${this.apiUrl}/fields`, { params: httpParams });
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

    getPlots(): Observable<FieldPlot[]> {
        return this.http.get<FieldPlot[]>(`${this.apiUrl}/plots`);
    }

    createPlot(plot: FieldPlot): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/plots`, plot);
    }

    getHarvestRecords(): Observable<HarvestRecord[]> {
        return this.http.get<HarvestRecord[]>(`${this.apiUrl}/harvest-records`);
    }

    createHarvestRecord(record: HarvestRecord): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/harvest-records`, record);
    }
}
