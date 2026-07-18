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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 1.5rem; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5;">
      
      <!-- Title Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #eef2f5; padding-bottom: 1rem;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Sales Orders & Customer Contracts</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage sales pipelines, customer contract valuations, and post-shipment COGS depletions.</p>
        </div>
        <button (click)="showCreateForm = !showCreateForm" style="padding: 10px 20px; background: linear-gradient(135deg, #2ecc71, #27ae60); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          ➕ Create Sales Order
        </button>
      </div>

      <!-- Create Sales Order Form Box -->
      <div *ngIf="showCreateForm" style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
        <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">New Sales Order Contract</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Customer (Mock ID)</label>
            <input type="text" [(ngModel)]="newSo.customerId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" readonly />
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Stock Item ID</label>
            <input type="text" [(ngModel)]="newItem.stockItemId" placeholder="Enter Stock Item GUID" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            <span style="font-size: 0.75rem; color: #94a3b8; display: block; margin-top: 0.15rem;">Enter the stock item ID (e.g. from Inventory list).</span>
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Quantity (KG)</label>
            <input type="number" [(ngModel)]="newItem.quantity" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
          </div>
          <div>
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Contract Price ($/KG)</label>
            <input type="number" [(ngModel)]="newItem.unitPrice" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button (click)="showCreateForm = false" style="padding: 8px 16px; background: #94a3b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cancel</button>
          <button (click)="submitSalesOrder()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Submit Contract</button>
        </div>
      </div>

      <!-- Sales Orders Table -->
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
            <th style="padding: 1rem 0.5rem;">Sales Order ID</th>
            <th style="padding: 1rem 0.5rem;">Order Date</th>
            <th style="padding: 1rem 0.5rem;">Status</th>
            <th style="padding: 1rem 0.5rem; text-align: right;">Total Amount</th>
            <th style="padding: 1rem 0.5rem; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let so of salesOrders" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
            <td style="padding: 1rem 0.5rem; font-family: monospace; font-weight: bold;">{{ so.id | slice:0:8 }}...</td>
            <td style="padding: 1rem 0.5rem;">{{ so.orderDate | date:'medium' }}</td>
            <td style="padding: 1rem 0.5rem;">
              <span [ngStyle]="{
                'background-color': getStatusColor(so.status),
                'color': 'white',
                'padding': '3px 8px',
                'border-radius': '4px',
                'font-size': '0.75rem',
                'font-weight': '600'
              }">
                {{ so.status }}
              </span>
            </td>
            <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold; color: #2ecc71;">
              {{ so.totalAmount | currency:'USD' }}
            </td>
            <td style="padding: 1rem 0.5rem; text-align: center; display: flex; justify-content: center; gap: 0.5rem;">
              <button *ngIf="so.status === 'Draft'" (click)="approveSo(so.id)" style="padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                Approve
              </button>
              <button *ngIf="so.status === 'Approved'" (click)="shipSo(so.id)" style="padding: 4px 8px; background: #e67e22; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                Ship Order
              </button>
              <span *ngIf="so.status === 'Shipped'" style="color: #7f8c8d; font-size: 0.85rem;">Completed (Posted)</span>
            </td>
          </tr>
          <tr *ngIf="salesOrders.length === 0" style="text-align: center; color: #95a5a6;">
            <td colspan="5" style="padding: 2rem;">No customer sales orders found.</td>
          </tr>
        </tbody>
      </table>

    </div>
  `
})
export class SalesComponent implements OnInit {
    private inventoryService = inject(InventoryService);
    private cdr = inject(ChangeDetectorRef);

    salesOrders: SalesOrder[] = [];
    showCreateForm = false;

    newSo = {
        customerId: '00000000-0000-0000-0000-000000000000'
    };

    newItem = {
        stockItemId: '',
        quantity: 50,
        unitPrice: 4.50
    };

    ngOnInit(): void {
        this.loadSalesOrders();
    }

    loadSalesOrders(): void {
        this.inventoryService.getSalesOrders().subscribe({
            next: (data) => {
                this.salesOrders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching sales orders:', err)
        });
    }

    submitSalesOrder(): void {
        if (!this.newItem.stockItemId) {
            alert('Please enter a Stock Item GUID.');
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
                this.loadSalesOrders();
            },
            error: (err) => alert('Failed to create sales order: ' + (err.error?.error || err.message))
        });
    }

    approveSo(soId: string): void {
        this.inventoryService.approveSalesOrder(soId).subscribe({
            next: () => {
                this.loadSalesOrders();
            },
            error: (err) => alert('Failed to approve sales order: ' + err.message)
        });
    }

    shipSo(soId: string): void {
        this.inventoryService.shipSalesOrder(soId).subscribe({
            next: () => {
                this.loadSalesOrders();
            },
            error: (err) => alert('Failed to ship sales order: ' + (err.error?.error || err.message))
        });
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'draft': return '#95a5a6';
            case 'approved': return '#3498db';
            case 'shipped': return '#27ae60';
            case 'cancelled': return '#e74c3c';
            default: return '#7f8c8d';
        }
    }
}
