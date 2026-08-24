import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgronomyService, SoilSample, AgronomyRecommendation, LabTestingBilling } from './agronomy.service';
import { OfflineSyncService } from '../../../../core/services/offline-sync.service';
import { environment } from '../../../../../src/environments/environment';

@Component({
    selector: 'lib-agronomy',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Soil Testing & Agronomy Insights</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Record chemistry diagnostic lab results (NPK, pH), map fertilizer advisory plans, and post lab expenses.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Insights
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'samples'" [style.border-bottom]="activeTab === 'samples' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'samples' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🔬 Soil Chemistry Profiles
        </button>
        
        <button (click)="activeTab = 'recommendations'" [style.border-bottom]="activeTab === 'recommendations' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'recommendations' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🌱 Agronomy Recommendations
        </button>
        
        <button (click)="activeTab = 'expenses'" [style.border-bottom]="activeTab === 'expenses' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'expenses' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💵 Lab Testing Billings
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Soil Chemistry Profiles -->
        <div *ngIf="activeTab === 'samples'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showSampleForm = !showSampleForm" class="btn-primary">
              {{ showSampleForm ? 'Close Form' : '➕ Record Soil Sample' }}
            </button>
          </div>

          <!-- Add Sample Form -->
          <div *ngIf="showSampleForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem; border-left: 4px solid var(--primary-emerald);">
            <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">Submit Lab Soil Chemistry Metrics</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Sample Code</label>
                <input type="text" [(ngModel)]="newSample.sampleCode" placeholder="e.g. SMP-2026-X1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Laboratory Name</label>
                <input type="text" [(ngModel)]="newSample.labName" placeholder="e.g. Midwest Agronomy Labs" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">pH Level (0.0 - 14.0)</label>
                <input type="number" [(ngModel)]="newSample.phLevel" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Nitrogen (N PPM)</label>
                <input type="number" [(ngModel)]="newSample.nitrogenPpm" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Phosphorus (P PPM)</label>
                <input type="number" [(ngModel)]="newSample.phosphorusPpm" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Potassium (K PPM)</label>
                <input type="number" [(ngModel)]="newSample.potassiumPpm" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Organic Matter (%)</label>
                <input type="number" [(ngModel)]="newSample.organicMatterPercentage" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Test Fee ($)</label>
                <input type="number" [(ngModel)]="newSample.testFee" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitSample()" class="btn-primary">
                Save Chemistry Profile
              </button>
            </div>
          </div>

          <!-- Soil Samples Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let s of samples" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">Code: {{ s.sampleCode }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Lab: {{ s.labName }}</span>
                </div>
                <span class="badge-pill badge-emerald">pH {{ s.phLevel }}</span>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.5rem; background: rgba(15, 23, 42, 0.5); padding: 8px; border-radius: 8px; font-size: 0.82rem; text-align: center; color: var(--text-main); margin-bottom: 0.75rem;">
                <div>N: <strong style="color: var(--primary-emerald);">{{ s.nitrogenPpm }}</strong></div>
                <div>P: <strong style="color: var(--accent-blue);">{{ s.phosphorusPpm }}</strong></div>
                <div>K: <strong style="color: var(--accent-amber);">{{ s.potassiumPpm }}</strong></div>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted);">
                Organic Matter: <strong>{{ s.organicMatterPercentage }}%</strong> | Date: {{ s.sampleDate | date:'mediumDate' }}
              </div>
            </div>
          </div>
          <div *ngIf="samples.length === 0" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            No soil samples recorded. Submit chemistry lab results above.
          </div>
        </div>

        <!-- Tab 2: Agronomy Recommendations -->
        <div *ngIf="activeTab === 'recommendations'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Formulate Fertilizer Treatment Plan</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Soil Sample Code</label>
                <select [(ngModel)]="newRec.soilSampleId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Sample --</option>
                  <option *ngFor="let s of samples" [value]="s.id">{{ s.sampleCode }} (pH {{ s.phLevel }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Agronomist Name</label>
                <input type="text" [(ngModel)]="newRec.agronomistName" placeholder="e.g. Dr. Aris Thorne" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Target Fertilizer Product</label>
                <input type="text" [(ngModel)]="newRec.recommendedFertilizerType" placeholder="e.g. Urea 46-0-0, NPK 15-15-15" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Application Rate (KG/Acre)</label>
                <input type="number" [(ngModel)]="newRec.targetApplicationRate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Agronomy Notes / Guidance</label>
                <input type="text" [(ngModel)]="newRec.notes" placeholder="e.g. Apply pre-planting prior to spring rain." style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitRec()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Save Recommendation
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Agronomist</th>
                <th>Fertilizer Product</th>
                <th>Target Rate</th>
                <th>Guidance Notes</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of recs">
                <td><strong style="color: #ffffff;">{{ r.agronomistName }}</strong></td>
                <td><span class="badge-pill badge-amber">{{ r.recommendedFertilizerType }}</span></td>
                <td><strong style="color: var(--primary-emerald);">{{ r.targetApplicationRate }} KG/Acre</strong></td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">{{ r.notes }}</td>
                <td>{{ r.recommendationDate | date:'mediumDate' }}</td>
              </tr>
              <tr *ngIf="recs.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No agronomy recommendations formulated.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 3: Lab Testing Billings -->
        <div *ngIf="activeTab === 'expenses'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Sample Code</th>
                <th style="text-align: right;">Test Fee ($)</th>
                <th>Billed Date</th>
                <th style="text-align: center;">Ledger Posting</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings">
                <td><strong style="color: #ffffff;">{{ b.sampleCode }}</strong></td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ b.testFee | currency:'USD' }}</td>
                <td>{{ b.billingDate | date:'mediumDate' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Posted GL 5210</span>
                </td>
              </tr>
              <tr *ngIf="billings.length === 0">
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No diagnostic lab invoices posted.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class AgronomyComponent implements OnInit {
    private agronomyService = inject(AgronomyService);
    private cdr = inject(ChangeDetectorRef);
    private offlineSync = inject(OfflineSyncService);

    activeTab = 'samples';
    showSampleForm = false;

    samples: SoilSample[] = [];
    recs: AgronomyRecommendation[] = [];
    billings: LabTestingBilling[] = [];

    newSample = {
        sampleCode: '',
        labName: '',
        phLevel: 6.5,
        nitrogenPpm: 45,
        phosphorusPpm: 22,
        potassiumPpm: 180,
        organicMatterPercentage: 3.5,
        testFee: 150
    };

    newRec = {
        soilSampleId: '',
        agronomistName: '',
        recommendedFertilizerType: '',
        targetApplicationRate: 50,
        notes: ''
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.agronomyService.getInsights().subscribe({
            next: (data) => {
                this.samples = data.samples || [];
                this.recs = data.recommendations || [];
                this.billings = data.billings || [];
                if (this.samples.length > 0 && !this.newRec.soilSampleId) {
                    this.newRec.soilSampleId = this.samples[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching soil insights:', err)
        });
    }

    submitSample(): void {
        if (!this.newSample.sampleCode || !this.newSample.labName) {
            alert('Please fill out Sample Code and Lab Name.');
            return;
        }

        const command = {
            fieldId: '00000000-0000-0000-0000-000000000000',
            sampleCode: this.newSample.sampleCode,
            labName: this.newSample.labName,
            phLevel: this.newSample.phLevel,
            nitrogenPpm: this.newSample.nitrogenPpm,
            phosphorusPpm: this.newSample.phosphorusPpm,
            potassiumPpm: this.newSample.potassiumPpm,
            organicMatterPercentage: this.newSample.organicMatterPercentage,
            testFee: this.newSample.testFee,
            sampleDate: new Date().toISOString()
        };

        if (!this.offlineSync.effectiveOnline()) {
            this.offlineSync.enqueue('Record Soil Sample', `${environment.apiUrl}/Agronomy/samples`, 'POST', command);
            this.samples = [{
                id: `TEMP-${Date.now()}`,
                fieldId: '00000000-0000-0000-0000-000000000000',
                sampleCode: this.newSample.sampleCode + ' (Offline Queued)',
                labName: this.newSample.labName,
                phLevel: this.newSample.phLevel,
                nitrogenPpm: this.newSample.nitrogenPpm,
                phosphorusPpm: this.newSample.phosphorusPpm,
                potassiumPpm: this.newSample.potassiumPpm,
                organicMatterPercentage: this.newSample.organicMatterPercentage,
                sampleDate: new Date().toISOString()
            }, ...this.samples];
            this.showSampleForm = false;
            this.newSample.sampleCode = '';
            alert('📱 Offline Mode: Soil diagnostic sample queued into local outbox. Will sync automatically upon reconnecting.');
            return;
        }

        this.agronomyService.recordSample(command).subscribe({
            next: () => {
                this.showSampleForm = false;
                this.newSample.sampleCode = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to record soil sample: ' + err.message)
        });
    }

    submitRec(): void {
        if (!this.newRec.soilSampleId || !this.newRec.agronomistName || !this.newRec.recommendedFertilizerType) {
            alert('Please fill out all required fields.');
            return;
        }

        const command = {
            soilSampleId: this.newRec.soilSampleId,
            agronomistName: this.newRec.agronomistName,
            recommendedFertilizerType: this.newRec.recommendedFertilizerType,
            targetApplicationRate: this.newRec.targetApplicationRate,
            recommendationDate: new Date().toISOString(),
            notes: this.newRec.notes
        };

        this.agronomyService.addRecommendation(command).subscribe({
            next: () => {
                this.newRec.recommendedFertilizerType = '';
                this.newRec.notes = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save recommendation: ' + err.message)
        });
    }
}
