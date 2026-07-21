import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface Elevator {
    id: string;
    tenantId: string;
    name: string;
    capacityTons: number;
    currentStoredTons: number;
    rentalRatePerTonPerDay: number;
    utilizationPercentage: number;
}

export interface WeighbridgeTicket {
    id: string;
    tenantId: string;
    ticketNumber: string;
    elevatorId: string;
    vehicleNumber: string;
    grossWeightTons: number;
    tareWeightTons: number;
    netWeightTons: number;
    moisturePercentage: number;
    impurityPercentage: number;
    finalBillableWeightTons: number;
    contractClientId?: string;
    ticketDate: string;
    status: string;
}

export interface StorageAnalytics {
    elevators: Elevator[];
    totalBilledRevenue: number;
    pendingBillingTicketsCount: number;
}

@Injectable({ providedIn: 'root' })
export class LogisticsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/logistics`;

    createElevator(command: { name: string; capacityTons: number; rentalRatePerTonPerDay: number }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/elevators`, command);
    }

    createTicket(command: {
        ticketNumber: string;
        elevatorId: string;
        vehicleNumber: string;
        grossWeightTons: number;
        tareWeightTons: number;
        moisturePercentage: number;
        impurityPercentage: number;
        contractClientId?: string;
        ticketDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/tickets`, command);
    }

    getTickets(): Observable<WeighbridgeTicket[]> {
        return this.http.get<WeighbridgeTicket[]>(`${this.apiUrl}/tickets`);
    }

    calculateCharge(command: { weighbridgeTicketId: string; daysStored: number; chargeDate: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/charges`, command);
    }

    getAnalytics(): Observable<StorageAnalytics> {
        return this.http.get<StorageAnalytics>(`${this.apiUrl}/analytics`);
    }
}
