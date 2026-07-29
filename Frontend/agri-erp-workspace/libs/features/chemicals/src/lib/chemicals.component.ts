import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChemicalsService, ChemicalProduct, ApplicationLog } from './chemicals.service';

@Component({
    selector: 'lib-chemicals',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Chemicals, Fertilizers & REI Safety</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Record hazardous chemical field spraying, manage inventory volumes, and enforce safety Restricted Entry Intervals (REI).</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Analytics
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'products'" [style.border-bottom]="activeTab === 'products' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'products' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📦 Product Stock Directory
        </button>
        
        <button (click)="activeTab = 'log'" [style.border-bottom]="activeTab === 'log' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'log' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🚜 Apply Crop Treatment
        </button>
        
        <button (click)="activeTab = 'safety'" [style.border-bottom]="activeTab === 'safety' ? '3px solid var(--accent-rose)' : 'none'" [style.color]="activeTab === 'safety' ? 'var(--accent-rose)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          ⚠️ Restricted Fields (REI)
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Product Stock Directory -->
        <div *ngIf="activeTab === 'products'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showProductForm = !showProductForm" class="btn-primary">
              {{ showProductForm ? 'Close Form' : '➕ Onboard Product Stock' }}
            </button>
          </div>

          <!-- Add Product Form -->
          <div *ngIf="showProductForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem; border-left: 4px solid var(--accent-purple);">
            <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">Register Chemical or Fertilizer Product</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Product Name</label>
                <input type="text" [(ngModel)]="newProduct.productName" placeholder="e.g. Roundup PowerMAX" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">EPA Reg No.</label>
                <input type="text" [(ngModel)]="newProduct.registrationNumber" placeholder="e.g. EPA-524-549" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">REI Safety Hours</label>
                <input type="number" [(ngModel)]="newProduct.safetyIntervalHours" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Stock Liters</label>
                <input type="number" [(ngModel)]="newProduct.stockQuantityLiters" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Cost ($/Liter)</label>
                <input type="number" [(ngModel)]="newProduct.costPerLiter" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitProduct()" class="btn-primary">
                Save Product
              </button>
            </div>
          </div>

          <!-- Product Stock Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let p of products" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-purple);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ p.productName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">EPA Reg: {{ p.registrationNumber }}</span>
                </div>
                <span class="badge-pill badge-purple">Chemical</span>
              </div>

              <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; margin-top: 0.5rem;">
                <div>⚠️ Safety REI: <strong style="color: var(--accent-amber);">{{ p.safetyIntervalHours }} Hours</strong></div>
                <div>📦 Stock Volume: <strong style="color: var(--primary-emerald);">{{ p.stockQuantityLiters }} Liters</strong></div>
                <div>💰 Stock Value: <strong style="color: var(--accent-blue);">{{ p.totalStockValue | currency:'USD' }}</strong></div>
              </div>
            </div>
          </div>
          <div *ngIf="products.length === 0" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            No chemical products registered. Click 'Onboard Product Stock' above.
          </div>
        </div>

        <!-- Tab 2: Apply Crop Treatment Log -->
        <div *ngIf="activeTab === 'log'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Record Field Spray Application</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Product Used</label>
                <select [(ngModel)]="newLog.chemicalProductId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Select Product --</option>
                  <option *ngFor="let p of products" [value]="p.id">{{ p.productName }} (REI: {{ p.safetyIntervalHours }}h)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Quantity Applied (Liters)</label>
                <input type="number" [(ngModel)]="newLog.quantityAppliedLiters" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Area Treated (Acres)</label>
                <input type="number" [(ngModel)]="newLog.areaTreatedAcres" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Treatment Notes</label>
                <input type="text" [(ngModel)]="newLog.notes" placeholder="e.g. Broadleaf weed control application" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitLog()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Log Treatment & Set REI
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Treated Area</th>
                <th style="text-align: right;">Applied Volume</th>
                <th>Dosage / Acre</th>
                <th>Spray Date</th>
                <th>REI Expiration</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of logs">
                <td><strong style="color: #ffffff;">{{ l.productName }}</strong></td>
                <td>{{ l.areaTreatedAcres }} Acres</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ l.quantityAppliedLiters }} Liters</td>
                <td style="font-family: monospace;">{{ l.dosagePerAcre | number:'1.1-2' }} L/Acre</td>
                <td>{{ l.applicationDate | date:'short' }}</td>
                <td><strong style="color: var(--accent-rose);">{{ l.safetyIntervalExpiry | date:'short' }}</strong></td>
              </tr>
              <tr *ngIf="logs.length === 0">
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No field treatment logs recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 3: Restricted Fields Safety -->
        <div *ngIf="activeTab === 'safety'">
          <div style="background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.3); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 2rem;">⚠️</div>
            <div>
              <h4 style="margin: 0; color: var(--accent-rose); font-size: 1.05rem;">Active Restricted Entry Intervals (REI Hazards)</h4>
              <p style="margin: 0.25rem 0 0 0; color: var(--text-muted); font-size: 0.85rem;">Fields under active REI restriction are strictly prohibited for field hands without PPE.</p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let r of getRestrictedLogs()" style="background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(244, 63, 94, 0.4); border-radius: 12px; padding: 1.25rem; border-left: 4px solid var(--accent-rose);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <strong style="color: #ffffff;">{{ r.productName }}</strong>
                <span class="badge-pill badge-rose">⛔ Entry Prohibited</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem 0;">
                Reg No: {{ r.registrationNumber }}<br>
                Sprayed: {{ r.applicationDate | date:'medium' }}
              </p>
              <div style="background: rgba(15, 23, 42, 0.6); padding: 8px 12px; border-radius: 8px; font-size: 0.85rem; color: var(--accent-rose); font-weight: bold; text-align: center;">
                REI Safe Re-entry: {{ r.safetyIntervalExpiry | date:'medium' }}
              </div>
            </div>
            <div *ngIf="getRestrictedLogs().length === 0" style="padding: 3rem; text-align: center; color: var(--primary-emerald); grid-column: 1 / -1;">
              ✅ All farming fields are currently safe for entry. No active REI restrictions.
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ChemicalsComponent implements OnInit {
    private chemicalsService = inject(ChemicalsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'products';
    showProductForm = false;

    products: ChemicalProduct[] = [];
    logs: ApplicationLog[] = [];

    newProduct = {
        productName: '',
        registrationNumber: '',
        safetyIntervalHours: 24,
        stockQuantityLiters: 100,
        costPerLiter: 12.50
    };

    newLog = {
        chemicalProductId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        quantityAppliedLiters: 25,
        areaTreatedAcres: 10,
        notes: ''
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.chemicalsService.getAnalytics().subscribe({
            next: (data) => {
                this.products = data.products || [];
                this.logs = data.logs || [];
                if (this.products.length > 0 && !this.newLog.chemicalProductId) {
                    this.newLog.chemicalProductId = this.products[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching chemical analytics:', err)
        });
    }

    getRestrictedLogs(): ApplicationLog[] {
        return this.logs.filter(l => l.isCurrentlyRestricted);
    }

    submitProduct(): void {
        if (!this.newProduct.productName || !this.newProduct.registrationNumber) {
            alert('Please fill out Product Name and Registration Number.');
            return;
        }

        this.chemicalsService.createProduct(this.newProduct).subscribe({
            next: () => {
                this.showProductForm = false;
                this.newProduct.productName = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to onboard product: ' + err.message)
        });
    }

    submitLog(): void {
        if (!this.newLog.chemicalProductId || !this.newLog.quantityAppliedLiters) {
            alert('Please choose a product and enter applied quantity.');
            return;
        }

        const command = {
            chemicalProductId: this.newLog.chemicalProductId,
            fieldId: this.newLog.fieldId,
            quantityAppliedLiters: this.newLog.quantityAppliedLiters,
            areaTreatedAcres: this.newLog.areaTreatedAcres,
            applicationDate: new Date().toISOString(),
            notes: this.newLog.notes
        };

        this.chemicalsService.logApplication(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Crop treatment logged and REI restriction enforced.');
            },
            error: (err) => alert('Failed to log treatment: ' + err.message)
        });
    }
}
