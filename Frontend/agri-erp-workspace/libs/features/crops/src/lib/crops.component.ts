import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CropsService, CropField, CropCycle } from './crops.service';

@Component({
    selector: 'lib-crops',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #27ae60; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Lifecycle Management & Yield Forecasting</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Map farming fields, organize growing seasons, log field treatments, forecast yield outputs, and monitor WIP capitalization ledgers.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Directory
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'fields'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'fields' ? '#27ae60' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'fields' ? '3px solid #27ae60' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🗺️ Field Directory
        </button>
        
        <button (click)="activeTab = 'cycles'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'cycles' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'cycles' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🌱 Crop Cycles & Activities
        </button>
        
        <button (click)="activeTab = 'yields'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'yields' ? '#8e44ad' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'yields' ? '3px solid #8e44ad' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📊 Yield Forecast & Analytics
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Field Directory -->
        <div *ngIf="activeTab === 'fields'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showFieldForm = !showFieldForm" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showFieldForm ? 'Close Form' : '➕ Add Field Plot' }}
            </button>
          </div>

          <!-- Add Field Form -->
          <div *ngIf="showFieldForm" style="background: #e8f8f5; border: 1px solid #a3e4d7; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #27ae60;">
            <h4 style="margin: 0 0 1.25rem 0; color: #16a085; font-size: 1.1rem;">Configure New Farming Plot</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Field Name</label>
                <input type="text" [(ngModel)]="newField.name" placeholder="e.g. Sector-B Upper Slope" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Area Size (Acres)</label>
                <input type="number" [(ngModel)]="newField.areaAcres" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Soil Classification</label>
                <select [(ngModel)]="newField.soilType" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="Loam">Loam (Optimal: 1.2x factor)</option>
                  <option value="Clay">Clay (Moderate: 0.9x factor)</option>
                  <option value="Sandy">Sandy (Low: 0.7x factor)</option>
                  <option value="Loamy Sand">Other (Standard: 1.0x factor)</option>
                </select>
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitField()" style="padding: 10px 24px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Field Config
              </button>
            </div>
          </div>

          <!-- Fields Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let field of fields" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #27ae60;">
              <h4 style="margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">🗺️ {{ field.name }}</h4>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6;">
                <div>📐 Dimensions: <strong>{{ field.areaAcres }} Acres</strong></div>
                <div>🍂 Soil Profile: <strong>{{ field.soilType }}</strong></div>
              </div>
              <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                <button (click)="startCycleForField(field)" style="padding: 5px 10px; background: #2980b9; color: white; border: none; border-radius: 4px; font-size: 0.75rem; font-weight: bold; cursor: pointer;">
                  🌱 Start Plant Cycle
                </button>
              </div>
            </div>
          </div>
          <div *ngIf="fields.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No agricultural fields configured. Create a crop field plot above to initialize seasons.
          </div>
        </div>

        <!-- Tab 2: Crop Cycles & Activities -->
        <div *ngIf="activeTab === 'cycles'">
          <div style="display: grid; grid-template-columns: 320px 1fr; gap: 2rem; flex-wrap: wrap;">
            
            <!-- Left Cycles List Column -->
            <div style="border-right: 1px solid #eef2f5; padding-right: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h4 style="margin: 0; color: #2c3e50;">Active Plantings</h4>
                <button (click)="showCycleForm = !showCycleForm" style="padding: 4px 8px; background: #2980b9; color: white; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer;">
                  {{ showCycleForm ? 'Cancel' : '➕ Plant' }}
                </button>
              </div>

              <!-- Setup Cycle Form -->
              <div *ngIf="showCycleForm" style="background: #ebf5fb; border: 1px solid #a9cbe3; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem;">
                <h5 style="margin: 0 0 0.75rem 0; color: #2980b9;">Start Plant Cycle</h5>
                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">Select Field</label>
                    <select [(ngModel)]="newCycle.fieldId" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px;">
                      <option *ngFor="let f of fields" [value]="f.id">{{ f.name }} ({{ f.areaAcres }} Ac)</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">Crop Class</label>
                    <select [(ngModel)]="newCycle.cropType" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px;">
                      <option value="Corn">Corn (4.5t Base)</option>
                      <option value="Wheat">Wheat (2.2t Base)</option>
                      <option value="Soybeans">Soybeans (1.8t Base)</option>
                    </select>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">Crop Variety</label>
                    <input type="text" [(ngModel)]="newCycle.cropVariety" placeholder="e.g. Premium Pioneer X" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.2rem;">Planting Date</label>
                    <input type="date" [(ngModel)]="newCycle.plantingDate" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 4px;" />
                  </div>
                  <button (click)="submitCycle()" style="width: 100%; padding: 8px; background: #2980b9; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                    Launch planting cycle
                  </button>
                </div>
              </div>

              <!-- Cycles Picker List -->
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto;">
                <div *ngFor="let cycle of cycles" 
                     (click)="setSelectedCycle(cycle)"
                     [ngStyle]="{
                       'padding': '10px',
                       'border': '1px solid',
                       'border-color': selectedCycle?.id === cycle.id ? '#2980b9' : '#eef2f5',
                       'border-radius': '6px',
                       'cursor': 'pointer',
                       'background-color': selectedCycle?.id === cycle.id ? '#f4f9fc' : 'transparent',
                       'transition': 'all 0.2s'
                     }">
                  <div style="display: flex; justify-content: space-between;">
                    <strong style="display: block; font-size: 0.85rem; color: #2c3e50;">🌱 {{ cycle.cropType }}</strong>
                    <span [ngStyle]="{
                      'background-color': cycle.status === 'Harvested' ? '#27ae60' : '#d35400',
                      'color': 'white',
                      'padding': '2px 6px',
                      'border-radius': '3px',
                      'font-size': '0.7rem'
                    }">{{ cycle.status }}</span>
                  </div>
                  <span style="font-size: 0.75rem; color: #7f8c8d;">Field: {{ cycle.fieldName }}</span>
                </div>
              </div>
            </div>

            <!-- Right Crop Cycle Management Column -->
            <div>
              <div *ngIf="selectedCycle">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f8f9fa; padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
                  <div>
                    <h3 style="margin: 0; color: #2980b9;">{{ selectedCycle.cropType }} - {{ selectedCycle.cropVariety }}</h3>
                    <p style="margin: 0.2rem 0 0 0; font-size: 0.85rem; color: #7f8c8d;">
                      Field plot: <strong>{{ selectedCycle.fieldName }}</strong> | Plant date: {{ selectedCycle.plantingDate | date:'mediumDate' }}
                    </p>
                  </div>
                  <div style="display: flex; gap: 0.5rem;" *ngIf="selectedCycle.status !== 'Harvested'">
                    <button (click)="showActivityForm = !showActivityForm" style="padding: 6px 12px; background: #e67e22; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                      ⚙️ Log Field Treatment
                    </button>
                    <button (click)="showHarvestForm = !showHarvestForm" style="padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 4px; font-size: 0.8rem; cursor: pointer; font-weight: bold;">
                      🌾 Harvest Crop
                    </button>
                  </div>
                </div>

                <!-- Treatment Forms Panel -->
                <div *ngIf="showActivityForm" style="background: #fdfaf7; border: 1px solid #f5cba7; border-left: 5px solid #e67e22; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #d35400; font-size: 1rem;">Log Seeding, Tilling, or Fertilizer Application</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Activity Class</label>
                      <select [(ngModel)]="newActivity.activityType" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                        <option value="Tilling">Tilling (+10% Yield factor)</option>
                        <option value="Fertilizer">Fertilizer Application (+15% Yield factor)</option>
                        <option value="Pesticide">Pesticide Spray (+10% Yield factor)</option>
                      </select>
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Treatment Cost ($)</label>
                      <input type="number" [(ngModel)]="newActivity.cost" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Execution Date</label>
                      <input type="date" [(ngModel)]="newActivity.activityDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Notes</label>
                      <input type="text" [(ngModel)]="newActivity.notes" placeholder="e.g. NPK 10-20-20 nitrogen input" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                  </div>
                  <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                    <button (click)="submitActivity()" style="padding: 8px 16px; background: #e67e22; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                      Apply Capitalization Entry
                    </button>
                  </div>
                </div>

                <!-- Harvest Form Panel -->
                <div *ngIf="showHarvestForm" style="background: #eafaf1; border: 1px solid #a9dfbf; border-left: 5px solid #27ae60; padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem;">
                  <h4 style="margin: 0 0 1rem 0; color: #27ae60; font-size: 1rem;">Complete Season & Record Harvest Yield</h4>
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Harvest Date</label>
                      <input type="date" [(ngModel)]="harvest.harvestDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Actual Yield (Tons)</label>
                      <input type="number" [(ngModel)]="harvest.actualYieldTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                    </div>
                  </div>
                  <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                    <button (click)="submitHarvest()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">
                      Release WIP & Record Harvest
                    </button>
                  </div>
                </div>

                <!-- Status Panel Cards -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">DYNAMIC YIELD FORECAST</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: #2980b9;">{{ selectedCycle.expectedYieldTons | number:'1.1-2' }} Tons</div>
                  </div>
                  
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; text-align: center;">
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">CAPITALIZED CROP WIP COST</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">{{ selectedCycle.accumulatedWipCost | currency:'USD' }}</div>
                  </div>

                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; text-align: center;" *ngIf="selectedCycle.status === 'Harvested'">
                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">RECORDED ACTUAL YIELD</div>
                    <div style="font-size: 1.75rem; font-weight: bold; color: #27ae60;">{{ selectedCycle.actualYieldTons }} Tons</div>
                  </div>
                </div>

                <!-- Efficiency Metrics Panel -->
                <div style="background: #faf8fd; border: 1px solid #dcd0eb; border-radius: 8px; padding: 1.25rem; margin-top: 1.5rem; border-left: 5px solid #8e44ad;">
                  <h4 style="margin: 0 0 0.75rem 0; color: #8e44ad; font-size: 0.95rem;">🚜 Cost Efficiency & Production Analytics</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; color: #34495e;">
                    <div>WIP Cost per Expected Ton: <strong>{{ selectedCycle.costPerExpectedTon | currency:'USD' }} / Ton</strong></div>
                    <div *ngIf="selectedCycle.costPerActualTon">WIP Cost per Actual Ton: <strong>{{ selectedCycle.costPerActualTon | currency:'USD' }} / Ton</strong></div>
                  </div>
                </div>

              </div>
              <div *ngIf="!selectedCycle" style="padding: 4rem; text-align: center; color: #95a5a6;">
                Select a planting cycle from the sidebar list to configure treatments, view yield predictions, or close harvests.
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Yield Forecast & Analytics -->
        <div *ngIf="activeTab === 'yields'">
          <h4 style="margin: 0 0 1rem 0; color: #8e44ad;">📊 Dynamic Forecast Coefficients & Agricultural Factors</h4>
          <p style="font-size: 0.9rem; color: #555; line-height: 1.5; margin-bottom: 2rem;">
            expected crop output is projected dynamically by combining field area dimensions with crop-specific coefficients, corrected by soil drainage variables and farm service completion points.
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            
            <!-- Soil Mappings -->
            <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem;">
              <h5 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1rem;">🍂 Soil Drainage Multipliers</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5;">
                    <th style="padding: 6px;">Classification</th>
                    <th style="padding: 6px; text-align: right;">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Loam Soil</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #27ae60;">1.20x</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Clay Soil</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #e67e22;">0.90x</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Sandy Soil</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #c0392b;">0.70x</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Treatments Mappings -->
            <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem;">
              <h5 style="margin: 0 0 0.75rem 0; color: #2c3e50; font-size: 1rem;">🚜 Activity Factors (Base: 0.65)</h5>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5;">
                    <th style="padding: 6px;">Activity Type</th>
                    <th style="padding: 6px; text-align: right;">Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Tilling Completion</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #2980b9;">+10%</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Fertilizer Treatment</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #2980b9;">+15%</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f8f9fa;">
                    <td style="padding: 6px;">Pesticide Coverage</td>
                    <td style="padding: 6px; text-align: right; font-weight: bold; color: #2980b9;">+10%</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          <!-- Active Yield Comparison Table -->
          <h5 style="margin: 0 0 1rem 0; color: #2c3e50;">Active Plant Cycles Performance & WIP Cost Summary</h5>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 8px;">Plot Name</th>
                <th style="padding: 8px;">Crop</th>
                <th style="padding: 8px;">Status</th>
                <th style="padding: 8px; text-align: right;">Expected Yield</th>
                <th style="padding: 8px; text-align: right;">Actual Yield</th>
                <th style="padding: 8px; text-align: right;">WIP Accrued</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cycle of cycles" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 8px; font-weight: bold;">{{ cycle.fieldName }}</td>
                <td style="padding: 8px;">{{ cycle.cropType }} ({{ cycle.cropVariety }})</td>
                <td style="padding: 8px;">
                  <span [ngStyle]="{
                    'background-color': cycle.status === 'Harvested' ? '#e8f8f5' : '#fdf2e9',
                    'color': cycle.status === 'Harvested' ? '#27ae60' : '#d35400',
                    'padding': '2px 6px',
                    'border-radius': '3px',
                    'font-size': '0.75rem'
                  }">{{ cycle.status }}</span>
                </td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #2980b9;">{{ cycle.expectedYieldTons }} Tons</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #27ae60;">{{ cycle.actualYieldTons ? cycle.actualYieldTons + ' Tons' : 'Growing' }}</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #e67e22;">{{ cycle.accumulatedWipCost | currency:'USD' }}</td>
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

    // Form triggers
    showFieldForm: boolean = false;
    showCycleForm: boolean = false;
    showActivityForm: boolean = false;
    showHarvestForm: boolean = false;

    // Bindings
    newField = { name: '', areaAcres: 5, soilType: 'Loam' };
    newCycle = { fieldId: '', cropType: 'Corn', cropVariety: '', plantingDate: '' };
    newActivity = { activityType: 'Tilling', cost: 100, activityDate: '', notes: '' };
    harvest = { harvestDate: '', actualYieldTons: 0 };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.cropsService.getFields().subscribe(f => {
            this.fields = f;
            if (f.length > 0) {
                this.newCycle.fieldId = f[0].id;
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
        // set default dates
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
