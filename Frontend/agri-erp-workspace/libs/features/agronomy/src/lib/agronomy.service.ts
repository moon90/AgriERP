import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface SoilSample {
    id: string;
    fieldId: string;
    sampleCode: string;
    sampleDate: string;
    labName: string;
    phLevel: number;
    nitrogenPpm: number;
    phosphorusPpm: number;
    potassiumPpm: number;
    organicMatterPercentage: number;
}

export interface AgronomyRecommendation {
    id: string;
    soilSampleId: string;
    sampleCode: string;
    recommendedFertilizerType: string;
    targetApplicationRate: number;
    recommendationDate: string;
    agronomistName: string;
    notes: string;
}

export interface LabTestingBilling {
    id: string;
    soilSampleId: string;
    sampleCode: string;
    testFee: number;
    billingDate: string;
}

export interface SoilInsights {
    samples: SoilSample[];
    recommendations: AgronomyRecommendation[];
    billings: LabTestingBilling[];
    totalLabExpenses: number;
}

@Injectable({ providedIn: 'root' })
export class AgronomyService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/agronomy`;

    recordSample(command: {
        fieldId: string;
        sampleCode: string;
        sampleDate: string;
        labName: string;
        phLevel: number;
        nitrogenPpm: number;
        phosphorusPpm: number;
        potassiumPpm: number;
        organicMatterPercentage: number;
        testFee: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/samples`, command);
    }

    addRecommendation(command: {
        soilSampleId: string;
        recommendedFertilizerType: string;
        targetApplicationRate: number;
        recommendationDate: string;
        agronomistName: string;
        notes: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/recommendations`, command);
    }

    getInsights(): Observable<SoilInsights> {
        return this.http.get<SoilInsights>(`${this.apiUrl}/insights`);
    }
}
