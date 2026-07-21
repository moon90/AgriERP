import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface ChemicalProduct {
    id: string;
    productName: string;
    registrationNumber: string;
    safetyIntervalHours: number;
    stockQuantityLiters: number;
    costPerLiter: number;
    totalStockValue: number;
}

export interface ApplicationLog {
    id: string;
    chemicalProductId: string;
    productName: string;
    registrationNumber: string;
    fieldId: string;
    quantityAppliedLiters: number;
    areaTreatedAcres: number;
    dosagePerAcre: number;
    applicationDate: string;
    safetyIntervalExpiry: string;
    isCurrentlyRestricted: boolean;
    notes: string;
}

export interface ChemicalAnalytics {
    products: ChemicalProduct[];
    logs: ApplicationLog[];
    totalTreatmentExpenses: number;
    activeRestrictedFieldsCount: number;
}

@Injectable({ providedIn: 'root' })
export class ChemicalsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/chemicals`;

    createProduct(command: {
        productName: string;
        registrationNumber: string;
        safetyIntervalHours: number;
        stockQuantityLiters: number;
        costPerLiter: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/products`, command);
    }

    logApplication(command: {
        chemicalProductId: string;
        fieldId: string;
        quantityAppliedLiters: number;
        areaTreatedAcres: number;
        applicationDate: string;
        notes: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/applications`, command);
    }

    getAnalytics(): Observable<ChemicalAnalytics> {
        return this.http.get<ChemicalAnalytics>(`${this.apiUrl}/analytics`);
    }
}
