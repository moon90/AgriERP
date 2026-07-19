import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssetsService, Asset, MaintenanceLog, DepreciationScheduleLine } from './assets.service';

@Component({
    selector: 'lib-assets',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Asset, Fleet & Equipment Maintenance</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Onboard agricultural machinery, view run hour metrics, schedule repairs, and calculate straight-line depreciation.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #34495e; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Directory
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'directory'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'directory' ? '#3498db' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'directory' ? '3px solid #3498db' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🚜 Asset Directory
        </button>
        
        <button (click)="activeTab = 'maintenance'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'maintenance' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'maintenance' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🔧 Repair & Service Logs
        </button>
        
        <button (click)="activeTab = 'depreciation'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'depreciation' ? '#9b59b6' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'depreciation' ? '3px solid #9b59b6' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📈 Depreciation Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Asset Directory -->
        <div *ngIf="activeTab === 'directory'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showAssetForm = !showAssetForm" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showAssetForm ? 'Close Registration Form' : '➕ Onboard New Asset' }}
            </button>
          </div>

          <!-- Add Asset Form -->
          <div *ngIf="showAssetForm" style="background: #edf7fd; border: 1px solid #b3e5fc; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #3498db;">
            <h4 style="margin: 0 0 1.25rem 0; color: #0288d1; font-size: 1.1rem;">Register Fleet or Machinery Asset</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Asset Name</label>
                <input type="text" [(ngModel)]="newAsset.name" placeholder="e.g. John Deere Tractor 5075E" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Asset Code/Number</label>
                <input type="text" [(ngModel)]="newAsset.assetNumber" placeholder="e.g. EQ-TRACT-09" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Asset Category</label>
                <select [(ngModel)]="newAsset.category" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="Tractor">Tractor / Field Machinery</option>
                  <option value="Harvester">Harvester / Combine</option>
                  <option value="Irrigation">Irrigation / Water Systems</option>
                  <option value="Truck">Trucks / Utility Vehicles</option>
                  <option value="Other">Other Equipment</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Purchase Date</label>
                <input type="date" [(ngModel)]="newAsset.purchaseDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Purchase Price ($)</label>
                <input type="number" [(ngModel)]="newAsset.purchasePrice" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Useful Life (Months)</label>
                <input type="number" [(ngModel)]="newAsset.usefulLifeMonths" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitAsset()" style="padding: 10px 24px; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Asset & Initialize
              </button>
            </div>
          </div>

          <!-- Assets Card Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let asset of assets" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #3498db; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                  <div>
                    <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">{{ asset.name }}</h4>
                    <span style="font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">No: {{ asset.assetNumber }} | {{ asset.category }}</span>
                  </div>
                  <span [ngStyle]="{
                    'background-color': getStatusColor(asset.status),
                    'color': 'white',
                    'padding': '3px 8px',
                    'border-radius': '4px',
                    'font-size': '0.75rem',
                    'font-weight': 'bold'
                  }">
                    {{ asset.status }}
                  </span>
                </div>

                <!-- Metrics Rows -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background: #f8fafc; padding: 8px; border-radius: 6px; margin-bottom: 1rem; font-size: 0.85rem; color: #34495e;">
                  <div>⚙️ Hours: <strong>{{ asset.currentRuntimeHours | number:'1.1-1' }} hrs</strong></div>
                  <div>🛣️ Odometer: <strong>{{ asset.currentOdometerKm | number:'1.0-0' }} km</strong></div>
                </div>

                <!-- Financial Row -->
                <div style="font-size: 0.85rem; color: #34495e; line-height: 1.5; margin-bottom: 1rem;">
                  <div>📅 Purchase: <strong>{{ asset.purchaseDate | date:'mediumDate' }}</strong></div>
                  <div>💰 Price: <strong>{{ asset.purchasePrice | currency:'USD' }}</strong></div>
                  <div>📉 Book Value: <strong>{{ (asset.purchasePrice - asset.accumulatedDepreciation) | currency:'USD' }}</strong></div>
                </div>
              </div>

              <!-- Depreciation Progress -->
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #7f8c8d; margin-bottom: 0.25rem;">
                  <span>Depreciated: {{ (asset.accumulatedDepreciation / asset.purchasePrice) * 100 | number:'1.0-0' }}%</span>
                  <span>Life remaining: {{ asset.remainingLifeMonths }} / {{ asset.usefulLifeMonths }} mos</span>
                </div>
                <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 0.75rem;">
                  <div [style.width.%]="(asset.accumulatedDepreciation / asset.purchasePrice) * 100" style="background-color: #9b59b6; height: 100%;"></div>
                </div>

                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                  <button (click)="selectAsset(asset, 'maintenance')" style="padding: 5px 10px; background: #e67e22; color: white; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">
                    🔧 Log Service
                  </button>
                  <button (click)="selectAsset(asset, 'depreciation')" style="padding: 5px 10px; background: #9b59b6; color: white; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">
                    📈 View Schedule
                  </button>
                </div>
              </div>

            </div>
          </div>
          <div *ngIf="assets.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No assets registered. Onboard tractor, fleet or machinery assets above.
          </div>
        </div>

        <!-- Tab 2: Repair & Maintenance Logs -->
        <div *ngIf="activeTab === 'maintenance'">
          <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
            
            <!-- Left Picker Column -->
            <div style="border-right: 1px solid #eef2f5; padding-right: 1.5rem;">
              <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">Select Asset</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 450px; overflow-y: auto;">
                <div *ngFor="let asset of assets" 
                     (click)="setSelectedAsset(asset)"
                     [ngStyle]="{
                       'padding': '10px',
                       'border': '1px solid',
                       'border-color': selectedAsset?.id === asset.id ? '#e67e22' : '#eef2f5',
                       'border-radius': '6px',
                       'cursor': 'pointer',
                       'background-color': selectedAsset?.id === asset.id ? '#fdf6f0' : 'transparent',
                       'transition': 'all 0.2s'
                     }">
                  <strong style="display: block; font-size: 0.9rem; color: #2c3e50;">{{ asset.name }}</strong>
                  <span style="font-size: 0.75rem; color: #7f8c8d; font-family: monospace;">No: {{ asset.assetNumber }}</span>
                </div>
              </div>
            </div>

            <!-- Right Content Log/Form Column -->
            <div>
              <div *ngIf="selectedAsset">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #f8f9fa; padding-bottom: 0.5rem;">
                  <div>
                    <h3 style="margin: 0; color: #e67e22;">🔧 Service logs for {{ selectedAsset.name }}</h3>
                    <span style="font-size: 0.85rem; color: #7f8c8d;">Status: {{ selectedAsset.status }} | Current counters: {{ selectedAsset.currentRuntimeHours }} hrs / {{ selectedAsset.currentOdometerKm }} km</span>
                  </div>
                  <button (click)="showLogForm = !showLogForm" style="padding: 6px 12px; background: #e67e22; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.8rem;">
                    {{ showLogForm ? 'Close form' : '➕ Log service entry' }}
                  </button>
                </div>

                <!-- Add Log Form -->
                <div *ngIf="showLogForm" style="background: #fdfaf7; border: 1px solid #f5cba7; border-left: 5px solid #e67e22; padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #d35400;">Log Preventative Maintenance / Repair</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Service Type</label>
                      <input type="text" [(ngModel)]="newLog.serviceType" placeholder="e.g. Oil Change, Motor Repair" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Service Date</label>
                      <input type="date" [(ngModel)]="newLog.serviceDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Service Cost ($)</label>
                      <input type="number" [(ngModel)]="newLog.cost" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Performed By</label>
                      <input type="text" [(ngModel)]="newLog.performedBy" placeholder="e.g. Internal mechanic, Dealership" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Odometer (KM)</label>
                      <input type="number" [(ngModel)]="newLog.odometer" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Run Hours (Hrs)</label>
                      <input type="number" [(ngModel)]="newLog.runtimeHours" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div style="grid-column: span 2;">
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Description Details</label>
                      <input type="text" [(ngModel)]="newLog.description" placeholder="e.g. Changed hydraulic filter and engine oil. Balanced wheels." style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <button (click)="submitLog()" style="width: 100%; padding: 9px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                        Log Repair Entry
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Log History Timeline -->
                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
                      <th style="padding: 1rem 0.5rem;">Date</th>
                      <th style="padding: 1rem 0.5rem;">Service Type</th>
                      <th style="padding: 1rem 0.5rem;">Details</th>
                      <th style="padding: 1rem 0.5rem;">Vendor/By</th>
                      <th style="padding: 1rem 0.5rem; text-align: right;">Counters</th>
                      <th style="padding: 1rem 0.5rem; text-align: right;">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let l of logs" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
                      <td style="padding: 1rem 0.5rem; white-space: nowrap;">{{ l.serviceDate | date:'mediumDate' }}</td>
                      <td style="padding: 1rem 0.5rem;"><strong>{{ l.serviceType }}</strong></td>
                      <td style="padding: 1rem 0.5rem; max-width: 250px; font-size: 0.85rem; color: #7f8c8d;">{{ l.description }}</td>
                      <td style="padding: 1rem 0.5rem;">{{ l.performedBy }}</td>
                      <td style="padding: 1rem 0.5rem; text-align: right; font-size: 0.85rem; font-family: monospace;">
                        <span *ngIf="l.runtimeHoursAtService">{{ l.runtimeHoursAtService }} hrs<br></span>
                        <span *ngIf="l.odometerKmAtService">{{ l.odometerKmAtService }} km</span>
                      </td>
                      <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold; color: #c0392b;">{{ l.cost | currency:'USD' }}</td>
                    </tr>
                    <tr *ngIf="logs.length === 0" style="text-align: center; color: #95a5a6;">
                      <td colspan="6" style="padding: 2rem;">No logged repairs or maintenance activities for this asset.</td>
                    </tr>
                  </tbody>
                </table>

              </div>
              <div *ngIf="!selectedAsset" style="padding: 4rem; text-align: center; color: #95a5a6;">
                👈 Select an asset from the directory on the left to review or log service history.
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Depreciation Ledger -->
        <div *ngIf="activeTab === 'depreciation'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; background: #fdfefe; border: 1px solid #eef2f5; padding: 1.25rem; border-radius: 8px; border-left: 5px solid #9b59b6;">
            <div>
              <strong style="color: #2c3e50; display: block; font-size: 1.05rem;">Process Monthly Depreciation Posting</strong>
              <span style="font-size: 0.85rem; color: #7f8c8d;">Triggers straight-line monthly calculations and generates General Ledger journal entries (Debit 5500 / Credit 1250).</span>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="date" [(ngModel)]="executionDate" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: bold;" />
              <button (click)="runDepreciation()" style="padding: 9px 20px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                ⚙️ Run Depreciation
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 300px 1fr; gap: 2rem;">
            <!-- Left Picker Column -->
            <div style="border-right: 1px solid #eef2f5; padding-right: 1.5rem;">
              <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">Asset Projection</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 450px; overflow-y: auto;">
                <div *ngFor="let asset of assets" 
                     (click)="setSelectedAsset(asset)"
                     [ngStyle]="{
                       'padding': '10px',
                       'border': '1px solid',
                       'border-color': selectedAsset?.id === asset.id ? '#9b59b6' : '#eef2f5',
                       'border-radius': '6px',
                       'cursor': 'pointer',
                       'background-color': selectedAsset?.id === asset.id ? '#faf5fc' : 'transparent',
                       'transition': 'all 0.2s'
                     }">
                  <strong style="display: block; font-size: 0.9rem; color: #2c3e50;">{{ asset.name }}</strong>
                  <span style="font-size: 0.75rem; color: #7f8c8d; font-family: monospace;">Price: {{ asset.purchasePrice | currency:'USD' }}</span>
                </div>
              </div>
            </div>

            <!-- Right Schedule Projection -->
            <div>
              <div *ngIf="selectedAsset">
                <h4 style="margin: 0 0 1rem 0; color: #9b59b6;">Projected Straight-Line Schedule: {{ selectedAsset.name }}</h4>
                <div style="margin-bottom: 1.5rem; background: #fafafb; padding: 1rem; border-radius: 6px; font-size: 0.9rem; display: flex; justify-content: space-between; color: #34495e;">
                  <span>Initial Cost: <strong>{{ selectedAsset.purchasePrice | currency:'USD' }}</strong></span>
                  <span>Useful Life: <strong>{{ selectedAsset.usefulLifeMonths }} months</strong></span>
                  <span>Monthly Depreciation: <strong>{{ (selectedAsset.purchasePrice / selectedAsset.usefulLifeMonths) | currency:'USD' }}</strong></span>
                </div>

                <table style="width: 100%; border-collapse: collapse; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
                      <th style="padding: 0.75rem 0.5rem; text-align: center;">Month</th>
                      <th style="padding: 0.75rem 0.5rem;">Estimated Post Date</th>
                      <th style="padding: 0.75rem 0.5rem; text-align: right;">Depreciation Expense</th>
                      <th style="padding: 0.75rem 0.5rem; text-align: right;">Accumulated Balance</th>
                      <th style="padding: 0.75rem 0.5rem; text-align: right;">Asset Book Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let line of schedule" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
                      <td style="padding: 0.75rem 0.5rem; text-align: center; font-weight: bold; font-family: monospace;">#{{ line.monthIndex }}</td>
                      <td style="padding: 0.75rem 0.5rem;">{{ line.date | date:'mediumDate' }}</td>
                      <td style="padding: 0.75rem 0.5rem; text-align: right; font-family: monospace; color: #c0392b;">{{ line.monthlyDepreciation | currency:'USD' }}</td>
                      <td style="padding: 0.75rem 0.5rem; text-align: right; font-family: monospace; color: #34495e;">{{ line.accumulatedDepreciation | currency:'USD' }}</td>
                      <td style="padding: 0.75rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold;" [style.color]="line.remainingBookValue > 0 ? '#27ae60' : '#7f8c8d'">
                        {{ line.remainingBookValue | currency:'USD' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div *ngIf="!selectedAsset" style="padding: 4rem; text-align: center; color: #95a5a6;">
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

    // Forms states
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
        
        // Fetch logs
        this.assetsService.getMaintenanceLogs(asset.id).subscribe({
            next: (data) => {
                this.logs = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching logs:', err)
        });

        // Fetch schedule
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
