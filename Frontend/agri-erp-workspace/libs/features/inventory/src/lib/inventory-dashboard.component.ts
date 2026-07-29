import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryValuation, LowStockAlert } from './inventory.service';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'lib-inventory-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
    <div class="mb-4" style="font-family: var(--font-sans); color: var(--text-main);">
      <!-- Low Stock Alerts Section -->
      <div *ngIf="alerts.length > 0" style="background: linear-gradient(135deg, rgba(244, 63, 94, 0.9), rgba(245, 158, 11, 0.9)); color: white; padding: 1.25rem; border-radius: 14px; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.2);">
        <h4 style="margin: 0 0 0.75rem 0; display: flex; align-items: center; font-size: 1.1rem; font-weight: 700;">
          <span style="margin-right: 0.5rem;">⚠️</span> Critical Supply Alert: Low Material Stock
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          <div *ngFor="let alert of alerts" style="background: rgba(15, 23, 42, 0.4); padding: 0.85rem 1rem; border-radius: 10px; border-left: 4px solid #ffffff;">
            <strong style="display: block; font-size: 1rem; margin-bottom: 0.25rem;">{{ alert.name }}</strong>
            <span style="font-size: 0.8rem; opacity: 0.85; display: block; font-family: monospace; margin-bottom: 0.5rem;">SKU: {{ alert.sku }}</span>
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.5rem;">
              <span>Current Stock: <strong>{{ alert.currentStock }} KG</strong></span>
              <span>Reorder Point: <strong>{{ alert.reorderLevel }} KG</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Assets & Warehouse Valuation -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.4rem; letter-spacing: -0.5px;">Inventory Asset Valuations</h3>
        <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Real-time stock values computed on FIFO cost basis groupings.</p>
      </div>

      <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        <!-- Warehouse Valuations -->
        <div *ngFor="let val of valuations" style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); overflow: hidden; display: flex; flex-direction: column;">
          <div style="background: rgba(30, 41, 59, 0.8); color: white; padding: 1rem 1.25rem; font-weight: 700; font-size: 1.05rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass);">
            <span>🏢 {{ val.warehouseName }}</span>
            <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 700; font-family: monospace;">
              {{ getWarehouseTotalValue(val) | currency:'USD' }}
            </span>
          </div>
          
          <div style="padding: 1.25rem; flex-grow: 1;">
            <div *ngFor="let cat of val.categories" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--border-glass);">
              <div>
                <strong style="color: #ffffff; display: block; font-size: 0.95rem; font-weight: 600;">{{ cat.category }}</strong>
                <span style="color: var(--text-muted); font-size: 0.85rem; display: block; margin-top: 0.15rem;">Quantity: {{ cat.totalQuantity }} KG</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary-emerald);">
                  {{ cat.totalValue | currency:'USD' }}
                </span>
              </div>
            </div>
            
            <div *ngIf="val.categories.length === 0" style="padding: 2rem; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
              No materials stored in this warehouse.
            </div>
          </div>
        </div>

        <div *ngIf="valuations.length === 0" style="grid-column: 1 / -1; padding: 3rem 2rem; text-align: center; background: rgba(15, 23, 42, 0.5); border-radius: 14px; border: 1px dashed var(--border-glass); color: var(--text-muted);">
          No active warehouse stock valuations found.
        </div>
      </div>
    </div>
  `
})
export class InventoryDashboardComponent implements OnInit {
    private inventoryService = inject(InventoryService);
    private cdr = inject(ChangeDetectorRef);

    valuations: InventoryValuation[] = [];
    alerts: LowStockAlert[] = [];

    ngOnInit(): void {
        this.loadDashboardData();
    }

    loadDashboardData(): void {
        this.inventoryService.getValuation().subscribe({
            next: (data) => {
                this.valuations = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching inventory valuation:', err)
        });

        this.inventoryService.getLowStockAlerts().subscribe({
            next: (data) => {
                this.alerts = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching low stock alerts:', err)
        });
    }

    getWarehouseTotalValue(val: InventoryValuation): number {
        return val.categories.reduce((acc, cat) => acc + cat.totalValue, 0);
    }
}