import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropsService, CropField, CropCycle } from './crops.service';

@Component({
    selector: 'lib-crops',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Lifecycle Management & Yield Forecasting</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Map farming fields, organize growing seasons, log field treatments, forecast yield outputs, and monitor WIP capitalization ledgers.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Directory
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'fields'" [style.border-bottom]="activeTab === 'fields' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'fields' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🗺️ Field Directory
        </button>
        
        <button (click)="activeTab = 'cycles'" [style.border-bottom]="activeTab === 'cycles' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'cycles' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🌱 Crop Cycles & Activities
        </button>
        
        <button (click)="activeTab = 'yields'" [style.border-bottom]="activeTab === 'yields' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'yields' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📊 Yield Forecast & Analytics
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Field Directory -->
        <div *ngIf="activeTab === 'fields'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <!-- Search & Filter Controls -->
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <input type="text" [(ngModel)]="searchTerm" (input)="onSearchChange()" placeholder="🔍 Search field name..." style="padding: 10px 14px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff; font-size: 0.9rem; min-width: 220px;" />
              <button (click)="toggleSort()" class="btn-secondary">
                Sort: {{ sortOrder === 'asc' ? 'A ➔ Z ▲' : 'Z ➔ A ▼' }}
              </button>
            </div>

            <button (click)="showFieldForm = !showFieldForm" class="btn-primary">
              {{ showFieldForm ? 'Close Form' : '➕ Add Field Plot' }}
            </button>
          </div>

          <!-- Add Field Form -->
          <div *ngIf="showFieldForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem; border-left: 4px solid var(--primary-emerald);">
            <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">Configure New Farming Plot</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Field Name</label>
                <input type="text" [(ngModel)]="newField.name" placeholder="e.g. Sector-B Upper Slope" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Area Size (Acres)</label>
                <input type="number" [(ngModel)]="newField.areaAcres" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Soil Classification</label>
                <select [(ngModel)]="newField.soilType" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="Loam">Loam (Optimal: 1.2x factor)</option>
                  <option value="Clay">Clay (Moderate: 0.9x factor)</option>
                  <option value="Sandy">Sandy (Low: 0.7x factor)</option>
                  <option value="Loamy Sand">Other (Standard: 1.0x factor)</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitField()" class="btn-primary">
                Save Field Config
              </button>
            </div>
          </div>

          <!-- Fields Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let field of fields" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald);">
              <h4 style="margin: 0 0 0.5rem 0; color: #ffffff; font-size: 1.1rem; font-weight: 700;">🗺️ {{ field.name }}</h4>
              <div style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                <div>📐 Dimensions: <strong style="color: #ffffff;">{{ field.areaAcres }} Acres</strong></div>
                <div>🍂 Soil Profile: <strong style="color: var(--primary-emerald);">{{ field.soilType }}</strong></div>
              </div>
              <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                <button (click)="startCycleForField(field)" class="btn-primary" style="font-size: 0.8rem; padding: 6px 12px;">
                  🌱 Start Plant Cycle
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="fields.length === 0" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            No agricultural fields configured. Create a crop field plot above to initialize seasons.
          </div>
        </div>

        <!-- Tab 2: Crop Cycles & Activities -->
        <div *ngIf="activeTab === 'cycles'">
          <div style="display: grid; grid-template-columns: 320px 1fr; gap: 1.5rem; flex-wrap: wrap;">
            
            <!-- Left Cycles List Column -->
            <div style="border-right: 1px solid var(--border-glass); padding-right: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="margin: 0; color: #ffffff;">Active Plantings</h4>
                <button (click)="showCycleForm = !showCycleForm" class="btn-primary" style="font-size: 0.78rem; padding: 4px 10px;">
                  {{ showCycleForm ? 'Cancel' : '➕ Plant' }}
                </button>
              </div>

              <!-- Setup Cycle Form -->
              <div *ngIf="showCycleForm" style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; font-size: 0.85rem;">
                <h5 style="margin: 0 0 0.75rem 0; color: var(--accent-blue);">Start Plant Cycle</h5>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem;">Select Field</label>
                    <select [(ngModel)]="newCycle.fieldId" style="width: 100%; padding: 8px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 6px; color: #ffffff;">
                      <option *ngFor="let f of fields" [value]="f.id">{{ f.name }} ({{ f.areaAcres }} Ac)</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem;">Crop Class</label>
                    <select [(ngModel)]="newCycle.cropType" style="width: 100%; padding: 8px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 6px; color: #ffffff;">
                      <option value="Corn">Corn (4.5t Base)</option>
                      <option value="Wheat">Wheat (2.2t Base)</option>
                      <option value="Soybeans">Soybeans (1.8t Base)</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem;">Crop Variety</label>
                    <input type="text" [(ngModel)]="newCycle.cropVariety" placeholder="e.g. Premium Pioneer X" style="width: 100%; padding: 8px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 6px; color: #ffffff;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.2rem;">Planting Date</label>
                    <input type="date" [(ngModel)]="newCycle.plantingDate" style="width: 100%; padding: 8px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 6px; color: #ffffff;" />
                  </div>
                  <button (click)="submitCycle()" class="btn-primary" style="width: 100%; justify-content: center;">
                    Launch Planting Cycle
                  </button>
                </div>
              </div>

              <!-- Cycles Picker List -->
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto;">
                <div *ngFor="let cycle of cycles" 
                     (click)="setSelectedCycle(cycle)"
                     [ngStyle]="{
                       'padding': '10px 14px',
                       'border': '1px solid',
                       'border-color': selectedCycle?.id === cycle.id ? 'var(--accent-blue)' : 'var(--border-glass)',
                       'border-radius': '10px',
                       'cursor': 'pointer',
                       'background': selectedCycle?.id === cycle.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.6)',
                       'transition': 'all 0.2s'
                     }">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="display: block; font-size: 0.88rem; color: #ffffff;">🌱 {{ cycle.cropType }}</strong>
                    <span [ngClass]="cycle.status === 'Harvested' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">{{ cycle.status }}</span>
                  </div>
                  <span style="font-size: 0.75rem; color: var(--text-muted);">Field: {{ cycle.fieldName }}</span>
                </div>
              </div>
            </div>

            <!-- Right Crop Cycle Management Column -->
            <div>
              <div *ngIf="selectedCycle">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
                  <div>
                    <h3 style="margin: 0; color: var(--accent-blue);">{{ selectedCycle.cropType }} - {{ selectedCycle.cropVariety }}</h3>
                    <p style="margin: 0.2rem 0 0 0; font-size: 0.85rem; color: var(--text-muted);">
                      Field plot: <strong>{{ selectedCycle.fieldName }}</strong> | Plant date: {{ selectedCycle.plantingDate | date:'mediumDate' }}
                    </p>
                  </div>
                  <div style="display: flex; gap: 0.5rem;" *ngIf="selectedCycle.status !== 'Harvested'">
                    <button (click)="showActivityForm = !showActivityForm" class="btn-secondary">
                      ⚙️ Log Treatment
                    </button>
                    <button (click)="showHarvestForm = !showHarvestForm" class="btn-primary">
                      🌾 Harvest Crop
                    </button>
                  </div>
                </div>

                <!-- Treatment Forms Panel -->
                <div *ngIf="showActivityForm" style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); border-left: 4px solid var(--accent-amber); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1rem;">Log Seeding, Tilling, or Fertilizer Application</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Activity Class</label>
                      <select [(ngModel)]="newActivity.activityType" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                        <option value="Tilling">Tilling (+10% Yield factor)</option>
                        <option value="Fertilizer">Fertilizer Application (+15% Yield factor)</option>
                        <option value="Pesticide">Pesticide Spray (+10% Yield factor)</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Treatment Cost ($)</label>
                      <input type="number" [(ngModel)]="newActivity.cost" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Execution Date</label>
                      <input type="date" [(ngModel)]="newActivity.activityDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Notes</label>
                      <input type="text" [(ngModel)]="newActivity.notes" placeholder="e.g. NPK 10-20-20 input" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                  </div>
                  <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                    <button (click)="submitActivity()" class="btn-primary">
                      Apply Capitalization Entry
                    </button>
                  </div>
                </div>

                <!-- Harvest Form Panel -->
                <div *ngIf="showHarvestForm" style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); border-left: 4px solid var(--primary-emerald); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.5rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1rem;">Complete Season & Record Harvest Yield</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Harvest Date</label>
                      <input type="date" [(ngModel)]="harvest.harvestDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Actual Yield (Tons)</label>
                      <input type="number" [(ngModel)]="harvest.actualYieldTons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                    </div>
                  </div>
                  <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                    <button (click)="submitHarvest()" class="btn-primary">
                      Release WIP & Record Harvest
                    </button>
                  </div>
                </div>

                <!-- Status Panel Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
                  <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">DYNAMIC YIELD FORECAST</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: var(--accent-blue);">{{ selectedCycle.expectedYieldTons | number:'1.1-2' }} Tons</div>
                  </div>
                  
                  <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; text-align: center;">
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">CAPITALIZED CROP WIP COST</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: var(--accent-amber);">{{ selectedCycle.accumulatedWipCost | currency:'USD' }}</div>
                  </div>

                  <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; text-align: center;" *ngIf="selectedCycle.status === 'Harvested'">
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.35rem;">RECORDED ACTUAL YIELD</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: var(--primary-emerald);">{{ selectedCycle.actualYieldTons }} Tons</div>
                  </div>
                </div>

                <!-- Efficiency Metrics Panel -->
                <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); border-radius: 12px; padding: 1.25rem; border-left: 4px solid var(--accent-purple);">
                  <h4 style="margin: 0 0 0.75rem 0; color: var(--accent-purple); font-size: 0.95rem;">🚜 Cost Efficiency & Production Analytics</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; color: var(--text-main);">
                    <div>WIP Cost per Expected Ton: <strong>{{ selectedCycle.costPerExpectedTon | currency:'USD' }} / Ton</strong></div>
                    <div *ngIf="selectedCycle.costPerActualTon">WIP Cost per Actual Ton: <strong>{{ selectedCycle.costPerActualTon | currency:'USD' }} / Ton</strong></div>
                  </div>
                </div>

              </div>
              <div *ngIf="!selectedCycle" style="padding: 4rem; text-align: center; color: var(--text-muted);">
                Select a planting cycle from the sidebar list to configure treatments, view yield predictions, or close harvests.
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Yield Forecast & Analytics -->
        <div *ngIf="activeTab === 'yields'">
          <h4 style="margin: 0 0 1rem 0; color: var(--accent-purple);">📊 Dynamic Forecast Coefficients & Agricultural Factors</h4>
          <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 2rem;">
            Expected crop output is projected dynamically by combining field area dimensions with crop-specific coefficients, corrected by soil drainage variables and farm service completion points.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
            
            <!-- Soil Mappings -->
            <div style="border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; background: rgba(30, 41, 59, 0.6);">
              <h5 style="margin: 0 0 0.75rem 0; color: #ffffff; font-size: 1rem;">🍂 Soil Drainage Multipliers</h5>
              <table class="modern-table" style="font-size: 0.85rem;">
                <thead>
                  <tr>
                    <th>Classification</th>
                    <th style="text-align: right;">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Loam Soil</td>
                    <td style="text-align: right; font-weight: bold; color: var(--primary-emerald);">1.20x</td>
                  </tr>
                  <tr>
                    <td>Clay Soil</td>
                    <td style="text-align: right; font-weight: bold; color: var(--accent-amber);">0.90x</td>
                  </tr>
                  <tr>
                    <td>Sandy Soil</td>
                    <td style="text-align: right; font-weight: bold; color: var(--accent-rose);">0.70x</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Treatments Mappings -->
            <div style="border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; background: rgba(30, 41, 59, 0.6);">
              <h5 style="margin: 0 0 0.75rem 0; color: #ffffff; font-size: 1rem;">🚜 Activity Factors (Base: 0.65)</h5>
              <table class="modern-table" style="font-size: 0.85rem;">
                <thead>
                  <tr>
                    <th>Activity Type</th>
                    <th style="text-align: right;">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Tilling Completion</td>
                    <td style="text-align: right; font-weight: bold; color: var(--accent-blue);">+10%</td>
                  </tr>
                  <tr>
                    <td>Fertilizer Treatment</td>
                    <td style="text-align: right; font-weight: bold; color: var(--accent-blue);">+15%</td>
                  </tr>
                  <tr>
                    <td>Pesticide Coverage</td>
                    <td style="text-align: right; font-weight: bold; color: var(--accent-blue);">+10%</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- Active Yield Comparison Table -->
          <h5 style="margin: 0 0 1rem 0; color: #ffffff;">Active Plant Cycles Performance & WIP Cost Summary</h5>
          <table class="modern-table">
            <thead>
              <tr>
                <th>Plot Name</th>
                <th>Crop</th>
                <th>Status</th>
                <th style="text-align: right;">Expected Yield</th>
                <th style="text-align: right;">Actual Yield</th>
                <th style="text-align: right;">WIP Accrued</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cycle of cycles">
                <td><strong style="color: #ffffff;">{{ cycle.fieldName }}</strong></td>
                <td>{{ cycle.cropType }} ({{ cycle.cropVariety }})</td>
                <td>
                  <span [ngClass]="cycle.status === 'Harvested' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                    {{ cycle.status }}
                  </span>
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-blue);">{{ cycle.expectedYieldTons }} Tons</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ cycle.actualYieldTons ? cycle.actualYieldTons + ' Tons' : 'Growing' }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-amber);">{{ cycle.accumulatedWipCost | currency:'USD' }}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class CropsComponent implements OnInit {
    private cropsService = inject(CropsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'fields';
    fields: CropField[] = [];
    cycles: CropCycle[] = [];
    selectedCycle?: CropCycle;

    searchTerm: string = '';
    sortOrder: 'asc' | 'desc' = 'asc';
    pageNumber: number = 1;
    pageSize: number = 5;
    totalCount: number = 0;
    totalPages: number = 1;

    showFieldForm: boolean = false;
    showCycleForm: boolean = false;
    showActivityForm: boolean = false;
    showHarvestForm: boolean = false;

    newField = { name: '', areaAcres: 5, soilType: 'Loam' };
    newCycle = { fieldId: '', cropType: 'Corn', cropVariety: '', plantingDate: '' };
    newActivity = { activityType: 'Tilling', cost: 100, activityDate: '', notes: '' };
    harvest = { harvestDate: '', actualYieldTons: 0 };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.cropsService.getFieldsPaged({
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            search: this.searchTerm,
            sortOrder: this.sortOrder
        }).subscribe(res => {
            this.fields = res.items;
            this.totalCount = res.totalCount;
            this.totalPages = res.totalPages;
            if (res.items.length > 0) {
                this.newCycle.fieldId = res.items[0].id;
            }
            this.cdr.detectChanges();
        });

        this.cropsService.getCycles().subscribe(c => {
            this.cycles = c;
            if (this.selectedCycle) {
                const found = c.find(x => x.id === this.selectedCycle?.id);
                if (found) this.selectedCycle = found;
            }
            this.cdr.detectChanges();
        });
    }

    onSearchChange(): void {
        this.pageNumber = 1;
        this.loadAll();
    }

    toggleSort(): void {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        this.loadAll();
    }

    prevPage(): void {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadAll();
        }
    }

    nextPage(): void {
        if (this.pageNumber < this.totalPages) {
            this.pageNumber++;
            this.loadAll();
        }
    }

    submitField(): void {
        if (!this.newField.name || this.newField.areaAcres <= 0) return;
        this.cropsService.createField(this.newField).subscribe(() => {
            this.newField = { name: '', areaAcres: 5, soilType: 'Loam' };
            this.showFieldForm = false;
            this.loadAll();
        });
    }

    startCycleForField(field: CropField): void {
        this.newCycle.fieldId = field.id;
        this.activeTab = 'cycles';
        this.showCycleForm = true;
    }

    submitCycle(): void {
        if (!this.newCycle.fieldId || !this.newCycle.cropVariety || !this.newCycle.plantingDate) return;
        this.cropsService.createCycle(this.newCycle).subscribe(res => {
            this.newCycle = { fieldId: this.fields[0]?.id || '', cropType: 'Corn', cropVariety: '', plantingDate: '' };
            this.showCycleForm = false;
            this.loadAll();
        });
    }

    setSelectedCycle(cycle: CropCycle): void {
        this.selectedCycle = cycle;
        this.showActivityForm = false;
        this.showHarvestForm = false;
        const today = new Date().toISOString().split('T')[0];
        this.newActivity.activityDate = today;
        this.harvest.harvestDate = today;
    }

    submitActivity(): void {
        if (!this.selectedCycle || !this.newActivity.activityDate || this.newActivity.cost < 0) return;
        const payload = {
            cropCycleId: this.selectedCycle.id,
            activityType: this.newActivity.activityType,
            activityDate: this.newActivity.activityDate,
            cost: this.newActivity.cost,
            notes: this.newActivity.notes
        };
        this.cropsService.logActivity(payload).subscribe(() => {
            this.newActivity = { activityType: 'Tilling', cost: 100, activityDate: new Date().toISOString().split('T')[0], notes: '' };
            this.showActivityForm = false;
            this.loadAll();
        });
    }

    submitHarvest(): void {
        if (!this.selectedCycle || !this.harvest.harvestDate || this.harvest.actualYieldTons <= 0) return;
        const payload = {
            cropCycleId: this.selectedCycle.id,
            harvestDate: this.harvest.harvestDate,
            actualYieldTons: this.harvest.actualYieldTons
        };
        this.cropsService.harvestCycle(payload).subscribe(() => {
            this.harvest = { harvestDate: new Date().toISOString().split('T')[0], actualYieldTons: 0 };
            this.showHarvestForm = false;
            this.loadAll();
        });
    }
}
