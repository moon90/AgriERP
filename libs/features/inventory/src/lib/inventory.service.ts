/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface MeatStock {
    id: string;
    itemName: string;
    totalQuantityKg: number;
    lastUpdatedAt: string;
}

export interface InventoryValuationCategory {
    category: string;
    totalQuantity: number;
    totalValue: number;
}

export interface InventoryValuation {
    warehouseId: string;
    warehouseName: string;
    categories: InventoryValuationCategory[];
}

export interface LowStockAlert {
    stockItemId: string;
    sku: string;
    name: string;
    currentStock: number;
    reorderLevel: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private http = inject(HttpClient);
    private apiUrl = `${ environment.apiUrl }/inventory/Stocks`;

    getStocks(): Observable<MeatStock[]> {
        return this.http.get<MeatStock[]>(this.apiUrl);
    }

    getValuation(): Observable<InventoryValuation[]> {
        return this.http.get<InventoryValuation[]>(`${this.apiUrl}/valuation`);
    }

    getLowStockAlerts(): Observable<LowStockAlert[]> {
        return this.http.get<LowStockAlert[]>(`${this.apiUrl}/low-stock-alerts`);
    }

    getPurchaseOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/inventory/purchase-orders`);
    }

    createPurchaseOrder(command: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/purchase-orders`, command);
    }

    approvePurchaseOrder(id: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/purchase-orders/${id}/approve`, {});
    }

    receivePurchaseOrder(id: string, dto: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/purchase-orders/${id}/receive`, dto);
    }

    getSalesOrders(): Observable<any[]> {
        return this.http.get<any[]>(`${environment.apiUrl}/inventory/sales-orders`);
    }

    createSalesOrder(command: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/sales-orders`, command);
    }

    approveSalesOrder(id: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/sales-orders/${id}/approve`, {});
    }

    shipSalesOrder(id: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/inventory/sales-orders/${id}/ship`, {});
    }
}