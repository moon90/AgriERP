import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsService, Asset, MaintenanceLog, DepreciationScheduleLine } from './assets.service';

@Component({
    selector: 'lib-assets',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Asset, Fleet & Equipment Maintenance</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Onboard agricultural machinery, view run hour metrics, schedule repairs, and calculate straight-line depreciation.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Directory
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'directory'" [style.border-bottom]="activeTab === 'directory' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'directory' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🚜 Asset Directory
        </button>
        
        <button (click)="activeTab = 'maintenance'" [style.border-bottom]="activeTab === 'maintenance' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'maintenance' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🔧 Repair & Service Logs
        </button>
        
        <button (click)="activeTab = 'depreciation'" [style.border-bottom]="activeTab === 'depreciation' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'depreciation' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📈 Depreciation Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Asset Directory -->
        <div *ngIf="activeTab === 'directory'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showAssetForm = !showAssetForm" class="btn-primary">
              {{ showAssetForm ? 'Close Form' : '➕ Onboard New Asset' }}
            </button>
          </div>

          <!-- Add Asset Form -->
          <div *ngIf="showAssetForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem; border-left: 4px solid var(--accent-blue);">
            <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">Register Fleet or Machinery Asset</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Asset Name</label>
                <input type="text" [(ngModel)]="newAsset.name" placeholder="e.g. John Deere Tractor 5075E" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Asset Code/Number</label>
                <input type="text" [(ngModel)]="newAsset.assetNumber" placeholder="e.g. EQ-TRACT-09" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Asset Category</label>
                <select [(ngModel)]="newAsset.category" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="Tractor">Tractor / Field Machinery</option>
                  <option value="Harvester">Harvester / Combine</option>
                  <option value="Irrigation">Irrigation / Water Systems</option>
                  <option value="Truck">Trucks / Utility Vehicles</option>
                  <option value="Other">Other Equipment</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Purchase Date</label>
                <input type="date" [(ngModel)]="newAsset.purchaseDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Purchase Price ($)</label>
                <input type="number" [(ngModel)]="newAsset.purchasePrice" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Useful Life (Months)</label>
                <input type="number" [(ngModel)]="newAsset.usefulLifeMonths" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitAsset()" class="btn-primary">
                Save Asset & Initialize
              </button>
            </div>
          </div>

          <!-- Assets Card Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let asset of assets" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-blue); display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div>
                    <h4 style="margin: 0; color: #ffffff; font-size: 1.1rem; font-weight: 700;">{{ asset.name }}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace;">No: {{ asset.assetNumber }} | {{ asset.category }}</span>
                  </div>
                  <span [ngClass]="asset.status === 'Active' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                    {{ asset.status }}
                  </span>
                </div>

                <!-- Metrics Rows -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-main);">
                  <div>⚙️ Hours: <strong>{{ asset.currentRuntimeHours | number:'1.1-1' }} hrs</strong></div>
                  <div>🛣️ Odometer: <strong>{{ asset.currentOdometerKm | number:'1.0-0' }} km</strong></div>
                </div>

                <!-- Financial Row -->
                <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1rem;">
                  <div>📅 Purchase: <strong>{{ asset.purchaseDate | date:'mediumDate' }}</strong></div>
                  <div>💰 Price: <strong style="color: #ffffff;">{{ asset.purchasePrice | currency:'USD' }}</strong></div>
                  <div>📉 Book Value: <strong style="color: var(--primary-emerald);">{{ (asset.purchasePrice - asset.accumulatedDepreciation) | currency:'USD' }}</strong></div>
                </div>
              </div>

              <!-- Depreciation Progress -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">
                  <span>Depreciated: {{ (asset.accumulatedDepreciation / asset.purchasePrice) * 100 | number:'1.0-0' }}%</span>
                  <span>Life: {{ asset.remainingLifeMonths }} / {{ asset.usefulLifeMonths }} mos</span>
                </div>
                <div style="background: rgba(15, 23, 42, 0.6); height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 1rem; border: 1px solid var(--border-glass);">
                  <div [style.width.%]="(asset.accumulatedDepreciation / asset.purchasePrice) * 100" style="background: var(--accent-purple); height: 100%;"></div>
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <button (click)="selectAsset(asset, 'maintenance')" class="badge-pill badge-amber" style="cursor: pointer; border: none;">
                    🔧 Log Service
                  </button>
                  <button (click)="selectAsset(asset, 'depreciation')" class="badge-pill badge-purple" style="cursor: pointer; border: none;">
                    📈 View Schedule
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div *ngIf="assets.length === 0" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            No assets registered. Onboard tractor, fleet or machinery assets above.
          </div>
        </div>

        <!-- Tab 2: Repair & Maintenance Logs -->
        <div *ngIf="activeTab === 'maintenance'">
          <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem;">
            
            <!-- Left Picker Column -->
            <div style="border-right: 1px solid var(--border-glass); padding-right: 1.25rem;">
              <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Select Asset</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 450px; overflow-y: auto;">
                <div *ngFor="let asset of assets" 
                     (click)="setSelectedAsset(asset)"
                     [ngStyle]="{
                       'padding': '10px 14px',
                       'border': '1px solid',
                       'border-color': selectedAsset?.id === asset.id ? 'var(--accent-amber)' : 'var(--border-glass)',
                       'border-radius': '10px',
                       'cursor': 'pointer',
                       'background': selectedAsset?.id === asset.id ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                       'transition': 'all 0.2s'
                     }">
                  <strong style="display: block; font-size: 0.9rem; color: #ffffff;">{{ asset.name }}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">No: {{ asset.assetNumber }}</span>
                </div>
              </div>
            </div>

            <!-- Right Content Log/Form Column -->
            <div>
              <div *ngIf="selectedAsset">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem;">
                  <div>
                    <h3 style="margin: 0; color: var(--accent-amber);">🔧 Service logs for {{ selectedAsset.name }}</h3>
                    <span style="font-size: 0.85rem; color: var(--text-muted);">Status: {{ selectedAsset.status }} | Counters: {{ selectedAsset.currentRuntimeHours }} hrs / {{ selectedAsset.currentOdometerKm }} km</span>
                  </div>
                  <button (click)="showLogForm = !showLogForm" class="btn-primary">
                    {{ showLogForm ? 'Close form' : '➕ Log service entry' }}
                  </button>
                </div>

                <!-- Add Log Form -->
                <div *ngIf="showLogForm" style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); border-left: 4px solid var(--accent-amber); padding: 1.25rem; border-radius: 12px; margin-bottom: 2rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Log Preventative Maintenance / Repair</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Service Type</label>
                      <input type="text" [(ngModel)]="newLog.serviceType" placeholder="e.g. Oil Change, Motor Repair" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Service Date</label>
                      <input type="date" [(ngModel)]="newLog.serviceDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Service Cost ($)</label>
                      <input type="number" [(ngModel)]="newLog.cost" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Performed By</label>
                      <input type="text" [(ngModel)]="newLog.performedBy" placeholder="e.g. Internal mechanic" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Odometer (KM)</label>
                      <input type="number" [(ngModel)]="newLog.odometer" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Run Hours (Hrs)</label>
                      <input type="number" [(ngModel)]="newLog.runtimeHours" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div style="grid-column: span 2;">
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Description Details</label>
                      <input type="text" [(ngModel)]="newLog.description" placeholder="e.g. Changed hydraulic filter and engine oil." style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <button (click)="submitLog()" class="btn-primary" style="width: 100%; justify-content: center;">
                        Log Repair Entry
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Log History Timeline -->
                <table class="modern-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Service Type</th>
                      <th>Details</th>
                      <th>Vendor/By</th>
                      <th style="text-align: right;">Counters</th>
                      <th style="text-align: right;">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let l of logs">
                      <td style="white-space: nowrap;">{{ l.serviceDate | date:'mediumDate' }}</td>
                      <td><strong style="color: #ffffff;">{{ l.serviceType }}</strong></td>
                      <td style="max-width: 250px; font-size: 0.85rem; color: var(--text-muted);">{{ l.description }}</td>
                      <td>{{ l.performedBy }}</td>
                      <td style="text-align: right; font-size: 0.85rem; font-family: monospace;">
                        <span *ngIf="l.runtimeHoursAtService">{{ l.runtimeHoursAtService }} hrs<br></span>
                        <span *ngIf="l.odometerKmAtService">{{ l.odometerKmAtService }} km</span>
                      </td>
                      <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ l.cost | currency:'USD' }}</td>
                    </tr>
                    <tr *ngIf="logs.length === 0">
                      <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No logged repairs or maintenance activities for this asset.</td>
                    </tr>
                  </tbody>
                </table>

              </div>
              <div *ngIf="!selectedAsset" style="padding: 4rem; text-align: center; color: var(--text-muted);">
                👈 Select an asset from the directory on the left to review or log service history.
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Depreciation Ledger -->
        <div *ngIf="activeTab === 'depreciation'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass); padding: 1.25rem; border-radius: 12px; border-left: 4px solid var(--accent-purple);">
            <div>
              <strong style="color: #ffffff; display: block; font-size: 1.05rem;">Process Monthly Depreciation Posting</strong>
              <span style="font-size: 0.85rem; color: var(--text-muted);">Triggers straight-line monthly calculations and generates General Ledger journal entries.</span>
            </div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="date" [(ngModel)]="executionDate" style="padding: 9px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff; font-weight: bold;" />
              <button (click)="runDepreciation()" class="btn-primary">
                ⚙️ Run Depreciation
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem;">
            <!-- Left Picker Column -->
            <div style="border-right: 1px solid var(--border-glass); padding-right: 1.25rem;">
              <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Asset Projection</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 450px; overflow-y: auto;">
                <div *ngFor="let asset of assets" 
                     (click)="setSelectedAsset(asset)"
                     [ngStyle]="{
                       'padding': '10px 14px',
                       'border': '1px solid',
                       'border-color': selectedAsset?.id === asset.id ? 'var(--accent-purple)' : 'var(--border-glass)',
                       'border-radius': '10px',
                       'cursor': 'pointer',
                       'background': selectedAsset?.id === asset.id ? 'rgba(139, 92, 246, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                       'transition': 'all 0.2s'
                     }">
                  <strong style="display: block; font-size: 0.9rem; color: #ffffff;">{{ asset.name }}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">Price: {{ asset.purchasePrice | currency:'USD' }}</span>
                </div>
              </div>
            </div>

            <!-- Right Schedule Projection -->
            <div>
              <div *ngIf="selectedAsset">
                <h4 style="margin: 0 0 1rem 0; color: var(--accent-purple);">Projected Straight-Line Schedule: {{ selectedAsset.name }}</h4>
                <div style="margin-bottom: 1.5rem; background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); padding: 1rem; border-radius: 10px; font-size: 0.9rem; display: flex; justify-content: space-between; color: var(--text-main);">
                  <span>Initial Cost: <strong>{{ selectedAsset.purchasePrice | currency:'USD' }}</strong></span>
                  <span>Useful Life: <strong>{{ selectedAsset.usefulLifeMonths }} months</strong></span>
                  <span>Monthly Depreciation: <strong>{{ (selectedAsset.purchasePrice / selectedAsset.usefulLifeMonths) | currency:'USD' }}</strong></span>
                </div>

                <table class="modern-table">
                  <thead>
                    <tr>
                      <th style="text-align: center;">Month</th>
                      <th>Estimated Post Date</th>
                      <th style="text-align: right;">Depreciation Expense</th>
                      <th style="text-align: right;">Accumulated Balance</th>
                      <th style="text-align: right;">Asset Book Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let line of schedule">
                      <td style="text-align: center; font-weight: bold; font-family: monospace;">#{{ line.monthIndex }}</td>
                      <td>{{ line.date | date:'mediumDate' }}</td>
                      <td style="text-align: right; font-family: monospace; color: var(--accent-rose);">{{ line.monthlyDepreciation | currency:'USD' }}</td>
                      <td style="text-align: right; font-family: monospace; color: var(--text-main);">{{ line.accumulatedDepreciation | currency:'USD' }}</td>
                      <td style="text-align: right; font-family: monospace; font-weight: bold;" [style.color]="line.remainingBookValue > 0 ? 'var(--primary-emerald)' : 'var(--text-muted)'">
                        {{ line.remainingBookValue | currency:'USD' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div *ngIf="!selectedAsset" style="padding: 4rem; text-align: center; color: var(--text-muted);">
                👈 Select an asset from the picker on the left to compute straight-line depreciation projections.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `
})
export class AssetsComponent implements OnInit {
    private assetsService = inject(AssetsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: 'directory' | 'maintenance' | 'depreciation' = 'directory';

    assets: Asset[] = [];
    logs: MaintenanceLog[] = [];
    schedule: DepreciationScheduleLine[] = [];

    selectedAsset?: Asset;

    showAssetForm = false;
    newAsset = {
        name: '',
        assetNumber: '',
        category: 'Tractor',
        purchaseDate: new Date().toISOString().substring(0, 10),
        purchasePrice: 15000,
        usefulLifeMonths: 60
    };

    showLogForm = false;
    newLog = {
        serviceType: '',
        serviceDate: new Date().toISOString().substring(0, 10),
        cost: 150,
        performedBy: '',
        description: '',
        odometer: 0,
        runtimeHours: 0
    };

    executionDate = new Date().toISOString().substring(0, 10);

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.assetsService.getAssets().subscribe({
            next: (data) => {
                this.assets = data;
                if (data.length > 0 && !this.selectedAsset) {
                    this.setSelectedAsset(data[0]);
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching assets:', err)
        });
    }

    setSelectedAsset(asset: Asset): void {
        this.selectedAsset = asset;
        this.newLog.odometer = asset.currentOdometerKm;
        this.newLog.runtimeHours = asset.currentRuntimeHours;
        
        this.assetsService.getMaintenanceLogs(asset.id).subscribe({
            next: (data) => {
                this.logs = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching logs:', err)
        });

        this.assetsService.getDepreciationSchedule(asset.id).subscribe({
            next: (data) => {
                this.schedule = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching schedule:', err)
        });
    }

    selectAsset(asset: Asset, tab: 'maintenance' | 'depreciation'): void {
        this.activeTab = tab;
        this.setSelectedAsset(asset);
    }

    submitAsset(): void {
        if (!this.newAsset.name || !this.newAsset.assetNumber) {
            alert('Please fill out Name and Asset Number.');
            return;
        }

        const command = {
            name: this.newAsset.name,
            assetNumber: this.newAsset.assetNumber,
            category: this.newAsset.category,
            purchaseDate: this.newAsset.purchaseDate,
            purchasePrice: this.newAsset.purchasePrice,
            usefulLifeMonths: this.newAsset.usefulLifeMonths
        };

        this.assetsService.createAsset(command).subscribe({
            next: (res) => {
                this.showAssetForm = false;
                this.newAsset.name = '';
                this.newAsset.assetNumber = '';
                this.loadAll();
                alert('Asset onboarded successfully.');
            },
            error: (err) => alert('Failed to onboard asset: ' + (err.error?.error || err.message))
        });
    }

    submitLog(): void {
        if (!this.selectedAsset) return;
        if (!this.newLog.serviceType || !this.newLog.performedBy) {
            alert('Please enter Service Type and Performed By.');
            return;
        }

        const command = {
            assetId: this.selectedAsset.id,
            serviceType: this.newLog.serviceType,
            serviceDate: this.newLog.serviceDate,
            cost: this.newLog.cost,
            performedBy: this.newLog.performedBy,
            description: this.newLog.description,
            runtimeHoursAtService: this.newLog.runtimeHours,
            odometerKmAtService: this.newLog.odometer
        };

        this.assetsService.logMaintenance(command).subscribe({
            next: () => {
                this.showLogForm = false;
                this.newLog.serviceType = '';
                this.newLog.description = '';
                this.setSelectedAsset(this.selectedAsset!);
                this.loadAll();
                alert('Service log posted successfully.');
            },
            error: (err) => alert('Failed to log service: ' + (err.error?.error || err.message))
        });
    }

    runDepreciation(): void {
        const command = {
            executionDate: this.executionDate
        };

        this.assetsService.runDepreciation(command).subscribe({
            next: (res) => {
                alert(`Monthly depreciation run successfully. Total posted amount: $${res.totalDepreciatedAmount.toFixed(2)}`);
                this.loadAll();
                if (this.selectedAsset) {
                    this.setSelectedAsset(this.selectedAsset);
                }
            },
            error: (err) => alert('Failed to run depreciation: ' + (err.error?.error || err.message))
        });
    }

    getStatusColor(status: string): string {
        switch (status.toLowerCase()) {
            case 'active': return '#2ecc71';
            case 'undermaintenance': return '#e67e22';
            case 'retired': return '#7f8c8d';
            default: return '#34495e';
        }
    }
}
