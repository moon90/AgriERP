import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinanceService, TrialBalanceLine, IncomeStatement, BalanceSheet, BudgetStatus, FiscalYearPeriod } from './finance.service';

@Component({
    selector: 'lib-finance-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      <!-- Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">General Ledger & Financial Reporting</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Review trial balances, post budgets, run year-end fiscal closes, and trace double-entry journal flows.</p>
        </div>
        <button (click)="refreshReports()" style="padding: 8px 16px; background: #34495e; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Reports
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
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

        <button (click)="activeTab = 'budgets'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'budgets' ? '#f39c12' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'budgets' ? '3px solid #f39c12' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          💰 Budgets
        </button>

        <button (click)="activeTab = 'fiscal-closing'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'fiscal-closing' ? '#1abc9c' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'fiscal-closing' ? '3px solid #1abc9c' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          ⚖️ Fiscal Closings
        </button>

        <button (click)="activeTab = 'executive-bi'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'executive-bi' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'executive-bi' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📊 Executive BI & Field P&L
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

        <!-- Tab 4: Budgets Alert Dashboard -->
        <div *ngIf="activeTab === 'budgets'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; background: #f8fafc; padding: 1rem; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span style="font-weight: bold; color: #34495e;">Select Fiscal Year:</span>
              <input type="number" [(ngModel)]="budgetYear" (change)="loadBudgets()" style="width: 100px; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: bold; text-align: center;" />
            </div>
            <button (click)="showBudgetForm = !showBudgetForm" style="padding: 8px 16px; background: #f39c12; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showBudgetForm ? 'Close Set Allocation' : '➕ Allocate Budget' }}
            </button>
          </div>

          <!-- Allocate Budget Form -->
          <div *ngIf="showBudgetForm" style="background: #fffcf4; border: 1px solid #f9ebea; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #f39c12;">
            <h4 style="margin: 0 0 1rem 0; color: #d35400;">Allocate Budget Limit</h4>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">GL Account Code</label>
                <select [(ngModel)]="newBudget.accountCode" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; min-width: 250px;">
                  <option value="">-- Choose Account --</option>
                  <option *ngFor="let acc of trialLines" [value]="acc.accountCode">
                    {{ acc.accountCode }} - {{ acc.accountName }} ({{ acc.accountType }})
                  </option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Fiscal Year</label>
                <input type="number" [(ngModel)]="newBudget.year" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 100px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Allocated Amount ($)</label>
                <input type="number" [(ngModel)]="newBudget.allocatedAmount" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 180px;" />
              </div>
              <button (click)="submitBudget()" style="padding: 9px 20px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Budget Allocation
              </button>
            </div>
          </div>

          <!-- Budgets Table -->
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
                <th style="padding: 1rem 0.5rem;">GL Account</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Allocated Budget</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Actual Spent</th>
                <th style="padding: 1rem 0.5rem; text-align: right;">Remaining</th>
                <th style="padding: 1rem 0.5rem; width: 250px;">Consumption Progress</th>
                <th style="padding: 1rem 0.5rem; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of budgets" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
                <td style="padding: 1rem 0.5rem;">
                  <strong style="color: #34495e;">{{ b.accountName }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: #7f8c8d; font-family: monospace;">Code: {{ b.accountCode }} | {{ b.accountType }}</span>
                </td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold;">{{ b.allocatedAmount | currency:'USD' }}</td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; color: #34495e;">{{ b.spentAmount | currency:'USD' }}</td>
                <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace; font-weight: bold;" [style.color]="b.remainingAmount >= 0 ? '#27ae60' : '#e74c3c'">
                  {{ b.remainingAmount | currency:'USD' }}
                </td>
                <td style="padding: 1rem 0.5rem; vertical-align: middle;">
                  <!-- Progress Bar Wrapper -->
                  <div style="background: #e2e8f0; border-radius: 4px; height: 10px; width: 100%; overflow: hidden; position: relative;">
                    <div [style.width.%]="getBudgetPercent(b)" [style.background-color]="b.isOverBudget ? '#e74c3c' : '#2ecc71'" style="height: 100%; transition: width 0.3s;"></div>
                  </div>
                  <span style="font-size: 0.75rem; color: #7f8c8d; font-family: monospace;">{{ getBudgetPercent(b) | number:'1.0-0' }}% spent</span>
                </td>
                <td style="padding: 1rem 0.5rem; text-align: center;">
                  <span *ngIf="b.isOverBudget" style="background-color: #e74c3c; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                    ⚠️ OVER BUDGET
                  </span>
                  <span *ngIf="!b.isOverBudget" style="background-color: #2ecc71; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                    ✅ OK
                  </span>
                </td>
              </tr>
              <tr *ngIf="budgets.length === 0" style="text-align: center; color: #95a5a6;">
                <td colspan="6" style="padding: 2rem;">No active budget allocations defined for fiscal year {{ budgetYear }}.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 5: Fiscal Year Closings -->
        <div *ngIf="activeTab === 'fiscal-closing'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showFiscalForm = !showFiscalForm" style="padding: 8px 16px; background: #1abc9c; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showFiscalForm ? 'Close New Year Period' : '➕ Initialize Fiscal Year' }}
            </button>
          </div>

          <!-- Initialize Fiscal Year Form -->
          <div *ngIf="showFiscalForm" style="background: #eefdfa; border: 1px solid #a3e4d7; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #1abc9c;">
            <h4 style="margin: 0 0 1rem 0; color: #16a085;">Initialize Fiscal Calendar Year</h4>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Calendar Year</label>
                <input type="number" [(ngModel)]="newYear.year" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; width: 120px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Start Date</label>
                <input type="date" [(ngModel)]="newYear.startDate" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">End Date</label>
                <input type="date" [(ngModel)]="newYear.endDate" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <button (click)="submitFiscalYear()" style="padding: 9px 20px; background: #1abc9c; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Create Fiscal Period
              </button>
            </div>
          </div>

          <!-- Fiscal Years Table -->
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
                <th style="padding: 1rem 0.5rem; text-align: center;">Fiscal Year</th>
                <th style="padding: 1rem 0.5rem;">Period Range</th>
                <th style="padding: 1rem 0.5rem; text-align: center;">Status</th>
                <th style="padding: 1rem 0.5rem;">Closure Details</th>
                <th style="padding: 1rem 0.5rem; text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of fiscalYears" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
                <td style="padding: 1rem 0.5rem; text-align: center; font-weight: bold; font-size: 1.1rem; color: #34495e;">{{ p.year }}</td>
                <td style="padding: 1rem 0.5rem;">{{ p.startDate | date:'mediumDate' }} - {{ p.endDate | date:'mediumDate' }}</td>
                <td style="padding: 1rem 0.5rem; text-align: center;">
                  <span [ngStyle]="{
                    'background-color': p.isClosed ? '#e74c3c' : '#2ecc71',
                    'color': 'white',
                    'padding': '3px 8px',
                    'border-radius': '4px',
                    'font-size': '0.75rem',
                    'font-weight': '600'
                  }">
                    {{ p.isClosed ? 'CLOSED' : 'OPEN' }}
                  </span>
                </td>
                <td style="padding: 1rem 0.5rem; font-size: 0.85rem; color: #7f8c8d;">
                  <span *ngIf="p.isClosed">
                    Closed on: {{ p.closedAt | date:'short' }}<br>
                    Closed by: {{ p.closedBy }}
                  </span>
                  <span *ngIf="!p.isClosed">Active period entries open</span>
                </td>
                <td style="padding: 1rem 0.5rem; text-align: center;">
                  <button *ngIf="!p.isClosed" (click)="closeYear(p.year)" style="padding: 6px 12px; background: #e74c3c; color: white; border: none; border-radius: 4px; font-size: 0.85rem; font-weight: bold; cursor: pointer; transition: background 0.2s;">
                    🔒 Close Fiscal Year
                  </button>
                  <span *ngIf="p.isClosed" style="color: #95a5a6; font-size: 0.85rem; font-weight: 500;">Locked</span>
                </td>
              </tr>
              <tr *ngIf="fiscalYears.length === 0" style="text-align: center; color: #95a5a6;">
                <td colspan="5" style="padding: 2rem;">No active fiscal year periods configured in ledger database.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- Tab 6: Executive BI & Field P&L -->
      <div *ngIf="activeTab === 'executive-bi'">
        <!-- Executive KPI Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #27ae60;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">NET REVENUE</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #27ae60; margin-top: 0.25rem;">
              {{ executiveBi?.enterpriseNetRevenue || 0 | currency:'USD' }}
            </div>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #e74c3c;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">OPERATIONAL EXPENSE</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #c0392b; margin-top: 0.25rem;">
              {{ executiveBi?.enterpriseTotalExpense || 0 | currency:'USD' }}
            </div>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #2980b9;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">NET OPERATING PROFIT</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #2980b9; margin-top: 0.25rem;">
              {{ executiveBi?.enterpriseNetIncome || 0 | currency:'USD' }}
            </div>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #e67e22;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">AVG MARGIN / ACRE</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #d35400; margin-top: 0.25rem;">
              {{ fieldPnLReport?.averageMarginPerAcre || 0 | currency:'USD' }} / acre
            </div>
          </div>
        </div>

        <!-- Field P&L Statements Table -->
        <div style="background: #ffffff; border-radius: 10px; border: 1px solid #e2e8f0; padding: 1.5rem; margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">Field-Level Profit & Loss Statements</h4>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 10px;">Field Name</th>
                <th style="padding: 10px; text-align: right;">Acreage</th>
                <th style="padding: 10px; text-align: right;">Sales Revenue</th>
                <th style="padding: 10px; text-align: right;">Labor Cost</th>
                <th style="padding: 10px; text-align: right;">Chemical Cost</th>
                <th style="padding: 10px; text-align: right;">Irrigation</th>
                <th style="padding: 10px; text-align: right;">Land Rent</th>
                <th style="padding: 10px; text-align: right;">Net Profit</th>
                <th style="padding: 10px; text-align: right;">Margin/Acre</th>
                <th style="padding: 10px; text-align: center;">ROI %</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let f of fieldPnLReport?.fields" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 10px; font-weight: bold; color: #2c3e50;">{{ f.fieldName }}</td>
                <td style="padding: 10px; text-align: right;">{{ f.areaAcres }} acres</td>
                <td style="padding: 10px; text-align: right; color: #27ae60; font-weight: 600;">{{ f.cropSalesRevenue | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right;">{{ f.directLaborExpense | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right;">{{ f.chemicalExpense | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right;">{{ f.irrigationExpense | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right;">{{ f.landLeaseExpense | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #2980b9;">{{ f.netProfit | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #27ae60;">{{ f.marginPerAcre | currency:'USD' }}</td>
                <td style="padding: 10px; text-align: center;">
                  <span style="font-size: 0.75rem; background: #d3f9d8; color: #2b8a3e; padding: 3px 8px; border-radius: 12px; font-weight: bold;">
                    {{ f.roiPercentage }}%
                  </span>
                </td>
              </tr>
              <tr *ngIf="!fieldPnLReport?.fields?.length" style="text-align: center; color: #95a5a6;">
                <td colspan="10" style="padding: 2rem;">No field profit & loss data recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class FinanceDashboardComponent implements OnInit {
    private financeService = inject(FinanceService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: 'trial-balance' | 'income-statement' | 'balance-sheet' | 'budgets' | 'fiscal-closing' | 'executive-bi' = 'trial-balance';

    fieldPnLReport: any = null;
    executiveBi: any = null;

    trialLines: TrialBalanceLine[] = [];
    incomeStatement?: IncomeStatement;
    balanceSheet?: BalanceSheet;

    // Budgeting states
    budgets: BudgetStatus[] = [];
    budgetYear = 2026;
    showBudgetForm = false;
    newBudget = {
        accountCode: '',
        year: 2026,
        allocatedAmount: 1000
    };

    // Fiscal years states
    fiscalYears: FiscalYearPeriod[] = [];
    showFiscalForm = false;
    newYear = {
        year: 2026,
        startDate: '',
        endDate: ''
    };

    ngOnInit(): void {
        this.refreshReports();
        this.loadBudgets();
        this.loadFiscalYears();
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

        this.financeService.getFieldPnL().subscribe({
            next: (data) => {
                this.fieldPnLReport = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching Field PnL:', err)
        });

        this.financeService.getExecutiveBI().subscribe({
            next: (data) => {
                this.executiveBi = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching Executive BI:', err)
        });
    }

    loadBudgets(): void {
        this.financeService.getBudgets(this.budgetYear).subscribe({
            next: (data) => {
                this.budgets = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading budgets:', err)
        });
    }

    loadFiscalYears(): void {
        this.financeService.getFiscalYears().subscribe({
            next: (data) => {
                this.fiscalYears = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error loading fiscal years:', err)
        });
    }

    submitBudget(): void {
        if (!this.newBudget.accountCode) {
            alert('Please select an account.');
            return;
        }

        const command = {
            accountCode: this.newBudget.accountCode,
            fiscalYear: this.newBudget.year,
            allocatedAmount: this.newBudget.allocatedAmount
        };

        this.financeService.setBudget(command).subscribe({
            next: () => {
                this.showBudgetForm = false;
                this.loadBudgets();
            },
            error: (err) => alert('Failed to set budget: ' + (err.error?.error || err.message))
        });
    }

    submitFiscalYear(): void {
        if (!this.newYear.year || !this.newYear.startDate || !this.newYear.endDate) {
            alert('Please fill out all required fields.');
            return;
        }

        const command = {
            year: this.newYear.year,
            startDate: this.newYear.startDate,
            endDate: this.newYear.endDate
        };

        this.financeService.createFiscalYear(command).subscribe({
            next: () => {
                this.showFiscalForm = false;
                this.loadFiscalYears();
            },
            error: (err) => alert('Failed to create fiscal year: ' + (err.error?.error || err.message))
        });
    }

    closeYear(year: number): void {
        if (!confirm(`Are you absolutely sure you want to close Fiscal Year ${year}? All temporary accounts (Revenues & Expenses) will be reset to zero, net profits will post to Retained Earnings (3900), and all future journal entry postings in this range will be locked.`)) {
            return;
        }

        const command = { year };
        this.financeService.closeFiscalYear(command).subscribe({
            next: () => {
                this.loadFiscalYears();
                this.refreshReports();
                alert(`Fiscal Year ${year} has been locked and closed out successfully.`);
            },
            error: (err) => alert('Failed to close fiscal year: ' + (err.error?.error || err.message))
        });
    }

    getBudgetPercent(b: BudgetStatus): number {
        if (b.allocatedAmount <= 0) return 0;
        const pct = (b.spentAmount / b.allocatedAmount) * 100;
        return pct > 100 ? 100 : pct;
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
