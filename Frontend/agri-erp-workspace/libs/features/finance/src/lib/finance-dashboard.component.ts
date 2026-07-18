import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceService, TrialBalanceLine, IncomeStatement, BalanceSheet } from './finance.service';

@Component({
    selector: 'lib-finance-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      <!-- Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">General Ledger & Financial Reporting</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Review real-time double-entry trial balance, income statement, and balance sheet equations.</p>
        </div>
        <button (click)="refreshReports()" style="padding: 8px 16px; background: #34495e; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Reports
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem;">
        <button (click)="activeTab = 'trial-balance'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'trial-balance' ? '#3498db' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'trial-balance' ? '3px solid #3498db' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          Trial Balance
        </button>
        
        <button (click)="activeTab = 'income-statement'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'income-statement' ? '#2ecc71' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'income-statement' ? '3px solid #2ecc71' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          Income Statement
        </button>
        
        <button (click)="activeTab = 'balance-sheet'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'balance-sheet' ? '#9b59b6' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'balance-sheet' ? '3px solid #9b59b6' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          Balance Sheet
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">
        
        <!-- Tab 1: Trial Balance Table -->
        <div *ngIf="activeTab === 'trial-balance'">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
                <th style="padding: 1rem 0.5rem;">Account Code</th>
                <th style="padding: 1rem 0.5rem;">Account Name</th>
                <th style="padding: 1rem 0.5rem;">Type</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Debits</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Credits</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Net Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of trialLines" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
                <td style="padding: 1rem 0.5rem; font-family: monospace; font-weight: bold;">{{ row.accountCode }}</td>
                <td style="padding: 1rem 0.5rem;">{{ row.accountName }}</td>
                <td style="padding: 1rem 0.5rem;">
                  <span [ngStyle]="{
                    'background-color': getAccountTypeColor(row.accountType),
                    'color': 'white',
                    'padding': '3px 8px',
                    'border-radius': '4px',
                    'font-size': '0.75rem',
                    'font-weight': '600'
                  }">
                    {{ row.accountType }}
                  </span>
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #e74c3c;">
                  {{ row.totalDebits > 0 ? (row.totalDebits | currency:'USD') : '-' }}
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #27ae60;">
                  {{ row.totalCredits > 0 ? (row.totalCredits | currency:'USD') : '-' }}
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold;" [ngStyle]="{'color': row.netBalance >= 0 ? '#27ae60' : '#e74c3c'}">
                  {{ row.netBalance | currency:'USD' }}
                </td>
              </tr>
              <tr *ngIf="trialLines.length === 0" style="text-align: center; color: #95a5a6;">
                <td colspan="6" style="padding: 2rem;">No journal entries posted to the general ledger yet.</td>
              </tr>
            </tbody>
            <tfoot *ngIf="trialLines.length > 0">
              <tr style="border-top: 2px double #34495e; font-weight: bold; background: #f8f9fa; color: #2c3e50;">
                <td colspan="3" style="padding: 1rem 0.5rem;">Total Ledger Balance</td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #e74c3c;">
                  {{ getSumDebits() | currency:'USD' }}
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #27ae60;">
                  {{ getSumCredits() | currency:'USD' }}
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #2980b9;">
                  Balanced
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Tab 2: Income Statement -->
        <div *ngIf="activeTab === 'income-statement' && incomeStatement">
          <!-- Profit summary header card -->
          <div [ngStyle]="{
            'background': incomeStatement.netIncome >= 0 ? 'linear-gradient(135deg, #27ae60, #2ecc71)' : 'linear-gradient(135deg, #e74c3c, #f1c40f)',
            'color': 'white',
            'padding': '1.5rem',
            'border-radius': '10px',
            'margin-bottom': '2rem',
            'box-shadow': '0 4px 15px rgba(0,0,0,0.05)'
          }">
            <h4 style="margin: 0; font-size: 1rem; text-transform: uppercase; opacity: 0.9;">Net Operating Profit / Loss</h4>
            <h2 style="margin: 0.5rem 0 0 0; font-size: 2.2rem; font-weight: 800; font-family: monospace;">
              {{ incomeStatement.netIncome | currency:'USD' }}
            </h2>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <!-- Revenues -->
            <div>
              <h4 style="color: #27ae60; border-bottom: 2px solid #2ecc71; padding-bottom: 0.5rem; margin-top: 0;">Revenues (Inflow)</h4>
              <div *ngFor="let item of incomeStatement.revenues" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8f9fa;">
                <div>
                  <strong style="color: #2c3e50; font-size: 0.95rem;">{{ item.accountName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ item.accountCode }}</span>
                </div>
                <span style="font-family: monospace; font-weight: bold; color: #27ae60; font-size: 1.1rem;">
                  {{ item.balance | currency:'USD' }}
                </span>
              </div>
              <div *ngIf="incomeStatement.revenues.length === 0" style="padding: 1.5rem; text-align: center; color: #95a5a6; font-size: 0.9rem;">
                No revenue entries recorded.
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; padding: 1rem 0; border-top: 2px solid #eef2f5; margin-top: 0.5rem; color: #27ae60; font-size: 1.1rem;">
                <span>Total Revenue</span>
                <span>{{ incomeStatement.totalRevenue | currency:'USD' }}</span>
              </div>
            </div>

            <!-- Expenses -->
            <div>
              <h4 style="color: #e74c3c; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; margin-top: 0;">Expenses (Outflow)</h4>
              <div *ngFor="let item of incomeStatement.expenses" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8f9fa;">
                <div>
                  <strong style="color: #2c3e50; font-size: 0.95rem;">{{ item.accountName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ item.accountCode }}</span>
                </div>
                <span style="font-family: monospace; font-weight: bold; color: #e74c3c; font-size: 1.1rem;">
                  {{ item.balance | currency:'USD' }}
                </span>
              </div>
              <div *ngIf="incomeStatement.expenses.length === 0" style="padding: 1.5rem; text-align: center; color: #95a5a6; font-size: 0.9rem;">
                No expense entries recorded.
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; padding: 1rem 0; border-top: 2px solid #eef2f5; margin-top: 0.5rem; color: #e74c3c; font-size: 1.1rem;">
                <span>Total Expenses</span>
                <span>{{ incomeStatement.totalExpenses | currency:'USD' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Balance Sheet -->
        <div *ngIf="activeTab === 'balance-sheet' && balanceSheet">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <!-- Assets Column -->
            <div>
              <h4 style="color: #2980b9; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; margin-top: 0;">Assets</h4>
              <div *ngFor="let item of balanceSheet.assets" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8f9fa;">
                <div>
                  <strong style="color: #2c3e50; font-size: 0.95rem;">{{ item.accountName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ item.accountCode }}</span>
                </div>
                <span style="font-family: monospace; font-weight: bold; color: #2980b9; font-size: 1.1rem;">
                  {{ item.balance | currency:'USD' }}
                </span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; padding: 1.1rem 0; border-top: 2px solid #eef2f5; margin-top: 0.5rem; color: #2980b9; font-size: 1.2rem; background: #e8f4fd; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 6px;">
                <span>Total Assets (A)</span>
                <span>{{ balanceSheet.totalAssets | currency:'USD' }}</span>
              </div>
            </div>

            <!-- Liabilities & Equity Column -->
            <div style="display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <!-- Liabilities -->
                <h4 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 0.5rem; margin-top: 0;">Liabilities</h4>
                <div *ngFor="let item of balanceSheet.liabilities" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8f9fa;">
                  <div>
                    <strong style="color: #2c3e50; font-size: 0.95rem;">{{ item.accountName }}</strong>
                    <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ item.accountCode }}</span>
                  </div>
                  <span style="font-family: monospace; font-weight: bold; color: #e67e22; font-size: 1.1rem;">
                    {{ item.balance | currency:'USD' }}
                  </span>
                </div>
                <div *ngIf="balanceSheet.liabilities.length === 0" style="padding: 1rem 0; text-align: center; color: #95a5a6; font-size: 0.85rem;">
                  No operating liabilities logged.
                </div>
                <div style="display: flex; justify-content: space-between; font-weight: bold; padding: 0.75rem 0; border-top: 1px solid #eef2f5; color: #e67e22; font-size: 0.95rem;">
                  <span>Subtotal Liabilities</span>
                  <span>{{ balanceSheet.totalLiabilities | currency:'USD' }}</span>
                </div>

                <!-- Equity -->
                <h4 style="color: #9b59b6; border-bottom: 2px solid #9b59b6; padding-bottom: 0.5rem; margin-top: 1.5rem;">Shareholders' Equity</h4>
                <div *ngFor="let item of balanceSheet.equity" style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f8f9fa;">
                  <div>
                    <strong style="color: #2c3e50; font-size: 0.95rem;">{{ item.accountName }}</strong>
                    <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ item.accountCode }}</span>
                  </div>
                  <span style="font-family: monospace; font-weight: bold; color: #9b59b6; font-size: 1.1rem;">
                    {{ item.balance | currency:'USD' }}
                  </span>
                </div>
              </div>

              <div style="display: flex; justify-content: space-between; font-weight: bold; padding: 1.1rem 0; border-top: 2px solid #eef2f5; margin-top: 0.5rem; color: #9b59b6; font-size: 1.2rem; background: #f5eef8; padding-left: 0.5rem; padding-right: 0.5rem; border-radius: 6px;">
                <span>Total Liabilities & Equity (L + E)</span>
                <span>{{ balanceSheet.totalLiabilitiesAndEquity | currency:'USD' }}</span>
              </div>
            </div>
          </div>

          <!-- Matching check banner -->
          <div style="margin-top: 2rem; padding: 1rem; border-radius: 8px; text-align: center; font-weight: bold; font-size: 1.1rem;" [ngStyle]="{
            'background-color': isBalanceSheetMatching() ? '#e8f8f5' : '#fdf2e9',
            'color': isBalanceSheetMatching() ? '#27ae60' : '#d35400',
            'border': isBalanceSheetMatching() ? '1px solid #a3e4d7' : '1px solid #f5cba7'
          }">
            <span *ngIf="isBalanceSheetMatching()">🎉 Accounting Equation Matches: Assets ({{ balanceSheet.totalAssets | currency:'USD' }}) == Liabilities & Equity ({{ balanceSheet.totalLiabilitiesAndEquity | currency:'USD' }})</span>
            <span *ngIf="!isBalanceSheetMatching()">⚠️ Out of Balance Warning! Assets value does not equal liabilities and equity sum.</span>
          </div>
        </div>

      </div>
    </div>
  `
})
export class FinanceDashboardComponent implements OnInit {
    private financeService = inject(FinanceService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: 'trial-balance' | 'income-statement' | 'balance-sheet' = 'trial-balance';

    trialLines: TrialBalanceLine[] = [];
    incomeStatement?: IncomeStatement;
    balanceSheet?: BalanceSheet;

    ngOnInit(): void {
        this.refreshReports();
    }

    refreshReports(): void {
        this.financeService.getTrialBalance().subscribe({
            next: (data) => {
                this.trialLines = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching trial balance:', err)
        });

        this.financeService.getIncomeStatement().subscribe({
            next: (data) => {
                this.incomeStatement = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching income statement:', err)
        });

        this.financeService.getBalanceSheet().subscribe({
            next: (data) => {
                this.balanceSheet = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching balance sheet:', err)
        });
    }

    getSumDebits(): number {
        return this.trialLines.reduce((acc, row) => acc + row.totalDebits, 0);
    }

    getSumCredits(): number {
        return this.trialLines.reduce((acc, row) => acc + row.totalCredits, 0);
    }

    getAccountTypeColor(type: string): string {
        switch (type.toLowerCase()) {
            case 'asset': return '#3498db';
            case 'expense': return '#e74c3c';
            case 'revenue': return '#2ecc71';
            case 'liability': return '#e67e22';
            case 'equity': return '#9b59b6';
            default: return '#7f8c8d';
        }
    }

    isBalanceSheetMatching(): boolean {
        if (!this.balanceSheet) return false;
        return Math.abs(this.balanceSheet.totalAssets - this.balanceSheet.totalLiabilitiesAndEquity) < 0.01;
    }
}
