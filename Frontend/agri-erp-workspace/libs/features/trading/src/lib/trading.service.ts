import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface SalesContract {
    id: string;
    contractNumber: string;
    customerClientId: string;
    cropType: string;
    contractPricePerTon: number;
    quantityTons: number;
    deliveredQuantityTons: number;
    compliancePercentage: number;
    status: string;
}

export interface HedgePosition {
    id: string;
    symbol: string;
    type: string;
    quantityContracts: number;
    entryPricePerTon: number;
    exitPricePerTon?: number;
    currentMarketPricePerTon: number;
    pnl: number;
    status: string;
}

export interface TradingPortfolio {
    salesContracts: SalesContract[];
    openHedges: HedgePosition[];
    closedHedges: HedgePosition[];
    totalRealizedPnl: number;
}

@Injectable({ providedIn: 'root' })
export class TradingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/trading`;

    createContract(command: {
        contractNumber: string;
        customerClientId: string;
        cropType: string;
        contractPricePerTon: number;
        quantityTons: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/contracts`, command);
    }

    deliverContract(command: {
        salesContractId: string;
        deliveredTons: number;
        deliveryDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/contracts/deliver`, command);
    }

    openHedge(command: {
        symbol: string;
        type: string;
        quantityContracts: number;
        entryPricePerTon: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/hedges/open`, command);
    }

    closeHedge(command: {
        hedgingPositionId: string;
        exitPricePerTon: number;
        closeDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/hedges/close`, command);
    }

    getPortfolio(): Observable<TradingPortfolio> {
        return this.http.get<TradingPortfolio>(`${this.apiUrl}/portfolio`);
    }
}
