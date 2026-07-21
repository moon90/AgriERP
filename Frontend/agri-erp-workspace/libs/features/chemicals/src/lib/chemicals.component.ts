import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChemicalsService, ChemicalProduct, ApplicationLog } from './chemicals.service';

@Component({
    selector: 'lib-chemicals',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #9b59b6; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Chemicals, Fertilizers & REI Safety</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Record hazardous chemical field spraying, manage inventory volumes, and enforce safety Restricted Entry Intervals (REI).</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Analytics
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'products'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'products' ? '#9b59b6' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'products' ? '3px solid #9b59b6' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📦 Product Stock Directory
        </button>
        
        <button (click)="activeTab = 'log'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'log' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'log' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🚜 Apply Crop Treatment
        </button>
        
        <button (click)="activeTab = 'safety'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'safety' ? '#d35400' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'safety' ? '3px solid #d35400' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          ⚠️ Restricted Fields (REI)
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Product Stock Directory -->
        <div *ngIf="activeTab === 'products'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showProductForm = !showProductForm" style="padding: 8px 16px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showProductForm ? 'Close Form' : '➕ Onboard Product Stock' }}
            </button>
          </div>

          <!-- Add Product Form -->
          <div *ngIf="showProductForm" style="background: #fdf5ff; border: 1px solid #ebccf5; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #9b59b6; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #9b59b6; font-size: 1.1rem;">Register Chemical or Fertilizer Product</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Product Name</label>
                <input type="text" [(ngModel)]="newProduct.productName" placeholder="e.g. RoundUp Pro" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Registration / EPA Code</label>
                <input type="text" [(ngModel)]="newProduct.registrationNumber" placeholder="e.g. EPA-9921-A" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">REI Safety Period (Hours)</label>
                <input type="number" [(ngModel)]="newProduct.safetyIntervalHours" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Initial Stock (Liters)</label>
                <input type="number" [(ngModel)]="newProduct.stockQuantityLiters" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Cost Per Liter ($)</label>
                <input type="number" [(ngModel)]="newProduct.costPerLiter" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button (click)="submitProduct()" style="padding: 10px 24px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">
                  Register Stock
                </button>
              </div>
            </div>
          </div>

          <!-- Product Stock List Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 10px;">Chemical Product Name</th>
                <th style="padding: 10px;">EPA Code</th>
                <th style="padding: 10px; text-align: right;">REI Safety Duration</th>
                <th style="padding: 10px; text-align: right;">In Stock Volume</th>
                <th style="padding: 10px; text-align: right;">Unit Cost</th>
                <th style="padding: 10px; text-align: right;">Inventory Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 10px; font-weight: bold; color: #2c3e50;">📦 {{ p.productName }}</td>
                <td style="padding: 10px; font-family: monospace;">{{ p.registrationNumber }}</td>
                <td style="padding: 10px; text-align: right; color: #d35400; font-weight: bold;">⚠️ {{ p.safetyIntervalHours }} Hours</td>
                <td style="padding: 10px; text-align: right;">{{ p.stockQuantityLiters | number }} Liters</td>
                <td style="padding: 10px; text-align: right;">{{ p.costPerLiter | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #27ae60;">
                  {{ p.totalStockValue | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="products.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No chemical or fertilizer stocks onboarded yet.
          </div>
        </div>

        <!-- Tab 2: Apply Crop Treatment -->
        <div *ngIf="activeTab === 'log'">
          <div style="max-width: 600px; margin: 0 auto; background: #fffaf4; border: 1px solid #ffd8b3; padding: 2rem; border-radius: 10px; border-left: 5px solid #e67e22; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.5rem 0; color: #e67e22; font-size: 1.25rem;">Record Chemical Field Application</h4>
            
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 0.25rem; color: #64748b;">Select Product</label>
                <select [(ngModel)]="log.chemicalProductId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="">-- Select Active Chemical --</option>
                  <option *ngFor="let p of products" [value]="p.id">{{ p.productName }} (In Stock: {{ p.stockQuantityLiters }} Liters)</option>
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Liters Applied</label>
                  <input type="number" [(ngModel)]="log.quantityAppliedLiters" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Area Treated (Acres)</label>
                  <input type="number" [(ngModel)]="log.areaTreatedAcres" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Application Date</label>
                  <input type="date" [(ngModel)]="log.applicationDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Target Field ID / Block</label>
                  <input type="text" [(ngModel)]="log.notes" placeholder="e.g. Field #7 Wheat Plot B" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <!-- Estimated Dosage Cost Calculations -->
              <div *ngIf="log.quantityAppliedLiters > 0 && log.areaTreatedAcres > 0" style="background: #ffffff; border: 1px dashed #e67e22; padding: 1rem; border-radius: 6px; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Dosage Rate per Acre</span>
                  <strong style="color: #e67e22;">{{ log.quantityAppliedLiters / log.areaTreatedAcres | number:'1.0-2' }} Liters/Acre</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span>Accrued Treatment Expense (GL 5600)</span>
                  <strong style="color: #27ae60; font-size: 1.1rem;">{{ getEstimatedCost() | currency:'USD' }}</strong>
                </div>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                <button (click)="submitApplication()" [disabled]="!log.chemicalProductId || log.quantityAppliedLiters <= 0 || log.areaTreatedAcres <= 0" style="padding: 12px 28px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: (!log.chemicalProductId || log.quantityAppliedLiters <= 0) ? 0.6 : 1;">
                  Confirm Spraying & Bill GL
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Tab 3: Restricted Entry Fields (REI Safety) -->
        <div *ngIf="activeTab === 'safety'">
          <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid #e53e3e;">
            <span style="font-size: 0.9rem; color: #e53e3e; font-weight: bold; display: flex; align-items: center; gap: 0.5rem;">
              ⚠️ RESTRICTED ACCESS WARNINGS
            </span>
            <strong style="font-size: 1.75rem; color: #c53030;">
              {{ activeRestrictedFieldsCount }} Fields Locked
            </strong>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 10px;">Target Block Field</th>
                <th style="padding: 10px;">Chemical Applied</th>
                <th style="padding: 10px; text-align: right;">Dosage Rate</th>
                <th style="padding: 10px;">Safety Expiry Time</th>
                <th style="padding: 10px; text-align: right;">Status Flag</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of logs" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 10px; font-weight: bold; color: #2c3e50;">{{ l.notes || 'Crop Field' }}</td>
                <td style="padding: 10px;">{{ l.productName }} ({{ l.registrationNumber }})</td>
                <td style="padding: 10px; text-align: right;">{{ l.dosagePerAcre | number:'1.0-2' }} L/Acre</td>
                <td style="padding: 10px; font-family: monospace;">{{ l.safetyIntervalExpiry | date:'yyyy-MM-dd HH:mm' }}</td>
                <td style="padding: 10px; text-align: right;">
                  <span [ngStyle]="{
                    'background-color': l.isCurrentlyRestricted ? '#e53e3e' : '#2ecc71',
                    'color': 'white',
                    'padding': '3px 8px',
                    'border-radius': '4px',
                    'font-size': '0.75rem',
                    'font-weight': 'bold'
                  }">
                    {{ l.isCurrentlyRestricted ? '⚠️ RESTRICTED' : '✅ SAFE ENTRY' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="logs.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No historic field spraying chemical treatments found.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class ChemicalsComponent implements OnInit {
    private chemicalsService = inject(ChemicalsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'products';
    products: ChemicalProduct[] = [];
    logs: ApplicationLog[] = [];
    totalTreatmentExpenses: number = 0;
    activeRestrictedFieldsCount: number = 0;

    showProductForm: boolean = false;

    newProduct = {
        productName: '',
        registrationNumber: '',
        safetyIntervalHours: 24,
        stockQuantityLiters: 100,
        costPerLiter: 15
    };

    log = {
        chemicalProductId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        quantityAppliedLiters: 10,
        areaTreatedAcres: 5,
        applicationDate: '',
        notes: ''
    };

    ngOnInit(): void {
        this.log.applicationDate = new Date().toISOString().split('T')[0];
        this.loadAll();
    }

    loadAll(): void {
        this.chemicalsService.getAnalytics().subscribe(a => {
            this.products = a.products;
            this.logs = a.logs;
            this.totalTreatmentExpenses = a.totalTreatmentExpenses;
            this.activeRestrictedFieldsCount = a.activeRestrictedFieldsCount;
            this.cdr.detectChanges();
        });
    }

    getEstimatedCost(): number {
        const prod = this.products.find(p => p.id === this.log.chemicalProductId);
        return prod ? this.log.quantityAppliedLiters * prod.costPerLiter : 0;
    }

    submitProduct(): void {
        if (!this.newProduct.productName || !this.newProduct.registrationNumber || this.newProduct.stockQuantityLiters <= 0) return;
        this.chemicalsService.createProduct(this.newProduct).subscribe(() => {
            this.newProduct = {
                productName: '',
                registrationNumber: '',
                safetyIntervalHours: 24,
                stockQuantityLiters: 100,
                costPerLiter: 15
            };
            this.showProductForm = false;
            this.loadAll();
        });
    }

    submitApplication(): void {
        if (!this.log.chemicalProductId || this.log.quantityAppliedLiters <= 0 || this.log.areaTreatedAcres <= 0) return;
        this.chemicalsService.logApplication(this.log).subscribe(() => {
            this.log = {
                chemicalProductId: '',
                fieldId: '00000000-0000-0000-0000-000000000000',
                quantityAppliedLiters: 10,
                areaTreatedAcres: 5,
                applicationDate: new Date().toISOString().split('T')[0],
                notes: ''
            };
            this.loadAll();
        });
    }
}
