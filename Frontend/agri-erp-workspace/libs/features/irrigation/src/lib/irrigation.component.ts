import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IrrigationService, WaterSource, WaterUsageLog, WaterBilling } from './irrigation.service';

@Component({
    selector: 'lib-irrigation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2980b9; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Water Rights & Irrigation Management</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor water allocations, permit compliance ceilings, log pump telemetry rates, and post GL utility billings.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'sources'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'sources' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'sources' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          💧 Water Permits
        </button>
        
        <button (click)="activeTab = 'telemetry'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'telemetry' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'telemetry' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📟 Pump Telemetry Simulator
        </button>
        
        <button (click)="activeTab = 'history'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'history' ? '#27ae60' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'history' ? '3px solid #27ae60' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📖 Water Utility Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Water Permits -->
        <div *ngIf="activeTab === 'sources'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showSourceForm = !showSourceForm" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showSourceForm ? 'Close Form' : '➕ Onboard Water Source' }}
            </button>
          </div>

          <!-- Add Source Form -->
          <div *ngIf="showSourceForm" style="background: #eef7fc; border: 1px solid #bce1f5; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #2980b9; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #2980b9; font-size: 1.1rem;">Register Water Source & Seasonal Allocations</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Water Source Name</label>
                <input type="text" [(ngModel)]="newSource.sourceName" placeholder="e.g. Red River Intake" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Permit Number</label>
                <input type="text" [(ngModel)]="newSource.permitNumber" placeholder="e.g. W-8812-MN" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Max Allocation (Gallons)</label>
                <input type="number" [(ngModel)]="newSource.maxAllocatedGallons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitSource()" style="padding: 10px 24px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Permit
              </button>
            </div>
          </div>

          <!-- Sources Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let source of sources" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #2980b9;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">💧 Source: {{ source.sourceName }}</h4>
                <span [ngStyle]="{
                  'background-color': source.status === 'Active' ? '#2ecc71' : '#e74c3c',
                  'color': 'white',
                  'padding': '2px 6px',
                  'border-radius': '3px',
                  'font-size': '0.75rem',
                  'font-weight': 'bold'
                }">{{ source.status }}</span>
              </div>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6; margin-bottom: 1rem;">
                <div>Permit: <strong>{{ source.permitNumber }}</strong></div>
                <div>Usage: <strong>{{ source.usedGallons | number }} / {{ source.maxAllocatedGallons | number }} Gallons</strong></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #7f8c8d; margin-bottom: 0.25rem;">
                <span>Allocation Utilization</span>
                <span>{{ source.compliancePercentage | number:'1.0-2' }}%</span>
              </div>
              <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div [style.width.%]="source.compliancePercentage" style="background-color: #2980b9; height: 100%;"></div>
              </div>
            </div>
          </div>
          <div *ngIf="sources.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No water rights or permit resources onboarded.
          </div>
        </div>

        <!-- Tab 2: Telemetry Simulator -->
        <div *ngIf="activeTab === 'telemetry'">
          <div style="max-width: 600px; margin: 0 auto; background: #fffaf4; border: 1px solid #ffd8b3; padding: 2rem; border-radius: 10px; border-left: 5px solid #e67e22; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.5rem 0; color: #e67e22; font-size: 1.25rem;">Simulate Water Pump Flow Telemetry</h4>
            
            <div style="display: flex; flex-direction: column; gap: 1.25rem;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 0.25rem; color: #64748b;">Select Water Source</label>
                <select [(ngModel)]="telemetry.waterSourceId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="">-- Select Active Source --</option>
                  <option *ngFor="let s of getActiveSources()" [value]="s.id">{{ s.sourceName }} (Permit: {{ s.permitNumber }})</option>
                </select>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Gallons Pumped</label>
                  <input type="number" [(ngModel)]="telemetry.gallonsPumped" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Flow Rate (GPM)</label>
                  <input type="number" [(ngModel)]="telemetry.flowRateGpm" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Utility Cost ($/Gallon)</label>
                  <input type="number" [(ngModel)]="telemetry.costPerGallon" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Irrigation Date</label>
                  <input type="date" [(ngModel)]="telemetry.irrigationDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Notes / Target Field</label>
                <input type="text" [(ngModel)]="telemetry.notes" placeholder="e.g. Field #4 Alpha Corn Field" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>

              <!-- Estimated Billing Cost Panel -->
              <div *ngIf="telemetry.gallonsPumped > 0" style="background: #ffffff; border: 1px dashed #e67e22; padding: 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                <span>Estimated Water Utility Charge</span>
                <strong style="color: #e67e22; font-size: 1.4rem;">
                  {{ telemetry.gallonsPumped * telemetry.costPerGallon | currency:'USD' }}
                </strong>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                <button (click)="submitTelemetry()" [disabled]="!telemetry.waterSourceId || telemetry.gallonsPumped <= 0" style="padding: 12px 28px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: (telemetry.waterSourceId && telemetry.gallonsPumped > 0) ? 1 : 0.6;">
                  Log Pump Flow & Bill GL
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Tab 3: Utility Ledger -->
        <div *ngIf="activeTab === 'history'">
          <div style="background: #eef9f2; border: 1px solid #bce6c9; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.9rem; color: #27ae60; font-weight: bold;">TOTAL WATER & UTILITY EXPENSES</span>
            <strong style="font-size: 1.75rem; color: #2c3e50;">
              {{ totalUtilityExpenses | currency:'USD' }}
            </strong>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 8px;">Water Source</th>
                <th style="padding: 8px; text-align: right;">Gallons Pumped</th>
                <th style="padding: 8px; text-align: right;">Unit Cost</th>
                <th style="padding: 8px;">Billing Date</th>
                <th style="padding: 8px; text-align: right;">Calculated Bill Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 8px; font-weight: bold; font-family: monospace;">{{ b.sourceName }}</td>
                <td style="padding: 8px; text-align: right;">{{ b.gallonsUsed | number }} gal</td>
                <td style="padding: 8px; text-align: right;">{{ b.costPerGallon | currency:'USD':'symbol':'1.2-4' }}/gal</td>
                <td style="padding: 8px;">{{ b.billingDate | date:'yyyy-MM-dd' }}</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #2c3e50;">
                  {{ b.amount | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="billings.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No water usage bill statements recorded.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class IrrigationComponent implements OnInit {
    private irrigationService = inject(IrrigationService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'sources';
    sources: WaterSource[] = [];
    logs: WaterUsageLog[] = [];
    billings: WaterBilling[] = [];
    totalUtilityExpenses: number = 0;

    showSourceForm: boolean = false;

    newSource = {
        sourceName: '',
        permitNumber: '',
        maxAllocatedGallons: 100000
    };

    telemetry = {
        waterSourceId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        gallonsPumped: 2500,
        flowRateGpm: 45,
        costPerGallon: 0.05,
        irrigationDate: '',
        notes: ''
    };

    ngOnInit(): void {
        this.telemetry.irrigationDate = new Date().toISOString().split('T')[0];
        this.loadAll();
    }

    loadAll(): void {
        this.irrigationService.getPortfolio().subscribe(p => {
            this.sources = p.sources;
            this.logs = p.logs;
            this.billings = p.billings;
            this.totalUtilityExpenses = p.totalUtilityExpenses;
            this.cdr.detectChanges();
        });
    }

    getActiveSources(): WaterSource[] {
        return this.sources.filter(s => s.status === 'Active');
    }

    submitSource(): void {
        if (!this.newSource.sourceName || !this.newSource.permitNumber || this.newSource.maxAllocatedGallons <= 0) return;
        this.irrigationService.createSource(this.newSource).subscribe(() => {
            this.newSource = {
                sourceName: '',
                permitNumber: '',
                maxAllocatedGallons: 100000
            };
            this.showSourceForm = false;
            this.loadAll();
        });
    }

    submitTelemetry(): void {
        if (!this.telemetry.waterSourceId || this.telemetry.gallonsPumped <= 0) return;
        this.irrigationService.logTelemetry(this.telemetry).subscribe(() => {
            this.telemetry = {
                waterSourceId: '',
                fieldId: '00000000-0000-0000-0000-000000000000',
                gallonsPumped: 2500,
                flowRateGpm: 45,
                costPerGallon: 0.05,
                irrigationDate: new Date().toISOString().split('T')[0],
                notes: ''
            };
            this.loadAll();
        });
    }
}
