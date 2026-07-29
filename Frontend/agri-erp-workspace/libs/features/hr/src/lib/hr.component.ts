import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService } from './hr.service';

@Component({
    selector: 'lib-hr',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Title Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">HR, Attendance & Field Labor Payroll</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage employee directory rosters, approve timesheets, run monthly payrolls, and post salary expenses to the ledger.</p>
        </div>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'employees'" [style.border-bottom]="activeTab === 'employees' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'employees' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          👤 Employees Directory
        </button>
        <button (click)="activeTab = 'attendance'" [style.border-bottom]="activeTab === 'attendance' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'attendance' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          ⏱️ Time & Attendance
        </button>
        <button (click)="activeTab = 'payroll'" [style.border-bottom]="activeTab === 'payroll' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'payroll' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💵 Payroll Processing
        </button>
        <button (click)="activeTab = 'labor'" [style.border-bottom]="activeTab === 'labor' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'labor' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🧑‍🌾 Field Labor Allocations
        </button>
      </div>

      <!-- Tab 1: Employees Directory -->
      <div *ngIf="activeTab === 'employees'">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
          <button (click)="showEmployeeForm = !showEmployeeForm" class="btn-primary">
            {{ showEmployeeForm ? 'Close Form' : '➕ Register New Employee' }}
          </button>
        </div>

        <!-- Add Employee Form Box -->
        <div *ngIf="showEmployeeForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1.25rem 0; color: #ffffff; font-size: 1.1rem;">New Employee Registration</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">First Name</label>
              <input type="text" [(ngModel)]="newEmp.firstName" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Last Name</label>
              <input type="text" [(ngModel)]="newEmp.lastName" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Email</label>
              <input type="email" [(ngModel)]="newEmp.email" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Phone</label>
              <input type="text" [(ngModel)]="newEmp.phone" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Role / Designation</label>
              <input type="text" [(ngModel)]="newEmp.role" placeholder="e.g. Shepherd, Farm Manager" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Salary Type</label>
              <select [(ngModel)]="newEmp.isHourly" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                <option [ngValue]="true">Hourly Wages</option>
                <option [ngValue]="false">Salaried (Monthly)</option>
              </select>
            </div>
            <div *ngIf="newEmp.isHourly">
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Hourly Rate ($/HR)</label>
              <input type="number" [(ngModel)]="newEmp.baseHourlyRate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div *ngIf="!newEmp.isHourly">
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Monthly Salary ($)</label>
              <input type="number" [(ngModel)]="newEmp.monthlySalary" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button (click)="showEmployeeForm = false" class="btn-secondary">Cancel</button>
            <button (click)="submitEmployee()" class="btn-primary">Save Employee</button>
          </div>
        </div>

        <!-- Employees Table -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Role</th>
                <th>Contact Info</th>
                <th>Compensation Details</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let emp of employees">
                <td><strong style="color: #ffffff;">{{ emp.firstName }} {{ emp.lastName }}</strong></td>
                <td>{{ emp.role }}</td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">
                  📞 {{ emp.phone }}<br>✉️ {{ emp.email }}
                </td>
                <td style="font-family: monospace; font-weight: bold;">
                  <span *ngIf="emp.isHourly" style="color: var(--primary-emerald);">{{ emp.baseHourlyRate | currency:'USD' }}/HR (Hourly)</span>
                  <span *ngIf="!emp.isHourly" style="color: var(--accent-blue);">{{ emp.monthlySalary | currency:'USD' }}/MO (Salaried)</span>
                </td>
                <td style="text-align: center;">
                  <span [ngClass]="emp.status === 'Active' ? 'badge-pill badge-emerald' : 'badge-pill badge-rose'">
                    {{ emp.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="employees.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No registered employee records found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 2: Time & Attendance -->
      <div *ngIf="activeTab === 'attendance'">
        <!-- Work Log Input Box (Simulator) -->
        <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #ffffff;">⏰ Attendance Clock-In Simulator</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem;">
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Select Employee</label>
              <select [(ngModel)]="newCard.employeeId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                <option value="">-- Choose Employee --</option>
                <option *ngFor="let emp of getHourlyEmployees()" [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Work Date</label>
              <input type="date" [(ngModel)]="newCard.date" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Clock In Time</label>
              <input type="time" [(ngModel)]="newCard.clockIn" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Clock Out Time</label>
              <input type="time" [(ngModel)]="newCard.clockOut" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="submitTimeCard()" class="btn-primary">Log Clock Card</button>
          </div>
        </div>

        <!-- Timesheet Records List -->
        <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Date</th>
                <th style="text-align: center;">Hours Clocked</th>
                <th>Duty Hours</th>
                <th style="text-align: center;">Approval</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let card of timeCards">
                <td><strong style="color: #ffffff;">{{ getEmployeeName(card.employeeId) }}</strong></td>
                <td>{{ card.date | date:'longDate' }}</td>
                <td style="text-align: center; font-family: monospace; font-weight: bold; color: var(--accent-blue);">
                  {{ card.hoursWorked }} Hrs
                </td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">
                  In: {{ card.clockIn }} | Out: {{ card.clockOut }}
                </td>
                <td style="text-align: center;">
                  <span *ngIf="card.isApproved" class="badge-pill badge-emerald">
                    Approved by: {{ card.approvedBy }}
                  </span>
                  <button *ngIf="!card.isApproved" (click)="approveCard(card.employeeId, card.date)" class="badge-pill badge-amber" style="cursor: pointer; border: none;">
                    Approve Hours
                  </button>
                </td>
              </tr>
              <tr *ngIf="timeCards.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No clocked attendance timecards found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 3: Payroll Processing -->
      <div *ngIf="activeTab === 'payroll'">
        <!-- Run Payroll Processor Panel -->
        <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #ffffff;">💵 Monthly Payroll Run Calculation</h4>
          <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Start Date</label>
              <input type="date" [(ngModel)]="payrollRun.startDate" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">End Date</label>
              <input type="date" [(ngModel)]="payrollRun.endDate" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
            </div>
            <button (click)="runPayroll()" class="btn-primary">
              ⚙️ Calculate Salary Slips
            </button>
          </div>
        </div>

        <!-- Payroll Runs Period List -->
        <h4 style="color: #ffffff; margin: 1.5rem 0 1rem 0;">Processed Pay Periods</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div *ngFor="let p of payrollPeriods" style="border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; background: rgba(30, 41, 59, 0.7);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <strong style="color: #ffffff;">{{ p.startDate | date:'mediumDate' }} - {{ p.endDate | date:'mediumDate' }}</strong>
              <span [ngClass]="p.status === 'Paid' ? 'badge-pill badge-emerald' : 'badge-pill badge-blue'">
                {{ p.status }}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.5rem 0 1rem 0; line-height: 1.4;">
              Processed: {{ p.processedAt | date:'short' }} <br>
              Paid: {{ p.paidAt ? (p.paidAt | date:'short') : 'Pending Payout' }}
            </p>
            <button *ngIf="p.status === 'Processed'" (click)="disbursePayroll(p.id)" class="btn-primary" style="width: 100%; justify-content: center;">
              💳 Release Payments & Post to Ledger
            </button>
          </div>
          <div *ngIf="payrollPeriods.length === 0" style="padding: 1.5rem; text-align: center; color: var(--text-muted); border: 1px dashed var(--border-glass); border-radius: 12px; grid-column: 1 / -1;">
            No active processed payroll period history records found.
          </div>
        </div>

        <!-- Payslips details list -->
        <h4 style="color: #ffffff; margin: 1.5rem 0 1rem 0;">Computed Employee Payslips</h4>
        <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th style="text-align: right;">Gross Pay</th>
                <th style="text-align: right;">Tax Withheld (15%)</th>
                <th style="text-align: right;">Net Pay Disbursed</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let slip of payslips">
                <td><strong style="color: #ffffff;">{{ getEmployeeName(slip.employeeId) }}</strong></td>
                <td style="text-align: right; font-family: monospace;">{{ slip.grossEarnings | currency:'USD' }}</td>
                <td style="text-align: right; color: var(--accent-rose); font-family: monospace;">-{{ slip.taxDeductions | currency:'USD' }}</td>
                <td style="text-align: right; font-weight: bold; color: var(--primary-emerald); font-family: monospace;">{{ slip.netPay | currency:'USD' }}</td>
                <td style="text-align: center;">
                  <span [ngClass]="slip.status === 'Paid' ? 'badge-pill badge-emerald' : 'badge-pill badge-amber'">
                    {{ slip.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="payslips.length === 0">
                <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No payslips computed. Click 'Calculate Salary Slips' above to calculate.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Tab 4: Direct Field Labor Allocations -->
      <div *ngIf="activeTab === 'labor'">
        <!-- Field Labor Metrics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--accent-amber);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL FIELD LABOR HOURS</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem;">
              {{ laborAnalytics?.totalLaborHours || 0 | number:'1.1-2' }} hrs
            </div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--primary-emerald);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">TOTAL DIRECT LABOR EXPENSE</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--primary-emerald); margin-top: 0.35rem;">
              {{ laborAnalytics?.totalLaborExpense || 0 | currency:'USD' }}
            </div>
          </div>
          <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; padding: 1.35rem; border: 1px solid var(--border-glass); border-left: 4px solid var(--accent-blue);">
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 700;">FIELDS WORKED</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: var(--accent-blue); margin-top: 0.35rem;">
              {{ laborAnalytics?.totalFieldsWorked || 0 }} Plots
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 1.5rem;">
          <!-- Allocations Table -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Recorded Field Labor Hours</h4>
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date / Activity</th>
                  <th style="text-align: right;">Hours</th>
                  <th style="text-align: right;">Rate ($/hr)</th>
                  <th style="text-align: right;">Total Cost ($)</th>
                  <th style="text-align: center;">Ledger</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of laborAllocations">
                  <td><strong style="color: #ffffff;">{{ a.employeeName }}</strong></td>
                  <td>
                    <div>{{ a.allocationDate | date:'yyyy-MM-dd' }}</div>
                    <span class="badge-pill badge-amber" style="margin-top: 2px;">
                      {{ a.activityType }}
                    </span>
                  </td>
                  <td style="text-align: right; font-family: monospace; font-weight: bold;">{{ a.hoursWorked }} hrs</td>
                  <td style="text-align: right; font-family: monospace;">{{ a.hourlyRate | currency:'USD' }}</td>
                  <td style="text-align: right; font-weight: bold; color: var(--primary-emerald); font-family: monospace;">
                    {{ a.totalLaborCost | currency:'USD' }}
                  </td>
                  <td style="text-align: center;">
                    <span class="badge-pill badge-emerald">
                      Posted GL 5110
                    </span>
                  </td>
                </tr>
                <tr *ngIf="laborAllocations.length === 0">
                  <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No field labor allocations recorded. Use the form to assign employee hours.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Allocate Labor Form -->
          <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid var(--border-glass-light); padding: 1.5rem; border-radius: 14px; border-left: 4px solid var(--accent-amber);">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Allocate Field Labor Hours</h4>
            <div style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Select Employee</label>
                <select [(ngModel)]="newLabor.employeeId" (change)="onLaborEmpChange()" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Employee --</option>
                  <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }} ({{ emp.role }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Activity Type</label>
                <select [(ngModel)]="newLabor.activityType" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="Harvesting">Harvesting</option>
                  <option value="Planting">Planting</option>
                  <option value="Pruning">Pruning</option>
                  <option value="Spraying">Spraying</option>
                  <option value="Weeding">Weeding</option>
                  <option value="Irrigation">Irrigation</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Work Date</label>
                <input type="date" [(ngModel)]="newLabor.allocationDate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div>
                  <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Hours</label>
                  <input type="number" [(ngModel)]="newLabor.hoursWorked" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Rate ($/hr)</label>
                  <input type="number" [(ngModel)]="newLabor.hourlyRate" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">Notes</label>
                <input type="text" [(ngModel)]="newLabor.notes" placeholder="e.g. Field A-01 harvest team" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <button (click)="submitLaborAllocation()" [disabled]="!newLabor.employeeId || !newLabor.hoursWorked" class="btn-primary" style="width: 100%; justify-content: center;">
                Save & Post Labor Expense
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `
})
export class HrComponent implements OnInit {
    private hrService = inject(HrService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'employees';
    showEmployeeForm = false;

    employees: any[] = [];
    timeCards: any[] = [];
    payrollPeriods: any[] = [];
    payslips: any[] = [];

    laborAllocations: any[] = [];
    laborAnalytics: any = null;

    newLabor = {
        employeeId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        allocationDate: new Date().toISOString().split('T')[0],
        hoursWorked: 8.0,
        hourlyRate: 22.50,
        activityType: 'Harvesting',
        notes: ''
    };

    newEmp = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        baseHourlyRate: 20,
        monthlySalary: 3000,
        isHourly: true
    };

    newCard = {
        employeeId: '',
        date: '',
        clockIn: '08:00',
        clockOut: '17:00'
    };

    payrollRun = {
        startDate: '',
        endDate: ''
    };

    ngOnInit(): void {
        this.loadAllData();
    }

    loadAllData(): void {
        this.hrService.getEmployees().subscribe({
            next: (data) => {
                this.employees = data;
                this.cdr.detectChanges();
            }
        });
        this.hrService.getTimeCards().subscribe({
            next: (data) => {
                this.timeCards = data;
                this.cdr.detectChanges();
            }
        });
        this.hrService.getPayrollPeriods().subscribe({
            next: (data) => {
                this.payrollPeriods = data;
                this.cdr.detectChanges();
            }
        });
        this.hrService.getPayslips().subscribe({
            next: (data) => {
                this.payslips = data;
                this.cdr.detectChanges();
            }
        });
        this.loadLaborData();
    }

    getHourlyEmployees(): any[] {
        return this.employees.filter(e => e.isHourly && e.status === 'Active');
    }

    getEmployeeName(id: string): string {
        const emp = this.employees.find(e => e.id === id);
        return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Employee';
    }

    submitEmployee(): void {
        if (!this.newEmp.firstName || !this.newEmp.lastName || !this.newEmp.email) {
            alert('Please fill out all required fields.');
            return;
        }

        const command = {
            firstName: this.newEmp.firstName,
            lastName: this.newEmp.lastName,
            email: this.newEmp.email,
            phone: this.newEmp.phone,
            role: this.newEmp.role,
            baseHourlyRate: this.newEmp.isHourly ? this.newEmp.baseHourlyRate : 0,
            monthlySalary: this.newEmp.isHourly ? 0 : this.newEmp.monthlySalary,
            isHourly: this.newEmp.isHourly
        };

        this.hrService.createEmployee(command).subscribe({
            next: () => {
                this.showEmployeeForm = false;
                this.loadAllData();
                this.resetNewEmp();
            },
            error: (err) => alert('Failed to register employee: ' + err.message)
        });
    }

    resetNewEmp(): void {
        this.newEmp = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: '',
            baseHourlyRate: 20,
            monthlySalary: 3000,
            isHourly: true
        };
    }

    submitTimeCard(): void {
        if (!this.newCard.employeeId || !this.newCard.date) {
            alert('Please select an employee and a valid date.');
            return;
        }

        const command = {
            employeeId: this.newCard.employeeId,
            date: this.newCard.date,
            clockIn: this.newCard.clockIn + ':00',
            clockOut: this.newCard.clockOut + ':00'
        };

        this.hrService.logTimeCard(command).subscribe({
            next: () => {
                this.loadAllData();
                this.newCard.employeeId = '';
                this.newCard.date = '';
            },
            error: (err) => alert('Failed to log clock card: ' + err.message)
        });
    }

    approveCard(empId: string, dateStr: string): void {
        const command = {
            employeeId: empId,
            startDate: dateStr,
            endDate: dateStr
        };

        this.hrService.approveTimeCards(command).subscribe({
            next: () => {
                this.loadAllData();
            },
            error: (err) => alert('Failed to approve hours: ' + err.message)
        });
    }

    runPayroll(): void {
        if (!this.payrollRun.startDate || !this.payrollRun.endDate) {
            alert('Please select start and end dates.');
            return;
        }

        const command = {
            startDate: this.payrollRun.startDate,
            endDate: this.payrollRun.endDate
        };

        this.hrService.processPayroll(command).subscribe({
            next: () => {
                this.loadAllData();
                this.payrollRun.startDate = '';
                this.payrollRun.endDate = '';
            },
            error: (err) => alert('Failed to compute payroll: ' + (err.error?.error || err.message))
        });
    }

    disbursePayroll(periodId: string): void {
        this.hrService.payPayroll(periodId).subscribe({
            next: () => {
                this.loadAllData();
                alert('Payroll paid and wages expense posted to general ledger successfully.');
            },
            error: (err) => alert('Failed to release payouts: ' + (err.error?.error || err.message))
        });
    }

    onLaborEmpChange(): void {
        const emp = this.employees.find(e => e.id === this.newLabor.employeeId);
        if (emp && emp.baseHourlyRate) {
            this.newLabor.hourlyRate = emp.baseHourlyRate;
        }
    }

    submitLaborAllocation(): void {
        if (!this.newLabor.employeeId || !this.newLabor.hoursWorked) return;

        const payload = {
            ...this.newLabor,
            allocationDate: new Date(this.newLabor.allocationDate).toISOString()
        };

        this.hrService.allocateLabor(payload).subscribe({
            next: () => {
                this.loadAllData();
                this.newLabor.notes = '';
            },
            error: (err) => alert('Failed to allocate field labor: ' + err.message)
        });
    }

    loadLaborData(): void {
        this.hrService.getLaborAnalytics().subscribe({
            next: (data) => {
                this.laborAnalytics = data;
                this.laborAllocations = data.allocations || [];
                this.cdr.detectChanges();
            }
        });
    }
}
