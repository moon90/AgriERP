import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandService, LandLease, LeasePayment, LandPortfolio } from './land.service';

@Component({
    selector: 'lib-land',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Land Lease & Sharecrop Management</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Track landlord lease contracts, calculate cash rents, and compute crop harvest share allocations.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'leases'" [style.border-bottom]="activeTab === 'leases' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'leases' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🪵 Lease Contracts
        </button>
        
        <button (click)="activeTab = 'payouts'" [style.border-bottom]="activeTab === 'payouts' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'payouts' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🧮 Payout Calculator
        </button>
        
        <button (click)="activeTab = 'history'" [style.border-bottom]="activeTab === 'history' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'history' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💳 Lease Payments Stream
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Lease Contracts -->
        <div *ngIf="activeTab === 'leases'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showLeaseForm = !showLeaseForm" class="btn-primary">
              {{ showLeaseForm ? 'Close Form' : '➕ Onboard Lease Contract' }}
            </button>
          </div>

          <div *ngIf="showLeaseForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Register Land Lease Contract</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Lease Number</label>
                <input type="text" [(ngModel)]="newLease.leaseNumber" placeholder="e.g. LSE-2026-N01" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Landlord Name</label>
                <input type="text" [(ngModel)]="newLease.landlordName" placeholder="e.g. Samuel Henderson" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Lease Type</label>
                <select [(ngModel)]="newLease.leaseType" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="CashRent">Cash Rent</option>
                  <option value="Sharecrop">Sharecrop</option>
                </select>
              </div>
              <div *ngIf="newLease.leaseType === 'CashRent'">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Cash Rent ($/Acre)</label>
                <input type="number" [(ngModel)]="newLease.cashRentPerAcre" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div *ngIf="newLease.leaseType === 'Sharecrop'">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Landlord Share (%)</label>
                <input type="number" [(ngModel)]="newLease.landlordSharePercentage" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Area (Acres)</label>
                <input type="number" [(ngModel)]="newLease.areaAcres" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitLease()" class="btn-primary">
                Save Lease Contract
              </button>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let l of leases" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ l.leaseNumber }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Landlord: {{ l.landlordName }}</span>
                </div>
                <span class="badge-pill badge-emerald">{{ l.leaseType }}</span>
              </div>
              
              <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted);">
                <div>Area: <strong style="color: #ffffff;">{{ l.areaAcres }} Acres</strong></div>
                <div *ngIf="l.leaseType === 'CashRent'">Rent Rate: <strong style="color: var(--primary-emerald);">{{ l.cashRentPerAcre | currency:'USD' }}/Acre</strong></div>
                <div *ngIf="l.leaseType === 'Sharecrop'">Landlord Share: <strong style="color: var(--accent-amber);">{{ l.landlordSharePercentage }}%</strong></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Payout Calculator -->
        <div *ngIf="activeTab === 'payouts'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Calculate Lease Rent or Sharecrop Settlement</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Select Lease Contract</label>
                <select [(ngModel)]="payoutCalc.landLeaseId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Select Lease --</option>
                  <option *ngFor="let l of leases" [value]="l.id">{{ l.leaseNumber }} ({{ l.landlordName }} - {{ l.leaseType }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Actual Yield (Tons)</label>
                <input type="number" [(ngModel)]="payoutCalc.actualYieldTons" placeholder="Req for Sharecrop" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Crop Market Price ($/Ton)</label>
                <input type="number" [(ngModel)]="payoutCalc.cropPricePerTon" placeholder="Req for Sharecrop" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="calculatePayment()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Calculate & Post Payout
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: History Stream -->
        <div *ngIf="activeTab === 'history'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Lease No</th>
                <th>Landlord</th>
                <th>Payment Type</th>
                <th>Calculation Formula</th>
                <th style="text-align: right;">Amount ($)</th>
                <th>Payment Date</th>
                <th style="text-align: center;">Posting Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td><strong style="color: #ffffff;">{{ p.leaseNumber }}</strong></td>
                <td>{{ p.landlordName }}</td>
                <td><span class="badge-pill badge-amber">{{ p.paymentType }}</span></td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">{{ p.calculationDetails }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ p.amount | currency:'USD' }}</td>
                <td>{{ p.paymentDate | date:'mediumDate' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Posted GL 5120</span>
                </td>
              </tr>
              <tr *ngIf="payments.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No lease payments calculated.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class LandComponent implements OnInit {
    private landService = inject(LandService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'leases';
    showLeaseForm = false;

    leases: LandLease[] = [];
    payments: LeasePayment[] = [];

    newLease = {
        leaseNumber: '',
        landlordName: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        leaseType: 'CashRent',
        cashRentPerAcre: 220,
        areaAcres: 120,
        landlordSharePercentage: 25,
        contractStartDate: new Date().toISOString().substring(0, 10),
        contractEndDate: new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10)
    };

    payoutCalc = {
        landLeaseId: '',
        actualYieldTons: 50,
        cropPricePerTon: 180
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.landService.getPortfolio().subscribe({
            next: (data) => {
                this.leases = data.leases || [];
                this.payments = data.payments || [];
                if (this.leases.length > 0 && !this.payoutCalc.landLeaseId) {
                    this.payoutCalc.landLeaseId = this.leases[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching land portfolio:', err)
        });
    }

    submitLease(): void {
        if (!this.newLease.leaseNumber || !this.newLease.landlordName) {
            alert('Please fill out Lease Number and Landlord Name.');
            return;
        }

        this.landService.createLease(this.newLease).subscribe({
            next: () => {
                this.showLeaseForm = false;
                this.newLease.leaseNumber = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save lease: ' + err.message)
        });
    }

    calculatePayment(): void {
        if (!this.payoutCalc.landLeaseId) {
            alert('Please select a lease contract.');
            return;
        }

        const command = {
            landLeaseId: this.payoutCalc.landLeaseId,
            actualYieldTons: this.payoutCalc.actualYieldTons,
            cropPricePerTon: this.payoutCalc.cropPricePerTon,
            paymentDate: new Date().toISOString()
        };

        this.landService.calculatePayment(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Lease payout calculated and expense posted.');
            },
            error: (err) => alert('Failed to calculate payment: ' + err.message)
        });
    }
}
