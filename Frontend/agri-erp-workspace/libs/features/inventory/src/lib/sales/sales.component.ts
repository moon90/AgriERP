import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory.service';

export interface SalesOrderItem {
    id: string;
    stockItemId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

export interface SalesOrder {
    id: string;
    customerId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    items: SalesOrderItem[];
}

@Component({
    selector: 'lib-sales',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Title Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Sales Orders & Customer Contracts</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage sales pipelines, customer contract valuations, and post-shipment COGS depletions.</p>
        </div>
        <button (click)="showCreateForm = !showCreateForm" class="btn-primary">
          ➕ Create Sales Order
        </button>
      </div>

      <!-- Create Sales Order Form Box -->
      <div *ngIf="showCreateForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
        <h4 style="margin: 0 0 1rem 0; color: #ffffff;">New Sales Order Contract</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Customer (Mock ID)</label>
            <input type="text" [(ngModel)]="newSo.customerId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" readonly />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Stock Item ID</label>
            <input type="text" [(ngModel)]="newItem.stockItemId" placeholder="Enter Stock Item GUID" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Quantity (KG)</label>
            <input type="number" [(ngModel)]="newItem.quantity" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Contract Price ($/KG)</label>
            <input type="number" [(ngModel)]="newItem.unitPrice" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button (click)="showCreateForm = false" class="btn-secondary">Cancel</button>
          <button (click)="submitSo()" class="btn-primary">Submit Sales Order</button>
        </div>
      </div>

      <!-- Sales Orders List -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <table class="modern-table">
          <thead>
            <tr>
              <th>SO Reference ID</th>
              <th>Order Date</th>
              <th style="text-align: right;">Contract Value ($)</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let so of orders">
              <td><strong style="color: #ffffff;">SO-{{ so.id.substring(0, 8) }}</strong></td>
              <td>{{ so.orderDate | date:'medium' }}</td>
              <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ so.totalAmount | currency:'USD' }}</td>
              <td style="text-align: center;">
                <span [ngClass]="so.status === 'Shipped' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                  {{ so.status }}
                </span>
              </td>
              <td style="text-align: center;">
                <button *ngIf="so.status === 'Draft'" (click)="confirmSo(so.id)" class="badge-pill badge-blue" style="cursor: pointer; border: none; margin-right: 0.5rem;">
                  Confirm
                </button>
                <button *ngIf="so.status === 'Confirmed'" (click)="shipSo(so.id)" class="badge-pill badge-emerald" style="cursor: pointer; border: none;">
                  Ship & Fulfill
                </button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No sales orders recorded.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class SalesComponent implements OnInit {
    private inventoryService = inject(InventoryService);
    private cdr = inject(ChangeDetectorRef);

    showCreateForm = false;
    orders: SalesOrder[] = [];

    newSo = {
        customerId: '00000000-0000-0000-0000-000000000000'
    };

    newItem = {
        stockItemId: '',
        quantity: 500,
        unitPrice: 22.0
    };

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.inventoryService.getSalesOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching sales orders:', err)
        });
    }

    submitSo(): void {
        if (!this.newItem.stockItemId) {
            alert('Please fill out Stock Item ID.');
            return;
        }

        const command = {
            customerId: this.newSo.customerId,
            items: [
                {
                    stockItemId: this.newItem.stockItemId,
                    quantity: this.newItem.quantity,
                    unitPrice: this.newItem.unitPrice
                }
            ]
        };

        this.inventoryService.createSalesOrder(command).subscribe({
            next: () => {
                this.showCreateForm = false;
                this.loadOrders();
            },
            error: (err) => alert('Failed to create sales order: ' + err.message)
        });
    }

    confirmSo(soId: string): void {
        this.inventoryService.approveSalesOrder(soId).subscribe({
            next: () => this.loadOrders(),
            error: (err: any) => alert('Failed to confirm SO: ' + err.message)
        });
    }

    shipSo(soId: string): void {
        this.inventoryService.shipSalesOrder(soId).subscribe({
            next: () => this.loadOrders(),
            error: (err) => alert('Failed to ship SO: ' + err.message)
        });
    }
}
