import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface LandLease {
    id: string;
    leaseNumber: string;
    landlordName: string;
    fieldId: string;
    leaseType: string; // CashRent, Sharecrop
    cashRentPerAcre: number;
    areaAcres: number;
    landlordSharePercentage: number;
    contractStartDate: string;
    contractEndDate: string;
    status: string;
}

export interface LeasePayment {
    id: string;
    landLeaseId: string;
    leaseNumber: string;
    landlordName: string;
    paymentType: string;
    amount: number;
    calculationDetails: string;
    paymentDate: string;
    isPaid: boolean;
}

export interface LandPortfolio {
    leases: LandLease[];
    payments: LeasePayment[];
    totalRentExpenses: number;
    totalSharecropExpenses: number;
}

@Injectable({ providedIn: 'root' })
export class LandService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/landlease`;

    createLease(command: {
        leaseNumber: string;
        landlordName: string;
        fieldId: string;
        leaseType: string;
        cashRentPerAcre: number;
        areaAcres: number;
        landlordSharePercentage: number;
        contractStartDate: string;
        contractEndDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/leases`, command);
    }

    calculatePayment(command: {
        landLeaseId: string;
        actualYieldTons: number | null;
        cropPricePerTon: number | null;
        paymentDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/payments`, command);
    }

    getPortfolio(): Observable<LandPortfolio> {
        return this.http.get<LandPortfolio>(`${this.apiUrl}/portfolio`);
    }
}
