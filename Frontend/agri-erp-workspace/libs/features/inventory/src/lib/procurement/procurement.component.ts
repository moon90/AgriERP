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
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 1.5rem; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5;">
      <!-- Title Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #eef2f5; padding-bottom: 1rem;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Procurement & Purchase Orders</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage vendor purchase contracts, PO states, and execute stock warehouse receipts.</p>
        </div>
        <button (click)="showCreateForm = !showCreateForm" style="padding: 10px 20px; background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          ➕ Create Purchase Order
        </button>
      </div>

      <!-- Create PO Form Box -->
      <div *ngIf="showCreateForm" style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
        <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">New Purchase Order</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Vendor (Mock ID)</label>
            <input type="text" [(ngModel)]="newPo.vendorId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" readonly />
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
            <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Unit Price ($)</label>
            <input type="number" [(ngModel)]="newItem.unitPrice" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
          <button (click)="showCreateForm = false" style="padding: 8px 16px; background: #94a3b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cancel</button>
          <button (click)="submitPurchaseOrder()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Submit PO</button>
        </div>
      </div>

      <!-- PO List Table -->
      <table style="width: 100%; border-collapse: collapse; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
            <th style="padding: 1rem 0.5rem;">PO ID</th>
            <th style="padding: 1rem 0.5rem;">Order Date</th>
            <th style="padding: 1rem 0.5rem;">Status</th>
            <th style="padding: 1rem 0.5rem; text-align: right;">Total Amount</th>
            <th style="padding: 1rem 0.5rem; text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let po of purchaseOrders" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
            <td style="padding: 1rem 0.5rem; font-family: monospace; font-weight: bold;">{{ po.id | slice:0:8 }}...</td>
            <td style="padding: 1rem 0.5rem;">{{ po.orderDate | date:'medium' }}</td>
            <td style="padding: 1rem 0.5rem;">
              <span [ngStyle]="{
                'background-color': getStatusColor(po.status),
                'color': 'white',
                'padding': '3px 8px',
                'border-radius': '4px',
                'font-size': '0.75rem',
                'font-weight': '600'
              }">
                {{ po.status }}
              </span>
            </td>
            <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold; color: #2980b9;">
              {{ po.totalAmount | currency:'USD' }}
            </td>
            <td style="padding: 1rem 0.5rem; text-align: center; display: flex; justify-content: center; gap: 0.5rem;">
              <button *ngIf="po.status === 'Draft'" (click)="approvePo(po.id)" style="padding: 4px 8px; background: #2ecc71; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                Approve
              </button>
              <button *ngIf="po.status === 'Approved'" (click)="openReceiveDialog(po)" style="padding: 4px 8px; background: #e67e22; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                Receive
              </button>
              <span *ngIf="po.status === 'Received'" style="color: #7f8c8d; font-size: 0.85rem;">Completed</span>
            </td>
          </tr>
          <tr *ngIf="purchaseOrders.length === 0" style="text-align: center; color: #95a5a6;">
            <td colspan="5" style="padding: 2rem;">No purchase orders found.</td>
          </tr>
        </tbody>
      </table>

      <!-- Receive PO Dialog -->
      <div *ngIf="showReceiveDialog" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;">
        <div style="background: white; padding: 2rem; border-radius: 12px; width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.2rem;">Receive Purchase Order</h4>
          <p style="font-size: 0.85rem; color: #7f8c8d; margin-bottom: 1.5rem;">Enter receiving warehouse and batch number prefix to post stock inflow.</p>
          
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Warehouse ID</label>
              <input type="text" [(ngModel)]="receiveDto.warehouseId" placeholder="Enter Warehouse GUID" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Batch Prefix</label>
              <input type="text" [(ngModel)]="receiveDto.batchNumberPrefix" placeholder="e.g. REC-LOT" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
          </div>
          
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button (click)="showReceiveDialog = false" style="padding: 8px 16px; background: #94a3b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Cancel</button>
            <button (click)="submitReceive()" style="padding: 8px 16px; background: #e67e22; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Confirm Receipt</button>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ProcurementComponent implements OnInit {
    private inventoryService = inject(InventoryService);
    private cdr = inject(ChangeDetectorRef);

    purchaseOrders: PO[] = [];
    showCreateForm = false;
    showReceiveDialog = false;

    newPo = {
        vendorId: '00000000-0000-0000-0000-000000000000'
    };

    newItem = {
        stockItemId: '',
        quantity: 100,
        unitPrice: 2.50
    };

    selectedPoId = '';
    receiveDto = {
        warehouseId: '',
        batchNumberPrefix: 'PO-REC'
    };

    ngOnInit(): void {
        this.loadPurchaseOrders();
    }

    loadPurchaseOrders(): void {
        this.inventoryService.getPurchaseOrders().subscribe({
            next: (data) => {
                this.purchaseOrders = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching purchase orders:', err)
        });
    }

    submitPurchaseOrder(): void {
        if (!this.newItem.stockItemId) {
            alert('Please enter a Stock Item GUID.');
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
                this.loadPurchaseOrders();
            },
            error: (err) => alert('Failed to create purchase order: ' + err.error?.error || err.message)
        });
    }

    approvePo(poId: string): void {
        this.inventoryService.approvePurchaseOrder(poId).subscribe({
            next: () => {
                this.loadPurchaseOrders();
            },
            error: (err) => alert('Failed to approve purchase order: ' + err.message)
        });
    }

    openReceiveDialog(po: PO): void {
        this.selectedPoId = po.id;
        this.showReceiveDialog = true;
    }

    submitReceive(): void {
        if (!this.receiveDto.warehouseId) {
            alert('Please enter a Warehouse GUID.');
            return;
        }

        const dto = {
            warehouseId: this.receiveDto.warehouseId,
            batchNumberPrefix: this.receiveDto.batchNumberPrefix,
            expirationDate: null
        };

        this.inventoryService.receivePurchaseOrder(this.selectedPoId, dto).subscribe({
            next: () => {
                this.showReceiveDialog = false;
                this.loadPurchaseOrders();
            },
            error: (err) => alert('Failed to receive purchase order: ' + err.message)
        });
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'draft': return '#95a5a6';
            case 'approved': return '#3498db';
            case 'received': return '#27ae60';
            case 'cancelled': return '#e74c3c';
            default: return '#7f8c8d';
        }
    }
}
