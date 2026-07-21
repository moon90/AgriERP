import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandService, LandLease, LeasePayment, LandPortfolio } from './land.service';

@Component({
    selector: 'lib-land',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #27ae60; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Land Lease & Sharecrop Management</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Track landlord lease contracts, calculate cash rents, and compute crop harvest share allocations.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'leases'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'leases' ? '#27ae60' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'leases' ? '3px solid #27ae60' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🪵 Lease Contracts
        </button>
        
        <button (click)="activeTab = 'payouts'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'payouts' ? '#d35400' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'payouts' ? '3px solid #d35400' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🧮 Payout Calculator
        </button>
        
        <button (click)="activeTab = 'history'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'history' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'history' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📖 Payment Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Lease Contracts -->
        <div *ngIf="activeTab === 'leases'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showLeaseForm = !showLeaseForm" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showLeaseForm ? 'Close Form' : '➕ Onboard Land Lease' }}
            </button>
          </div>

          <!-- Add Lease Form -->
          <div *ngIf="showLeaseForm" style="background: #f4faf6; border: 1px solid #c2e0cd; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #27ae60; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #27ae60; font-size: 1.1rem;">Register Landlord Lease Contract</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Lease Number</label>
                <input type="text" [(ngModel)]="newLease.leaseNumber" placeholder="e.g. LSE-880" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Landlord Name</label>
                <input type="text" [(ngModel)]="newLease.landlordName" placeholder="e.g. Robert Smith" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Lease Type</label>
                <select [(ngModel)]="newLease.leaseType" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="CashRent">Cash Rent (Fixed rate per acre)</option>
                  <option value="Sharecrop">Sharecrop (Percent of harvest value)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Leased Area (Acres)</label>
                <input type="number" [(ngModel)]="newLease.areaAcres" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div *ngIf="newLease.leaseType === 'CashRent'">
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Cash Rent Rate ($/Acre)</label>
                <input type="number" [(ngModel)]="newLease.cashRentPerAcre" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div *ngIf="newLease.leaseType === 'Sharecrop'">
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Landlord Share (%)</label>
                <input type="number" [(ngModel)]="newLease.landlordSharePercentage" placeholder="e.g. 20" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Start Date</label>
                <input type="date" [(ngModel)]="newLease.contractStartDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">End Date</label>
                <input type="date" [(ngModel)]="newLease.contractEndDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitLease()" style="padding: 10px 24px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Contract
              </button>
            </div>
          </div>

          <!-- Leases List -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let lease of leases" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #27ae60;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">🪵 Lease: {{ lease.leaseNumber }}</h4>
                <span [ngStyle]="{
                  'background-color': lease.status === 'Active' ? '#2ecc71' : '#7f8c8d',
                  'color': 'white',
                  'padding': '2px 6px',
                  'border-radius': '3px',
                  'font-size': '0.75rem',
                  'font-weight': 'bold'
                }">{{ lease.status }}</span>
              </div>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6;">
                <div>Landlord: <strong>{{ lease.landlordName }}</strong></div>
                <div>Lease Type: <strong>{{ lease.leaseType === 'CashRent' ? 'Cash Rent' : 'Sharecrop' }}</strong></div>
                <div>Area: <strong>{{ lease.areaAcres }} Acres</strong></div>
                <div *ngIf="lease.leaseType === 'CashRent'">Rent rate: <strong>{{ lease.cashRentPerAcre | currency:'USD' }} / Acre</strong></div>
                <div *ngIf="lease.leaseType === 'Sharecrop'">Landlord Share: <strong>{{ lease.landlordSharePercentage * 100 | number:'1.0-2' }}%</strong></div>
                <div style="margin-top: 0.5rem; color: #7f8c8d; font-size: 0.75rem;">
                  Period: {{ lease.contractStartDate | date:'yyyy-MM-dd' }} to {{ lease.contractEndDate | date:'yyyy-MM-dd' }}
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="leases.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No lease agreements onboarded.
          </div>
        </div>

        <!-- Tab 2: Payout Calculator -->
        <div *ngIf="activeTab === 'payouts'">
          <div style="max-width: 600px; margin: 0 auto; background: #fff9f2; border: 1px solid #ffe6cc; padding: 2rem; border-radius: 10px; border-left: 5px solid #d35400;">
            <h4 style="margin: 0 0 1.5rem 0; color: #d35400; font-size: 1.25rem;">Simulate & Process Lease Payment</h4>
            
            <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.9rem;">
              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 0.25rem; color: #64748b;">Select Lease</label>
                <select [(ngModel)]="payoutCalc.landLeaseId" (change)="onLeaseSelect()" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="">-- Choose Active Lease --</option>
                  <option *ngFor="let l of getActiveLeases()" [value]="l.id">{{ l.leaseNumber }} - {{ l.landlordName }} ({{ l.leaseType }})</option>
                </select>
              </div>

              <!-- Extra fields if Sharecrop selected -->
              <div *ngIf="selectedLease?.leaseType === 'Sharecrop'" style="background: #ffffff; border: 1px solid #cbd5e1; padding: 1rem; border-radius: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.8rem; margin-bottom: 0.25rem;">Harvest Yield (Tons)</label>
                  <input type="number" [(ngModel)]="payoutCalc.actualYieldTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.8rem; margin-bottom: 0.25rem;">Crop Market Price ($/Ton)</label>
                  <input type="number" [(ngModel)]="payoutCalc.cropPricePerTon" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>

              <div>
                <label style="display: block; font-weight: bold; margin-bottom: 0.25rem; color: #64748b;">Payment / Posting Date</label>
                <input type="date" [(ngModel)]="payoutCalc.paymentDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>

              <!-- Estimated Payout Cost Panel -->
              <div *ngIf="selectedLease" style="background: #fffdf5; border: 1px dashed #d35400; padding: 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
                <span>Estimated payout allocation</span>
                <strong style="color: #d35400; font-size: 1.4rem;">
                  {{ getEstimatedAmount() | currency:'USD' }}
                </strong>
              </div>

              <div style="display: flex; justify-content: flex-end; margin-top: 1rem;">
                <button (click)="submitPaymentCalculation()" [disabled]="!payoutCalc.landLeaseId" style="padding: 12px 28px; background: #d35400; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: payoutCalc.landLeaseId ? 1 : 0.6;">
                  Calculate & Post Liability to GL
                </button>
              </div>

            </div>
          </div>
        </div>

        <!-- Tab 3: Payment Ledger -->
        <div *ngIf="activeTab === 'history'">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: #f4faf6; border: 1px solid #c2e0cd; border-radius: 8px; padding: 1.25rem; text-align: center;">
              <div style="font-size: 0.85rem; color: #27ae60; font-weight: bold; margin-bottom: 0.25rem;">TOTAL RENT EXPENSES</div>
              <strong style="font-size: 1.5rem; color: #2c3e50;">{{ totalRentExpenses | currency:'USD' }}</strong>
            </div>
            <div style="background: #fef9e7; border: 1px solid #f9e79f; border-radius: 8px; padding: 1.25rem; text-align: center;">
              <div style="font-size: 0.85rem; color: #d35400; font-weight: bold; margin-bottom: 0.25rem;">TOTAL SHARECROP EXPENSES</div>
              <strong style="font-size: 1.5rem; color: #2c3e50;">{{ totalSharecropExpenses | currency:'USD' }}</strong>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 8px;">Lease</th>
                <th style="padding: 8px;">Landlord</th>
                <th style="padding: 8px;">Type</th>
                <th style="padding: 8px;">Date</th>
                <th style="padding: 8px;">Calculation Details</th>
                <th style="padding: 8px; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of payments" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 8px; font-weight: bold; font-family: monospace;">{{ p.leaseNumber }}</td>
                <td style="padding: 8px;">{{ p.landlordName }}</td>
                <td style="padding: 8px;">{{ p.paymentType === 'Rent' ? 'Cash Rent' : 'Sharecrop' }}</td>
                <td style="padding: 8px;">{{ p.paymentDate | date:'yyyy-MM-dd' }}</td>
                <td style="padding: 8px; color: #7f8c8d;">{{ p.calculationDetails }}</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #2c3e50;">
                  {{ p.amount | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="payments.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No lease payments posted in GL.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class LandComponent implements OnInit {
    private landService = inject(LandService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'leases';
    leases: LandLease[] = [];
    payments: LeasePayment[] = [];
    totalRentExpenses: number = 0;
    totalSharecropExpenses: number = 0;

    showLeaseForm: boolean = false;

    newLease = {
        leaseNumber: '',
        landlordName: '',
        fieldId: '',
        leaseType: 'CashRent',
        cashRentPerAcre: 150,
        areaAcres: 40,
        landlordSharePercentage: 20,
        contractStartDate: '',
        contractEndDate: ''
    };

    payoutCalc = {
        landLeaseId: '',
        actualYieldTons: 15,
        cropPricePerTon: 220,
        paymentDate: ''
    };

    selectedLease: LandLease | null = null;

    ngOnInit(): void {
        this.newLease.fieldId = '00000000-0000-0000-0000-000000000000';
        this.newLease.contractStartDate = new Date().toISOString().split('T')[0];
        this.newLease.contractEndDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
        this.payoutCalc.paymentDate = new Date().toISOString().split('T')[0];
        this.loadAll();
    }

    loadAll(): void {
        this.landService.getPortfolio().subscribe(p => {
            this.leases = p.leases;
            this.payments = p.payments;
            this.totalRentExpenses = p.totalRentExpenses;
            this.totalSharecropExpenses = p.totalSharecropExpenses;
            this.cdr.detectChanges();
        });
    }

    getActiveLeases(): LandLease[] {
        return this.leases.filter(l => l.status === 'Active');
    }

    onLeaseSelect(): void {
        this.selectedLease = this.leases.find(l => l.id === this.payoutCalc.landLeaseId) || null;
    }

    getEstimatedAmount(): number {
        if (!this.selectedLease) return 0;
        if (this.selectedLease.leaseType === 'CashRent') {
            return this.selectedLease.areaAcres * this.selectedLease.cashRentPerAcre;
        } else {
            return this.payoutCalc.actualYieldTons * (this.selectedLease.landlordSharePercentage) * this.payoutCalc.cropPricePerTon;
        }
    }

    submitLease(): void {
        if (!this.newLease.leaseNumber || !this.newLease.landlordName || this.newLease.areaAcres <= 0) return;
        
        const payload = {
            ...this.newLease,
            landlordSharePercentage: this.newLease.leaseType === 'Sharecrop' ? (this.newLease.landlordSharePercentage / 100) : 0
        };

        this.landService.createLease(payload).subscribe(() => {
            this.newLease = {
                leaseNumber: '',
                landlordName: '',
                fieldId: '00000000-0000-0000-0000-000000000000',
                leaseType: 'CashRent',
                cashRentPerAcre: 150,
                areaAcres: 40,
                landlordSharePercentage: 20,
                contractStartDate: new Date().toISOString().split('T')[0],
                contractEndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
            };
            this.showLeaseForm = false;
            this.loadAll();
        });
    }

    submitPaymentCalculation(): void {
        if (!this.payoutCalc.landLeaseId) return;

        const isSharecrop = this.selectedLease?.leaseType === 'Sharecrop';
        const payload = {
            landLeaseId: this.payoutCalc.landLeaseId,
            actualYieldTons: isSharecrop ? this.payoutCalc.actualYieldTons : null,
            cropPricePerTon: isSharecrop ? this.payoutCalc.cropPricePerTon : null,
            paymentDate: this.payoutCalc.paymentDate
        };

        this.landService.calculatePayment(payload).subscribe(() => {
            this.payoutCalc.landLeaseId = '';
            this.selectedLease = null;
            this.loadAll();
        });
    }
}
