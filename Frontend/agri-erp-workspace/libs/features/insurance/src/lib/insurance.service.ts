import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface InsurancePolicy {
    id: string;
    policyNumber: string;
    providerName: string;
    coverageAmount: number;
    premiumAmount: number;
    startDate: string;
    endDate: string;
    fieldId: string;
}

export interface LossClaim {
    id: string;
    insurancePolicyId: string;
    policyNumber: string;
    claimNumber: string;
    incidentDate: string;
    claimAmount: number;
    adjustedAmount: number;
    status: string;
    description: string;
}

export interface InsurancePremiumBilling {
    id: string;
    insurancePolicyId: string;
    policyNumber: string;
    premiumFee: number;
    billingDate: string;
}

export interface InsuranceAnalytics {
    policies: InsurancePolicy[];
    claims: LossClaim[];
    billings: InsurancePremiumBilling[];
    totalCoverageAmount: number;
    totalPremiumsPaid: number;
    totalClaimsRecovered: number;
}

@Injectable({ providedIn: 'root' })
export class InsuranceService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/insurance`;

    createPolicy(command: {
        policyNumber: string;
        providerName: string;
        coverageAmount: number;
        premiumAmount: number;
        startDate: string;
        endDate: string;
        fieldId: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/policies`, command);
    }

    submitClaim(command: {
        insurancePolicyId: string;
        claimNumber: string;
        incidentDate: string;
        claimAmount: number;
        description: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/claims`, command);
    }

    settleClaim(command: {
        lossClaimId: string;
        payoutAmount: number;
        settlementDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/claims/settle`, command);
    }

    getAnalytics(): Observable<InsuranceAnalytics> {
        return this.http.get<InsuranceAnalytics>(`${this.apiUrl}/analytics`);
    }
}
