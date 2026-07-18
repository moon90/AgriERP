import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryValuation, LowStockAlert } from './inventory.service';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'lib-inventory-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
    <div class="mb-4" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <!-- Low Stock Alerts Section -->
      <div *ngIf="alerts.length > 0" style="background: linear-gradient(135deg, #ff4d4d, #f39c12); color: white; padding: 1.25rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);">
        <h4 style="margin: 0 0 0.75rem 0; display: flex; align-items: center; font-size: 1.2rem; font-weight: 700;">
          <span style="margin-right: 0.5rem;">⚠️</span> Critical Supply Alert: Low Material Stock
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          <div *ngFor="let alert of alerts" style="background: rgba(255, 255, 255, 0.18); padding: 0.85rem; border-radius: 8px; border-left: 5px solid #ffffff;">
            <strong style="display: block; font-size: 1rem; margin-bottom: 0.25rem;">{{ alert.name }}</strong>
            <span style="font-size: 0.8rem; opacity: 0.85; display: block; font-family: monospace; margin-bottom: 0.5rem;">SKU: {{ alert.sku }}</span>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 0.5rem;">
              <span>Current Stock: <strong>{{ alert.currentStock }} KG</strong></span>
              <span>Reorder Point: <strong>{{ alert.reorderLevel }} KG</strong></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Inventory Assets & Warehouse Valuation -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Inventory Asset Valuations</h3>
        <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Real-time stock values computed on FIFO cost basis groupings.</p>
      </div>

      <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        <!-- Warehouse Valuations -->
        <div *ngFor="let val of valuations" style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; overflow: hidden; display: flex; flex-direction: column;">
          <div style="background: #2c3e50; color: white; padding: 1.1rem; font-weight: 700; font-size: 1.1rem; display: flex; justify-content: space-between; align-items: center;">
            <span>🏢 {{ val.warehouseName }}</span>
            <span style="background: #2ecc71; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 800; font-family: monospace; box-shadow: 0 2px 5px rgba(46,204,113,0.2);">
              {{ getWarehouseTotalValue(val) | currency:'USD' }}
            </span>
          </div>
          
          <div style="padding: 1.25rem; flex-grow: 1;">
            <div *ngFor="let cat of val.categories" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid #f8f9fa;">
              <div>
                <strong style="color: #2c3e50; display: block; font-size: 0.95rem; font-weight: 600;">{{ cat.category }}</strong>
                <span style="color: #95a5a6; font-size: 0.85rem; display: block; margin-top: 0.15rem;">Quantity: {{ cat.totalQuantity }} KG</span>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 1.15rem; font-weight: 700; color: #27ae60;">
                  {{ cat.totalValue | currency:'USD' }}
                </span>
              </div>
            </div>
            
            <div *ngIf="val.categories.length === 0" style="padding: 2rem; text-align: center; color: #95a5a6; font-size: 0.9rem;">
              No materials stored in this warehouse.
            </div>
          </div>
        </div>

        <div *ngIf="valuations.length === 0" style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: white; border-radius: 12px; border: 2px dashed #bdc3c7; color: #7f8c8d;">
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
        // Load FIFO valuation groupings
        this.inventoryService.getValuation().subscribe({
            next: (data) => {
                this.valuations = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching inventory valuation:', err)
        });

        // Load active reorder warnings
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