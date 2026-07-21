import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgronomyService, SoilSample, AgronomyRecommendation, LabTestingBilling } from './agronomy.service';

@Component({
    selector: 'lib-agronomy',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #16a085; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Soil Testing & Agronomy Insights</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Record chemistry diagnostic lab results (NPK, pH), map fertilizer advisory plans, and post lab expenses.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #16a085; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Insights
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'samples'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'samples' ? '#16a085' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'samples' ? '3px solid #16a085' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🔬 Soil Chemistry Profiles
        </button>
        
        <button (click)="activeTab = 'recommendations'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'recommendations' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'recommendations' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🌱 Agronomy Recommendations
        </button>
        
        <button (click)="activeTab = 'expenses'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'expenses' ? '#2c3e50' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'expenses' ? '3px solid #2c3e50' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          💵 Lab Testing Billings
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Soil Chemistry Profiles -->
        <div *ngIf="activeTab === 'samples'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showSampleForm = !showSampleForm" style="padding: 8px 16px; background: #16a085; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showSampleForm ? 'Close Form' : '➕ Record Soil Sample' }}
            </button>
          </div>

          <!-- Add Sample Form -->
          <div *ngIf="showSampleForm" style="background: #eefaf6; border: 1px solid #bcead6; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #16a085; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #16a085; font-size: 1.1rem;">Submit Lab Soil Chemistry Metrics</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Sample Code</label>
                <input type="text" [(ngModel)]="newSample.sampleCode" placeholder="e.g. SMP-2026-X1" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Laboratory Name</label>
                <input type="text" [(ngModel)]="newSample.labName" placeholder="e.g. Midwest Agronomy Labs" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">pH Level (0.0 - 14.0)</label>
                <input type="number" [(ngModel)]="newSample.phLevel" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Nitrogen (PPM)</label>
                <input type="number" [(ngModel)]="newSample.nitrogenPpm" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Phosphorus (PPM)</label>
                <input type="number" [(ngModel)]="newSample.phosphorusPpm" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Potassium (PPM)</label>
                <input type="number" [(ngModel)]="newSample.potassiumPpm" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Organic Matter (%)</label>
                <input type="number" [(ngModel)]="newSample.organicMatterPercentage" step="0.1" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Laboratory Testing Fee ($)</label>
                <input type="number" [(ngModel)]="newSample.testFee" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button (click)="submitSample()" style="padding: 10px 24px; background: #16a085; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; width: 100%;">
                  Record Sample Results
                </button>
              </div>
            </div>
          </div>

          <!-- Soil Samples Grid Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let s of samples" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #16a085;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <strong style="color: #2c3e50; font-size: 1.05rem; font-family: monospace;">🧪 Sample: {{ s.sampleCode }}</strong>
                <span style="font-size: 0.8rem; color: #7f8c8d;">{{ s.sampleDate | date:'yyyy-MM-dd' }}</span>
              </div>
              
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6;">
                <div>Lab Diagnostics: <strong>{{ s.labName }}</strong></div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; background: #f8fafc; padding: 6px 10px; border-radius: 4px;">
                  <span>pH Level:</span>
                  <strong style="color: #16a085;">{{ s.phLevel | number:'1.1-2' }} pH</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.25rem; background: #f8fafc; padding: 6px 10px; border-radius: 4px;">
                  <span>Organic Matter:</span>
                  <strong style="color: #2c3e50;">{{ s.organicMatterPercentage | number:'1.1-2' }}%</strong>
                </div>
                
                <!-- NPK Chemistry Indicators -->
                <div style="margin-top: 0.75rem; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; text-align: center; font-size: 0.75rem;">
                  <div style="background: #ebf8ff; border: 1px solid #bee3f8; border-radius: 4px; padding: 6px;">
                    <span style="display: block; color: #3182ce; font-weight: bold;">Nitrogen</span>
                    <strong>{{ s.nitrogenPpm | number }} ppm</strong>
                  </div>
                  <div style="background: #fffaf0; border: 1px solid #feebc8; border-radius: 4px; padding: 6px;">
                    <span style="display: block; color: #dd6b20; font-weight: bold;">Phosphorus</span>
                    <strong>{{ s.phosphorusPpm | number }} ppm</strong>
                  </div>
                  <div style="background: #faf5ff; border: 1px solid #e9d8fd; border-radius: 4px; padding: 6px;">
                    <span style="display: block; color: #805ad5; font-weight: bold;">Potassium</span>
                    <strong>{{ s.potassiumPpm | number }} ppm</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="samples.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No soil chemistry lab records stored.
          </div>
        </div>

        <!-- Tab 2: Agronomy Recommendations -->
        <div *ngIf="activeTab === 'recommendations'">
          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
            
            <!-- Recommendations Submission Form -->
            <div style="background: #fffaf4; border: 1px solid #ffd8b3; padding: 1.5rem; border-radius: 10px; border-left: 5px solid #e67e22; font-size: 0.9rem;">
              <h4 style="margin: 0 0 1.25rem 0; color: #e67e22; font-size: 1.1rem;">Add Agronomist Advisory Note</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Select Soil Sample</label>
                  <select [(ngModel)]="newRec.soilSampleId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <option value="">-- Select Chemistry Card --</option>
                    <option *ngFor="let s of samples" [value]="s.id">Sample {{ s.sampleCode }} (Lab: {{ s.labName }})</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Recommended Fertilizer</label>
                  <input type="text" [(ngModel)]="newRec.recommendedFertilizerType" placeholder="e.g. Phosphate Blend" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Target Application (lbs/Acre)</label>
                  <input type="number" [(ngModel)]="newRec.targetApplicationRate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; align-items: flex-end;">
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Agronomist Name</label>
                  <input type="text" [(ngModel)]="newRec.agronomistName" placeholder="Dr. Agronomist Name" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Advisory Notes</label>
                  <input type="text" [(ngModel)]="newRec.notes" placeholder="e.g. Apply pre-planting season" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
                <button (click)="submitRecommendation()" [disabled]="!newRec.soilSampleId || !newRec.recommendedFertilizerType" style="padding: 10px 24px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: (newRec.soilSampleId && newRec.recommendedFertilizerType) ? 1 : 0.6;">
                  Log Recommendation
                </button>
              </div>
            </div>

            <!-- Recommendations Advisory Logs List -->
            <div style="border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; background: #ffffff;">
              <h4 style="margin: 0 0 1.25rem 0; color: #2c3e50; font-size: 1.1rem;">Agronomist Fertilizer Prescriptions</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                    <th style="padding: 8px;">Target Soil Sample</th>
                    <th style="padding: 8px;">Fertilizer Type</th>
                    <th style="padding: 8px; text-align: right;">Target Rate</th>
                    <th style="padding: 8px;">Prescribing Expert</th>
                    <th style="padding: 8px;">Prescription Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of recommendations" style="border-bottom: 1px solid #eef2f5;">
                    <td style="padding: 8px; font-weight: bold; font-family: monospace;">Sample {{ r.sampleCode }}</td>
                    <td style="padding: 8px; color: #e67e22; font-weight: bold;">🌱 {{ r.recommendedFertilizerType }}</td>
                    <td style="padding: 8px; text-align: right;">{{ r.targetApplicationRate | number }} lbs/Acre</td>
                    <td style="padding: 8px;">{{ r.agronomistName }}</td>
                    <td style="padding: 8px;">{{ r.recommendationDate | date:'yyyy-MM-dd' }}</td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="recommendations.length === 0" style="padding: 2rem; text-align: center; color: #95a5a6;">
                No fertilizer recommendation cards mapped.
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Lab Testing Billings -->
        <div *ngIf="activeTab === 'expenses'">
          <div style="background: #eefafb; border: 1px solid #bceef5; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid #16a085;">
            <span style="font-size: 0.9rem; color: #16a085; font-weight: bold;">TOTAL LABORATORY DIAGNOSTIC FEES</span>
            <strong style="font-size: 1.75rem; color: #2c3e50;">
              {{ totalLabExpenses | currency:'USD' }}
            </strong>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 10px;">Diagnostic Sample Code</th>
                <th style="padding: 10px;">Billing Reference</th>
                <th style="padding: 10px; text-align: right;">Diagnostic Testing Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 10px; font-weight: bold; font-family: monospace;">Sample {{ b.sampleCode }}</td>
                <td style="padding: 10px;">Laboratory Diagnostics (Posted in AP)</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #c53030;">
                  {{ b.testFee | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="billings.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No laboratory testing invoices archived.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class AgronomyComponent implements OnInit {
    private agronomyService = inject(AgronomyService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'samples';
    samples: SoilSample[] = [];
    recommendations: AgronomyRecommendation[] = [];
    billings: LabTestingBilling[] = [];
    totalLabExpenses: number = 0;

    showSampleForm: boolean = false;

    newSample = {
        fieldId: '00000000-0000-0000-0000-000000000000',
        sampleCode: '',
        labName: '',
        phLevel: 6.5,
        nitrogenPpm: 45,
        phosphorusPpm: 35,
        potassiumPpm: 120,
        organicMatterPercentage: 3.5,
        testFee: 150
    };

    newRec = {
        soilSampleId: '',
        recommendedFertilizerType: '',
        targetApplicationRate: 150,
        recommendationDate: '',
        agronomistName: '',
        notes: ''
    };

    ngOnInit(): void {
        this.newRec.recommendationDate = new Date().toISOString().split('T')[0];
        this.loadAll();
    }

    loadAll(): void {
        this.agronomyService.getInsights().subscribe(a => {
            this.samples = a.samples;
            this.recommendations = a.recommendations;
            this.billings = a.billings;
            this.totalLabExpenses = a.totalLabExpenses;
            this.cdr.detectChanges();
        });
    }

    submitSample(): void {
        if (!this.newSample.sampleCode || !this.newSample.labName || this.newSample.phLevel <= 0) return;
        
        const payload = {
            ...this.newSample,
            sampleDate: new Date().toISOString()
        };

        this.agronomyService.recordSample(payload).subscribe(() => {
            this.newSample = {
                fieldId: '00000000-0000-0000-0000-000000000000',
                sampleCode: '',
                labName: '',
                phLevel: 6.5,
                nitrogenPpm: 45,
                phosphorusPpm: 35,
                potassiumPpm: 120,
                organicMatterPercentage: 3.5,
                testFee: 150
            };
            this.showSampleForm = false;
            this.loadAll();
        });
    }

    submitRecommendation(): void {
        if (!this.newRec.soilSampleId || !this.newRec.recommendedFertilizerType) return;
        this.agronomyService.addRecommendation(this.newRec).subscribe(() => {
            this.newRec = {
                soilSampleId: '',
                recommendedFertilizerType: '',
                targetApplicationRate: 150,
                recommendationDate: new Date().toISOString().split('T')[0],
                agronomistName: '',
                notes: ''
            };
            this.loadAll();
        });
    }
}
