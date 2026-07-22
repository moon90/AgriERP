import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService, InsurancePolicy, LossClaim, InsurancePremiumBilling } from './insurance.service';

@Component({
    selector: 'lib-insurance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #4a5568; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Insurance & Loss Claim Management</h3>
          <p style="color: #718096; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage policy contracts, log crop loss incidents, process adjuster claim settlements, and audit financial ledgers.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #4a5568; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Policies
        </button>
      </div>

      <!-- Financial Metrics Summary Header Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: #ffffff; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #3182ce; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          <div style="font-size: 0.8rem; color: #718096; text-transform: uppercase; font-weight: 700;">TOTAL COVERAGE VALUE</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #2b6cb0; margin-top: 0.25rem;">
            {{ totalCoverageAmount | currency:'USD' }}
          </div>
        </div>

        <div style="background: #ffffff; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #dd6b20; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          <div style="font-size: 0.8rem; color: #718096; text-transform: uppercase; font-weight: 700;">TOTAL PREMIUMS EXPENSED</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #c05621; margin-top: 0.25rem;">
            {{ totalPremiumsPaid | currency:'USD' }}
          </div>
        </div>

        <div style="background: #ffffff; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #38a169; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
          <div style="font-size: 0.8rem; color: #718096; text-transform: uppercase; font-weight: 700;">TOTAL CLAIMS RECOVERED</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: #2f855a; margin-top: 0.25rem;">
            {{ totalClaimsRecovered | currency:'USD' }}
          </div>
        </div>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'policies'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'policies' ? '#3182ce' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'policies' ? '3px solid #3182ce' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📜 Insurance Policies
        </button>
        
        <button (click)="activeTab = 'claims'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'claims' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'claims' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🌩️ Loss Claims & Adjustments
        </button>
        
        <button (click)="activeTab = 'billings'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'billings' ? '#2c3e50' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'billings' ? '3px solid #2c3e50' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          💵 Premium Billings
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Insurance Policies -->
        <div *ngIf="activeTab === 'policies'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showPolicyForm = !showPolicyForm" style="padding: 8px 16px; background: #3182ce; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showPolicyForm ? 'Close Form' : '➕ Onboard Insurance Policy' }}
            </button>
          </div>

          <!-- New Policy Form -->
          <div *ngIf="showPolicyForm" style="background: #ebf8ff; border: 1px solid #bee3f8; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #3182ce; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #2b6cb0; font-size: 1.1rem;">Onboard Crop Insurance Policy</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Policy Number</label>
                <input type="text" [(ngModel)]="newPolicy.policyNumber" placeholder="e.g. POL-2026-F01" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Provider Name</label>
                <input type="text" [(ngModel)]="newPolicy.providerName" placeholder="e.g. AgriGuard Assurance" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Coverage Amount ($)</label>
                <input type="number" [(ngModel)]="newPolicy.coverageAmount" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-top: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Premium Amount ($)</label>
                <input type="number" [(ngModel)]="newPolicy.premiumAmount" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Start Date</label>
                <input type="date" [(ngModel)]="newPolicy.startDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">End Date</label>
                <input type="date" [(ngModel)]="newPolicy.endDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitPolicy()" style="padding: 10px 24px; background: #3182ce; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save & Post Premium Fee
              </button>
            </div>
          </div>

          <!-- Policies Grid Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let p of policies" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; border-top: 4px solid #3182ce;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                <strong style="color: #2b6cb0; font-size: 1.05rem; font-family: monospace;">📜 {{ p.policyNumber }}</strong>
                <span style="font-size: 0.75rem; background: #edf2f7; color: #4a5568; padding: 2px 8px; border-radius: 4px; font-weight: bold;">
                  {{ p.providerName }}
                </span>
              </div>

              <div style="font-size: 0.85rem; color: #4a5568; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; background: #f7fafc; padding: 6px 10px; border-radius: 4px;">
                  <span>Coverage Value:</span>
                  <strong style="color: #2b6cb0;">{{ p.coverageAmount | currency:'USD' }}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 0.25rem; background: #f7fafc; padding: 6px 10px; border-radius: 4px;">
                  <span>Annual Premium:</span>
                  <strong style="color: #c05621;">{{ p.premiumAmount | currency:'USD' }}</strong>
                </div>
                <div style="margin-top: 0.75rem; font-size: 0.8rem; color: #718096;">
                  Effective: {{ p.startDate | date:'yyyy-MM-dd' }} to {{ p.endDate | date:'yyyy-MM-dd' }}
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="policies.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No insurance policies registered.
          </div>
        </div>

        <!-- Tab 2: Loss Claims & Adjustments -->
        <div *ngIf="activeTab === 'claims'">
          <div style="display: grid; grid-template-columns: 1fr 360px; gap: 2rem;">
            
            <!-- Claims Table -->
            <div>
              <h4 style="margin: 0 0 1.25rem 0; color: #2c3e50;">Filed Crop Incident Claims</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                    <th style="padding: 8px;">Claim / Policy</th>
                    <th style="padding: 8px;">Incident Date</th>
                    <th style="padding: 8px; text-align: right;">Claimed ($)</th>
                    <th style="padding: 8px; text-align: right;">Payout ($)</th>
                    <th style="padding: 8px; text-align: center;">Status</th>
                    <th style="padding: 8px; text-align: center;">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of claims" style="border-bottom: 1px solid #eef2f5;">
                    <td style="padding: 8px;">
                      <div style="font-weight: bold; font-family: monospace;">{{ c.claimNumber }}</div>
                      <div style="font-size: 0.75rem; color: #718096;">Policy: {{ c.policyNumber }}</div>
                    </td>
                    <td style="padding: 8px;">{{ c.incidentDate | date:'yyyy-MM-dd' }}</td>
                    <td style="padding: 8px; text-align: right;">{{ c.claimAmount | currency:'USD' }}</td>
                    <td style="padding: 8px; text-align: right; font-weight: bold; color: #2f855a;">
                      {{ c.adjustedAmount | currency:'USD' }}
                    </td>
                    <td style="padding: 8px; text-align: center;">
                      <span [ngStyle]="{
                        'padding': '4px 8px',
                        'border-radius': '4px',
                        'font-weight': 'bold',
                        'font-size': '0.75rem',
                        'background': c.status === 'Settled' ? '#c6f6d5' : c.status === 'Submitted' ? '#feebc8' : '#e2e8f0',
                        'color': c.status === 'Settled' ? '#22543d' : c.status === 'Submitted' ? '#7b341e' : '#4a5568'
                      }">
                        {{ c.status }}
                      </span>
                    </td>
                    <td style="padding: 8px; text-align: center;">
                      <button *ngIf="c.status !== 'Settled'" (click)="openSettleModal(c)" style="padding: 4px 10px; background: #38a169; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 0.75rem;">
                        Settle Claim
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="claims.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
                No loss claims logged.
              </div>
            </div>

            <!-- Submit Loss Claim Form -->
            <div style="background: #fffaf4; border: 1px solid #ffd8b3; padding: 1.25rem; border-radius: 10px; border-left: 5px solid #e67e22; font-size: 0.85rem;">
              <h4 style="margin: 0 0 1rem 0; color: #e67e22; font-size: 1rem;">File Loss Incident Claim</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Select Policy</label>
                  <select [(ngModel)]="newClaim.insurancePolicyId" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <option value="">-- Choose Policy --</option>
                    <option *ngFor="let p of policies" [value]="p.id">{{ p.policyNumber }} ({{ p.providerName }})</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Claim Number</label>
                  <input type="text" [(ngModel)]="newClaim.claimNumber" placeholder="e.g. CLM-2026-F1" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Claimed Loss Amount ($)</label>
                  <input type="number" [(ngModel)]="newClaim.claimAmount" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Incident Description</label>
                  <input type="text" [(ngModel)]="newClaim.description" placeholder="e.g. Early spring frost damage" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <button (click)="submitClaim()" [disabled]="!newClaim.insurancePolicyId || !newClaim.claimNumber" style="padding: 10px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: (newClaim.insurancePolicyId && newClaim.claimNumber) ? 1 : 0.6;">
                  Submit Claim
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Premium Billings -->
        <div *ngIf="activeTab === 'billings'">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 10px;">Policy Number</th>
                <th style="padding: 10px;">Billing Date</th>
                <th style="padding: 10px;">Ledger Reference</th>
                <th style="padding: 10px; text-align: right;">Premium Charge</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 10px; font-weight: bold; font-family: monospace;">{{ b.policyNumber }}</td>
                <td style="padding: 10px;">{{ b.billingDate | date:'yyyy-MM-dd' }}</td>
                <td style="padding: 10px;">Insurance Expense (Posted in AP)</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #c05621;">
                  {{ b.premiumFee | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="billings.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No premium billings archived.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class InsuranceComponent implements OnInit {
    private insuranceService = inject(InsuranceService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'policies';
    policies: InsurancePolicy[] = [];
    claims: LossClaim[] = [];
    billings: InsurancePremiumBilling[] = [];

    totalCoverageAmount: number = 0;
    totalPremiumsPaid: number = 0;
    totalClaimsRecovered: number = 0;

    showPolicyForm: boolean = false;

    newPolicy = {
        policyNumber: '',
        providerName: '',
        coverageAmount: 50000,
        premiumAmount: 1200,
        startDate: '',
        endDate: '',
        fieldId: '00000000-0000-0000-0000-000000000000'
    };

    newClaim = {
        insurancePolicyId: '',
        claimNumber: '',
        incidentDate: '',
        claimAmount: 5000,
        description: ''
    };

    ngOnInit(): void {
        const today = new Date().toISOString().split('T')[0];
        const nextYear = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
        this.newPolicy.startDate = today;
        this.newPolicy.endDate = nextYear;
        this.newClaim.incidentDate = today;

        this.loadAll();
    }

    loadAll(): void {
        this.insuranceService.getAnalytics().subscribe(a => {
            this.policies = a.policies;
            this.claims = a.claims;
            this.billings = a.billings;
            this.totalCoverageAmount = a.totalCoverageAmount;
            this.totalPremiumsPaid = a.totalPremiumsPaid;
            this.totalClaimsRecovered = a.totalClaimsRecovered;
            this.cdr.detectChanges();
        });
    }

    submitPolicy(): void {
        if (!this.newPolicy.policyNumber || !this.newPolicy.providerName) return;
        const payload = {
            ...this.newPolicy,
            startDate: new Date(this.newPolicy.startDate).toISOString(),
            endDate: new Date(this.newPolicy.endDate).toISOString()
        };

        this.insuranceService.createPolicy(payload).subscribe(() => {
            this.newPolicy.policyNumber = '';
            this.newPolicy.providerName = '';
            this.showPolicyForm = false;
            this.loadAll();
        });
    }

    submitClaim(): void {
        if (!this.newClaim.insurancePolicyId || !this.newClaim.claimNumber) return;
        const payload = {
            ...this.newClaim,
            incidentDate: new Date(this.newClaim.incidentDate).toISOString()
        };

        this.insuranceService.submitClaim(payload).subscribe(() => {
            this.newClaim.claimNumber = '';
            this.newClaim.description = '';
            this.loadAll();
        });
    }

    openSettleModal(claim: LossClaim): void {
        const amountStr = prompt(`Enter Adjuster Approved Payout Amount for Claim ${claim.claimNumber}:`, claim.claimAmount.toString());
        if (amountStr !== null && !isNaN(Number(amountStr))) {
            const payoutAmount = Number(amountStr);
            this.insuranceService.settleClaim({
                lossClaimId: claim.id,
                payoutAmount: payoutAmount,
                settlementDate: new Date().toISOString()
            }).subscribe(() => {
                this.loadAll();
            });
        }
    }
}
