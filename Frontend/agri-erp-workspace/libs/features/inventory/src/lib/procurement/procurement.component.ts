import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../inventory.service';

export interface POItem {
    id: string;
    stockItemId: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
}

export interface PO {
    id: string;
    vendorId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    items: POItem[];
}

@Component({
    selector: 'lib-procurement',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      <!-- Title Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Procurement & Purchase Orders</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage vendor purchase contracts, PO states, and execute stock warehouse receipts.</p>
        </div>
        <button (click)="showCreateForm = !showCreateForm" class="btn-primary">
          ➕ Create Purchase Order
        </button>
      </div>

      <!-- Create PO Form Box -->
      <div *ngIf="showCreateForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
        <h4 style="margin: 0 0 1rem 0; color: #ffffff;">New Purchase Order</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Vendor (Mock ID)</label>
            <input type="text" [(ngModel)]="newPo.vendorId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" readonly />
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
            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Unit Price ($)</label>
            <input type="number" [(ngModel)]="newItem.unitPrice" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button (click)="showCreateForm = false" class="btn-secondary">Cancel</button>
          <button (click)="submitPo()" class="btn-primary">Submit Purchase Order</button>
        </div>
      </div>

      <!-- Purchase Orders List -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <table class="modern-table">
          <thead>
            <tr>
              <th>PO Reference ID</th>
              <th>Order Date</th>
              <th style="text-align: right;">Total Cost ($)</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: center;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let po of orders">
              <td><strong style="color: #ffffff;">PO-{{ po.id.substring(0, 8) }}</strong></td>
              <td>{{ po.orderDate | date:'medium' }}</td>
              <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ po.totalAmount | currency:'USD' }}</td>
              <td style="text-align: center;">
                <span [ngClass]="po.status === 'Received' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                  {{ po.status }}
                </span>
              </td>
              <td style="text-align: center;">
                <button *ngIf="po.status === 'Draft'" (click)="approvePo(po.id)" class="badge-pill badge-blue" style="cursor: pointer; border: none; margin-right: 0.5rem;">
                  Approve
                </button>
                <button *ngIf="po.status === 'Approved'" (click)="receivePo(po.id)" class="badge-pill badge-emerald" style="cursor: pointer; border: none;">
                  Receive Goods
                </button>
              </td>
            </tr>
            <tr *ngIf="orders.length === 0">
              <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No purchase orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class ProcurementComponent implements OnInit {
    private inventoryService = inject(InventoryService);
    private cdr = inject(ChangeDetectorRef);

    showCreateForm = false;
    orders: PO[] = [];

    newPo = {
        vendorId: '00000000-0000-0000-0000-000000000000'
    };

    newItem = {
        stockItemId: '',
        quantity: 100,
        unitPrice: 15.5
    };

    ngOnInit(): void {
        this.loadOrders();
    }

    loadOrders(): void {
        this.inventoryService.getPurchaseOrders().subscribe({
            next: (data) => {
                this.orders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching purchase orders:', err)
        });
    }

    submitPo(): void {
        if (!this.newItem.stockItemId) {
            alert('Please fill out Stock Item ID.');
            return;
        }

        const command = {
            vendorId: this.newPo.vendorId,
            items: [
                {
                    stockItemId: this.newItem.stockItemId,
                    quantity: this.newItem.quantity,
                    unitPrice: this.newItem.unitPrice
                }
            ]
        };

        this.inventoryService.createPurchaseOrder(command).subscribe({
            next: () => {
                this.showCreateForm = false;
                this.loadOrders();
            },
            error: (err) => alert('Failed to create purchase order: ' + err.message)
        });
    }

    approvePo(poId: string): void {
        this.inventoryService.approvePurchaseOrder(poId).subscribe({
            next: () => this.loadOrders(),
            error: (err) => alert('Failed to approve PO: ' + err.message)
        });
    }

    receivePo(poId: string): void {
        this.inventoryService.receivePurchaseOrder(poId, {}).subscribe({
            next: () => this.loadOrders(),
            error: (err) => alert('Failed to receive PO goods: ' + err.message)
        });
    }
}
