import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService, InsurancePolicy, LossClaim, InsurancePremiumBilling } from './insurance.service';

@Component({
    selector: 'lib-insurance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Insurance & Loss Claim Management</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage policy contracts, log crop loss incidents, process adjuster claim settlements, and audit financial ledgers.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Policies
        </button>
      </div>

      <!-- Financial Metrics Summary Header Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
        <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--accent-blue);">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL COVERAGE VALUE</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-blue); margin-top: 0.35rem;">
            {{ totalCoverageAmount | currency:'USD' }}
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--accent-amber);">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL PREMIUMS EXPENSED</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-amber); margin-top: 0.35rem;">
            {{ totalPremiumsPaid | currency:'USD' }}
          </div>
        </div>

        <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--primary-emerald);">
          <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL CLAIMS RECOVERED</div>
          <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary-emerald); margin-top: 0.35rem;">
            {{ totalClaimsRecovered | currency:'USD' }}
          </div>
        </div>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'policies'" [style.border-bottom]="activeTab === 'policies' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'policies' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🛡️ Active Policies
        </button>
        
        <button (click)="activeTab = 'claims'" [style.border-bottom]="activeTab === 'claims' ? '3px solid var(--accent-rose)' : 'none'" [style.color]="activeTab === 'claims' ? 'var(--accent-rose)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🚨 Loss Incident Claims
        </button>

        <button (click)="activeTab = 'payments'" [style.border-bottom]="activeTab === 'payments' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'payments' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💵 Premium Expense Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Active Policies -->
        <div *ngIf="activeTab === 'policies'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showPolicyForm = !showPolicyForm" class="btn-primary">
              {{ showPolicyForm ? 'Close Form' : '➕ Add Policy Contract' }}
            </button>
          </div>

          <!-- Add Policy Form -->
          <div *ngIf="showPolicyForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem; border-left: 4px solid var(--accent-blue);">
            <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">Register Crop Insurance Policy</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Policy Number</label>
                <input type="text" [(ngModel)]="newPolicy.policyNumber" placeholder="e.g. POL-2026-CROP" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Underwriter / Provider</label>
                <input type="text" [(ngModel)]="newPolicy.providerName" placeholder="e.g. Agrishield Underwriters" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Coverage Limit ($)</label>
                <input type="number" [(ngModel)]="newPolicy.coverageAmount" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Annual Premium ($)</label>
                <input type="number" [(ngModel)]="newPolicy.premiumAmount" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Effective Date</label>
                <input type="date" [(ngModel)]="newPolicy.startDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Expiration Date</label>
                <input type="date" [(ngModel)]="newPolicy.endDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitPolicy()" class="btn-primary">
                Save Policy Contract
              </button>
            </div>
          </div>

          <!-- Policy Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let p of policies" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-blue);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ p.policyNumber }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">{{ p.providerName }}</span>
                </div>
                <span class="badge-pill badge-blue">Coverage</span>
              </div>
              
              <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); line-height: 1.6;">
                <div>🛡️ Coverage: <strong style="color: var(--accent-blue);">{{ p.coverageAmount | currency:'USD' }}</strong></div>
                <div>💵 Premium: <strong style="color: var(--accent-amber);">{{ p.premiumAmount | currency:'USD' }}</strong></div>
                <div>📅 Term: {{ p.startDate | date:'shortDate' }} - {{ p.endDate | date:'shortDate' }}</div>
              </div>
            </div>
          </div>
          <div *ngIf="policies.length === 0" style="padding: 3rem; text-align: center; color: var(--text-muted);">
            No active insurance policies registered. Click 'Add Policy Contract' above.
          </div>
        </div>

        <!-- Tab 2: Loss Incident Claims -->
        <div *ngIf="activeTab === 'claims'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">File Crop Loss / Damage Claim</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Select Policy</label>
                <select [(ngModel)]="newClaim.insurancePolicyId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Policy --</option>
                  <option *ngFor="let p of policies" [value]="p.id">{{ p.policyNumber }} ({{ p.providerName }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Claim Ref No.</label>
                <input type="text" [(ngModel)]="newClaim.claimNumber" placeholder="e.g. CLM-2026-HAIL" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Incident Date</label>
                <input type="date" [(ngModel)]="newClaim.incidentDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Estimated Loss ($)</label>
                <input type="number" [(ngModel)]="newClaim.claimAmount" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div style="grid-column: span 2;">
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Loss Cause Description</label>
                <input type="text" [(ngModel)]="newClaim.description" placeholder="e.g. Hailstorm damaged 40% corn canopy" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitClaim()" class="btn-primary" style="width: 100%; justify-content: center;">
                  File Loss Claim
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Claim No</th>
                <th>Policy No</th>
                <th>Incident Date</th>
                <th style="text-align: right;">Claimed ($)</th>
                <th style="text-align: right;">Adjusted Payout</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of claims">
                <td><strong style="color: #ffffff;">{{ c.claimNumber }}</strong></td>
                <td>{{ c.policyNumber }}</td>
                <td>{{ c.incidentDate | date:'mediumDate' }}</td>
                <td style="text-align: right; font-family: monospace;">{{ c.claimAmount | currency:'USD' }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ c.adjustedAmount | currency:'USD' }}</td>
                <td style="text-align: center;">
                  <span [ngClass]="c.status === 'Settled' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                    {{ c.status }}
                  </span>
                </td>
                <td style="text-align: center;">
                  <button *ngIf="c.status !== 'Settled'" (click)="settleClaim(c.id, c.claimAmount)" class="badge-pill badge-emerald" style="cursor: pointer; border: none;">
                    💳 Settle Payout
                  </button>
                </td>
              </tr>
              <tr *ngIf="claims.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No insurance loss claims filed.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 3: Premium Expense Ledger -->
        <div *ngIf="activeTab === 'payments'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Policy No</th>
                <th>Billing Date</th>
                <th style="text-align: right;">Premium Fee ($)</th>
                <th style="text-align: center;">Posting Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings">
                <td><strong style="color: #ffffff;">{{ b.policyNumber }}</strong></td>
                <td>{{ b.billingDate | date:'mediumDate' }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ b.premiumFee | currency:'USD' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Posted GL 5410</span>
                </td>
              </tr>
              <tr *ngIf="billings.length === 0">
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No insurance premium billings recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class InsuranceComponent implements OnInit {
    private insuranceService = inject(InsuranceService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'policies';
    showPolicyForm = false;

    policies: InsurancePolicy[] = [];
    claims: LossClaim[] = [];
    billings: InsurancePremiumBilling[] = [];

    totalCoverageAmount = 0;
    totalPremiumsPaid = 0;
    totalClaimsRecovered = 0;

    newPolicy = {
        policyNumber: '',
        providerName: '',
        coverageAmount: 100000,
        premiumAmount: 2500,
        startDate: new Date().toISOString().substring(0, 10),
        endDate: new Date(Date.now() + 365 * 86400000).toISOString().substring(0, 10),
        fieldId: '00000000-0000-0000-0000-000000000000'
    };

    newClaim = {
        insurancePolicyId: '',
        claimNumber: '',
        incidentDate: new Date().toISOString().substring(0, 10),
        claimAmount: 15000,
        description: ''
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.insuranceService.getAnalytics().subscribe({
            next: (data) => {
                this.policies = data.policies || [];
                this.claims = data.claims || [];
                this.billings = data.billings || [];
                this.totalCoverageAmount = data.totalCoverageAmount || 0;
                this.totalPremiumsPaid = data.totalPremiumsPaid || 0;
                this.totalClaimsRecovered = data.totalClaimsRecovered || 0;
                if (this.policies.length > 0 && !this.newClaim.insurancePolicyId) {
                    this.newClaim.insurancePolicyId = this.policies[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching insurance analytics:', err)
        });
    }

    submitPolicy(): void {
        if (!this.newPolicy.policyNumber || !this.newPolicy.providerName) {
            alert('Please enter Policy Number and Provider.');
            return;
        }

        this.insuranceService.createPolicy(this.newPolicy).subscribe({
            next: () => {
                this.showPolicyForm = false;
                this.newPolicy.policyNumber = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save policy: ' + err.message)
        });
    }

    submitClaim(): void {
        if (!this.newClaim.insurancePolicyId || !this.newClaim.claimNumber) {
            alert('Please select a policy and enter claim number.');
            return;
        }

        this.insuranceService.submitClaim(this.newClaim).subscribe({
            next: () => {
                this.newClaim.claimNumber = '';
                this.newClaim.description = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to file claim: ' + err.message)
        });
    }

    settleClaim(claimId: string, amount: number): void {
        const command = {
            lossClaimId: claimId,
            payoutAmount: amount,
            settlementDate: new Date().toISOString()
        };

        this.insuranceService.settleClaim(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Loss claim settled and payout recorded.');
            },
            error: (err) => alert('Failed to settle claim: ' + err.message)
        });
    }
}
