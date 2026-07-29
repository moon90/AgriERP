import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IrrigationService, WaterSource, WaterUsageLog, WaterBilling } from './irrigation.service';

@Component({
    selector: 'lib-irrigation',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Water Rights & Irrigation Management</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor water allocations, permit compliance ceilings, log pump telemetry rates, and post GL utility billings.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'sources'" [style.border-bottom]="activeTab === 'sources' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'sources' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💧 Water Permits
        </button>
        
        <button (click)="activeTab = 'telemetry'" [style.border-bottom]="activeTab === 'telemetry' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'telemetry' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📟 Pump Telemetry Simulator
        </button>
        
        <button (click)="activeTab = 'history'" [style.border-bottom]="activeTab === 'history' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'history' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📊 Usage Stream
        </button>

        <button (click)="activeTab = 'billing'" [style.border-bottom]="activeTab === 'billing' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'billing' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💳 Utility Billings
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Water Permits -->
        <div *ngIf="activeTab === 'sources'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showSourceForm = !showSourceForm" class="btn-primary">
              {{ showSourceForm ? 'Close Form' : '➕ Register Water Permit' }}
            </button>
          </div>

          <div *ngIf="showSourceForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Register Water Right / Well Permit</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Source / Well Name</label>
                <input type="text" [(ngModel)]="newSource.sourceName" placeholder="e.g. Deep Aquifer Well 4" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">State Permit No.</label>
                <input type="text" [(ngModel)]="newSource.permitNumber" placeholder="e.g. WTR-PERMIT-882" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Annual Allocation (Gallons)</label>
                <input type="number" [(ngModel)]="newSource.maxAllocatedGallons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitSource()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Save Permit Record
                </button>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let s of sources" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-blue);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ s.sourceName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Permit: {{ s.permitNumber }}</span>
                </div>
                <span class="badge-pill badge-blue">{{ s.status }}</span>
              </div>
              
              <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                <div>Used: <strong style="color: #ffffff;">{{ s.usedGallons | number:'1.0-0' }} GAL</strong> / {{ s.maxAllocatedGallons | number:'1.0-0' }} GAL</div>
                <div>Compliance: <strong style="color: var(--primary-emerald);">{{ s.compliancePercentage }}%</strong></div>
              </div>

              <!-- Progress bar -->
              <div style="background: rgba(15, 23, 42, 0.6); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-glass);">
                <div [style.width.%]="s.compliancePercentage" [style.background]="s.compliancePercentage > 90 ? 'var(--accent-rose)' : 'var(--primary-emerald)'" style="height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Telemetry Simulator -->
        <div *ngIf="activeTab === 'telemetry'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Simulate Irrigation Pump Flow Reading</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Water Source</label>
                <select [(ngModel)]="newLog.waterSourceId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Select Source --</option>
                  <option *ngFor="let s of sources" [value]="s.id">{{ s.sourceName }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Gallons Pumped</label>
                <input type="number" [(ngModel)]="newLog.gallonsPumped" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Flow Rate (GPM)</label>
                <input type="number" [(ngModel)]="newLog.flowRateGpm" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Cost ($/GAL)</label>
                <input type="number" [(ngModel)]="newLog.costPerGallon" step="0.001" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitLog()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Log Pump Cycle
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Usage Stream -->
        <div *ngIf="activeTab === 'history'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Source Name</th>
                <th style="text-align: right;">Gallons Pumped</th>
                <th style="text-align: right;">Flow Rate (GPM)</th>
                <th>Irrigation Date</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of logs">
                <td><strong style="color: #ffffff;">{{ l.sourceName }}</strong></td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ l.gallonsPumped | number:'1.0-0' }} GAL</td>
                <td style="text-align: right; font-family: monospace;">{{ l.flowRateGpm }} GPM</td>
                <td>{{ l.irrigationDate | date:'mediumDate' }}</td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">{{ l.notes }}</td>
              </tr>
              <tr *ngIf="logs.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No irrigation telemetry logs recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 4: Utility Billings -->
        <div *ngIf="activeTab === 'billing'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Source Name</th>
                <th style="text-align: right;">Gallons Billed</th>
                <th style="text-align: right;">Total Fee ($)</th>
                <th>Billing Date</th>
                <th style="text-align: center;">Ledger Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings">
                <td><strong style="color: #ffffff;">{{ b.sourceName }}</strong></td>
                <td style="text-align: right; font-family: monospace;">{{ b.gallonsUsed | number:'1.0-0' }} GAL</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ b.amount | currency:'USD' }}</td>
                <td>{{ b.billingDate | date:'mediumDate' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Posted GL 5220</span>
                </td>
              </tr>
              <tr *ngIf="billings.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No water utility billings recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class IrrigationComponent implements OnInit {
    private irrigationService = inject(IrrigationService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'sources';
    showSourceForm = false;

    sources: WaterSource[] = [];
    logs: WaterUsageLog[] = [];
    billings: WaterBilling[] = [];

    newSource = {
        sourceName: '',
        permitNumber: '',
        maxAllocatedGallons: 500000
    };

    newLog = {
        waterSourceId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        gallonsPumped: 15000,
        flowRateGpm: 450,
        costPerGallon: 0.005,
        notes: ''
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.irrigationService.getPortfolio().subscribe({
            next: (data) => {
                this.sources = data.sources || [];
                this.logs = data.logs || [];
                this.billings = data.billings || [];
                if (this.sources.length > 0 && !this.newLog.waterSourceId) {
                    this.newLog.waterSourceId = this.sources[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching water portfolio:', err)
        });
    }

    submitSource(): void {
        if (!this.newSource.sourceName || !this.newSource.permitNumber) {
            alert('Please fill out Source Name and Permit Number.');
            return;
        }

        this.irrigationService.createSource(this.newSource).subscribe({
            next: () => {
                this.showSourceForm = false;
                this.newSource.sourceName = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save permit: ' + err.message)
        });
    }

    submitLog(): void {
        if (!this.newLog.waterSourceId || !this.newLog.gallonsPumped) {
            alert('Please choose a water source and enter gallons pumped.');
            return;
        }

        const command = {
            ...this.newLog,
            irrigationDate: new Date().toISOString()
        };

        this.irrigationService.logTelemetry(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Irrigation telemetry cycle logged successfully.');
            },
            error: (err) => alert('Failed to log telemetry: ' + err.message)
        });
    }
}
