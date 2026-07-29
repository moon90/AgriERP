import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HrService } from './hr.service';

@Component({
    selector: 'lib-hr',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 1.5rem; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5;">
      
      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #eef2f5; padding-bottom: 1rem;">
        <div>
          <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">HR, Attendance & Employee Payroll</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage employee directory rosters, approve timesheets, run monthly payrolls, and post salary expenses to the ledger.</p>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid #e2e8f0; margin-bottom: 1.5rem; padding-bottom: 2px;">
        <button (click)="activeTab = 'employees'" [style.border-bottom]="activeTab === 'employees' ? '3px solid #3498db' : 'none'" [style.color]="activeTab === 'employees' ? '#3498db' : '#64748b'" style="padding: 10px 20px; font-weight: bold; background: none; border: none; cursor: pointer; transition: all 0.2s;">
          👤 Employees Directory
        </button>
        <button (click)="activeTab = 'attendance'" [style.border-bottom]="activeTab === 'attendance' ? '3px solid #3498db' : 'none'" [style.color]="activeTab === 'attendance' ? '#3498db' : '#64748b'" style="padding: 10px 20px; font-weight: bold; background: none; border: none; cursor: pointer; transition: all 0.2s;">
          ⏱️ Time & Attendance
        </button>
        <button (click)="activeTab = 'payroll'" [style.border-bottom]="activeTab === 'payroll' ? '3px solid #3498db' : 'none'" [style.color]="activeTab === 'payroll' ? '#3498db' : '#64748b'" style="padding: 10px 20px; font-weight: bold; background: none; border: none; cursor: pointer; transition: all 0.2s;">
          💵 Payroll Processing
        </button>
        <button (click)="activeTab = 'labor'" [style.border-bottom]="activeTab === 'labor' ? '3px solid #e67e22' : 'none'" [style.color]="activeTab === 'labor' ? '#e67e22' : '#64748b'" style="padding: 10px 20px; font-weight: bold; background: none; border: none; cursor: pointer; transition: all 0.2s;">
          🧑‍🌾 Field Labor Allocations
        </button>
      </div>

      <!-- Tab 1: Employees Directory -->
      <div *ngIf="activeTab === 'employees'">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 1rem;">
          <button (click)="showEmployeeForm = !showEmployeeForm" style="padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
            {{ showEmployeeForm ? 'Close Form' : '➕ Add Employee' }}
          </button>
        </div>

        <!-- Add Employee Form Box -->
        <div *ngIf="showEmployeeForm" style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">New Employee Registration</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">First Name</label>
              <input type="text" [(ngModel)]="newEmp.firstName" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Last Name</label>
              <input type="text" [(ngModel)]="newEmp.lastName" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Email</label>
              <input type="email" [(ngModel)]="newEmp.email" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Phone</label>
              <input type="text" [(ngModel)]="newEmp.phone" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Role / Designation</label>
              <input type="text" [(ngModel)]="newEmp.role" placeholder="e.g. Shepherd, Farm Manager" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Salary Type</label>
              <select [(ngModel)]="newEmp.isHourly" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                <option [ngValue]="true">Hourly Wages</option>
                <option [ngValue]="false">Salaried (Monthly)</option>
              </select>
            </div>
            <div *ngIf="newEmp.isHourly">
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Hourly Rate ($/HR)</label>
              <input type="number" [(ngModel)]="newEmp.baseHourlyRate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div *ngIf="!newEmp.isHourly">
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Monthly Salary ($)</label>
              <input type="number" [(ngModel)]="newEmp.monthlySalary" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem;">
            <button (click)="showEmployeeForm = false" style="padding: 8px 16px; background: #94a3b8; color: white; border: none; border-radius: 6px; cursor: pointer;">Cancel</button>
            <button (click)="submitEmployee()" style="padding: 8px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Save Employee</button>
          </div>
        </div>

        <!-- Employees Table -->
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
              <th style="padding: 1rem 0.5rem;">Employee Name</th>
              <th style="padding: 1rem 0.5rem;">Role</th>
              <th style="padding: 1rem 0.5rem;">Contact Info</th>
              <th style="padding: 1rem 0.5rem;">Compensation Details</th>
              <th style="padding: 1rem 0.5rem; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
              <td style="padding: 1rem 0.5rem; font-weight: bold; color: #34495e;">{{ emp.firstName }} {{ emp.lastName }}</td>
              <td style="padding: 1rem 0.5rem;">{{ emp.role }}</td>
              <td style="padding: 1rem 0.5rem; font-size: 0.85rem; color: #7f8c8d;">
                📞 {{ emp.phone }}<br>✉️ {{ emp.email }}
              </td>
              <td style="padding: 1rem 0.5rem; font-family: monospace; font-weight: bold;">
                <span *ngIf="emp.isHourly" style="color: #27ae60;">{{ emp.baseHourlyRate | currency:'USD' }}/HR (Hourly)</span>
                <span *ngIf="!emp.isHourly" style="color: #2980b9;">{{ emp.monthlySalary | currency:'USD' }}/MO (Salaried)</span>
              </td>
              <td style="padding: 1rem 0.5rem; text-align: center;">
                <span [ngStyle]="{
                  'background-color': emp.status === 'Active' ? '#2ecc71' : '#e74c3c',
                  'color': 'white',
                  'padding': '3px 8px',
                  'border-radius': '4px',
                  'font-size': '0.75rem',
                  'font-weight': '600'
                }">
                  {{ emp.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="employees.length === 0" style="text-align: center; color: #95a5a6;">
              <td colspan="5" style="padding: 2rem;">No registered employee records found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab 2: Time & Attendance -->
      <div *ngIf="activeTab === 'attendance'">
        <!-- Work Log Input Box (Simulator) -->
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">⏰ Attendance Clock-In Simulator</h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Select Employee</label>
              <select [(ngModel)]="newCard.employeeId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                <option value="">-- Choose Employee --</option>
                <option *ngFor="let emp of getHourlyEmployees()" [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }}</option>
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Work Date</label>
              <input type="date" [(ngModel)]="newCard.date" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Clock In Time</label>
              <input type="time" [(ngModel)]="newCard.clockIn" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Clock Out Time</label>
              <input type="time" [(ngModel)]="newCard.clockOut" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end;">
            <button (click)="submitTimeCard()" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Log Clock Card</button>
          </div>
        </div>

        <!-- Timesheet Records List -->
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
              <th style="padding: 1rem 0.5rem;">Employee Name</th>
              <th style="padding: 1rem 0.5rem;">Date</th>
              <th style="padding: 1rem 0.5rem; text-align: center;">Hours Clocked</th>
              <th style="padding: 1rem 0.5rem;">Duty Hours</th>
              <th style="padding: 1rem 0.5rem; text-align: center;">Approval</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let card of timeCards" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
              <td style="padding: 1rem 0.5rem; font-weight: bold; color: #34495e;">{{ getEmployeeName(card.employeeId) }}</td>
              <td style="padding: 1rem 0.5rem;">{{ card.date | date:'longDate' }}</td>
              <td style="padding: 1rem 0.5rem; text-align: center; font-family: monospace; font-weight: bold; color: #2980b9;">
                {{ card.hoursWorked }} Hrs
              </td>
              <td style="padding: 1rem 0.5rem; font-size: 0.85rem; color: #7f8c8d;">
                In: {{ card.clockIn }} | Out: {{ card.clockOut }}
              </td>
              <td style="padding: 1rem 0.5rem; text-align: center;">
                <span *ngIf="card.isApproved" style="background-color: #2ecc71; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
                  Approved by: {{ card.approvedBy }}
                </span>
                <button *ngIf="!card.isApproved" (click)="approveCard(card.employeeId, card.date)" style="padding: 3px 8px; background: #e67e22; color: white; border: none; border-radius: 4px; font-size: 0.75rem; cursor: pointer; font-weight: bold;">
                  Approve Hours
                </button>
              </td>
            </tr>
            <tr *ngIf="timeCards.length === 0" style="text-align: center; color: #95a5a6;">
              <td colspan="5" style="padding: 2rem;">No clocked attendance timecards found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab 3: Payroll Processing -->
      <div *ngIf="activeTab === 'payroll'">
        <!-- Run Payroll Processor Panel -->
        <div style="background: #f8fafc; padding: 1.5rem; border-radius: 10px; border: 1px solid #e2e8f0; margin-bottom: 2rem;">
          <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">💵 Monthly Payroll Run calculation</h4>
          <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap; margin-bottom: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Start Date</label>
              <input type="date" [(ngModel)]="payrollRun.startDate" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">End Date</label>
              <input type="date" [(ngModel)]="payrollRun.endDate" style="padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
            </div>
            <button (click)="runPayroll()" style="padding: 9px 20px; background: #3498db; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              ⚙️ Calculate Salary Slips
            </button>
          </div>
        </div>

        <!-- Payroll Runs Period List -->
        <h4 style="color: #2c3e50; margin: 1.5rem 0 0.5rem 0;">Processed Pay Periods</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
          <div *ngFor="let p of payrollPeriods" style="border: 1px solid #eef2f5; border-radius: 8px; padding: 1rem; background: #fafbfc; position: relative;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: bold; color: #34495e;">{{ p.startDate | date:'mediumDate' }} - {{ p.endDate | date:'mediumDate' }}</span>
              <span [ngStyle]="{
                'background-color': p.status === 'Paid' ? '#2ecc71' : '#3498db',
                'color': 'white',
                'padding': '2px 6px',
                'border-radius': '4px',
                'font-size': '0.7rem',
                'font-weight': '600'
              }">
                {{ p.status }}
              </span>
            </div>
            <p style="font-size: 0.85rem; color: #7f8c8d; margin: 0.25rem 0 1rem 0;">
              Processed: {{ p.processedAt | date:'short' }} <br>
              Paid: {{ p.paidAt ? (p.paidAt | date:'short') : 'Pending Payout' }}
            </p>
            <button *ngIf="p.status === 'Processed'" (click)="disbursePayroll(p.id)" style="width: 100%; padding: 6px 12px; background: #27ae60; color: white; border: none; border-radius: 5px; font-size: 0.85rem; font-weight: bold; cursor: pointer;">
              💳 Release Payments & Post to General Ledger
            </button>
          </div>
          <div *ngIf="payrollPeriods.length === 0" style="padding: 1.5rem; text-align: center; color: #95a5a6; border: 1px dashed #cbd5e1; border-radius: 8px; width: 100%;">
            No active processed payroll period history records found.
          </div>
        </div>

        <!-- Payslips details list -->
        <h4 style="color: #2c3e50; margin: 0.5rem 0;">Computed Employee Payslips</h4>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid #eef2f5; color: #34495e; font-size: 0.9rem; font-weight: 700; text-transform: uppercase;">
              <th style="padding: 1rem 0.5rem;">Employee Name</th>
              <th style="padding: 1rem 0.5rem; text-align: right;">Gross Pay</th>
              <th style="padding: 1rem 0.5rem; text-align: right;">Tax Withheld (15%)</th>
              <th style="padding: 1rem 0.5rem; text-align: right;">Net Pay disbursed</th>
              <th style="padding: 1rem 0.5rem; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let slip of payslips" style="border-bottom: 1px solid #f8f9fa; font-size: 0.95rem; color: #2c3e50;">
              <td style="padding: 1rem 0.5rem; font-weight: bold; color: #34495e;">{{ getEmployeeName(slip.employeeId) }}</td>
              <td style="padding: 1rem 0.5rem; text-align: right; font-family: monospace;">{{ slip.grossEarnings | currency:'USD' }}</td>
              <td style="padding: 1rem 0.5rem; text-align: right; color: #e74c3c; font-family: monospace;">-{{ slip.taxDeductions | currency:'USD' }}</td>
              <td style="padding: 1rem 0.5rem; text-align: right; font-weight: bold; color: #2ecc71; font-family: monospace;">{{ slip.netPay | currency:'USD' }}</td>
              <td style="padding: 1rem 0.5rem; text-align: center;">
                <span [ngStyle]="{
                  'background-color': slip.status === 'Paid' ? '#2ecc71' : '#f39c12',
                  'color': 'white',
                  'padding': '2px 6px',
                  'border-radius': '4px',
                  'font-size': '0.75rem',
                  'font-weight': '600'
                }">
                  {{ slip.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="payslips.length === 0" style="text-align: center; color: #95a5a6;">
              <td colspan="5" style="padding: 2rem;">No payslips computed. Click 'Calculate Salary Slips' above to calculate.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tab 4: Direct Field Labor Allocations -->
      <div *ngIf="activeTab === 'labor'">
        <!-- Field Labor Metrics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #e67e22;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">TOTAL FIELD LABOR HOURS</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #d35400; margin-top: 0.25rem;">
              {{ laborAnalytics?.totalLaborHours || 0 | number:'1.1-2' }} hrs
            </div>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #27ae60;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">TOTAL DIRECT LABOR EXPENSE</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #27ae60; margin-top: 0.25rem;">
              {{ laborAnalytics?.totalLaborExpense || 0 | currency:'USD' }}
            </div>
          </div>
          <div style="background: #f8fafc; border-radius: 10px; padding: 1.25rem; border: 1px solid #e2e8f0; border-left: 5px solid #2980b9;">
            <div style="font-size: 0.8rem; color: #64748b; font-weight: 700;">FIELDS WORKED</div>
            <div style="font-size: 1.6rem; font-weight: 800; color: #2980b9; margin-top: 0.25rem;">
              {{ laborAnalytics?.totalFieldsWorked || 0 }} Plots
            </div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem;">
          <!-- Allocations Table -->
          <div>
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">Recorded Field Labor Hours</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
              <thead>
                <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                  <th style="padding: 8px;">Employee</th>
                  <th style="padding: 8px;">Date / Activity</th>
                  <th style="padding: 8px; text-align: right;">Hours</th>
                  <th style="padding: 8px; text-align: right;">Rate ($/hr)</th>
                  <th style="padding: 8px; text-align: right;">Total Cost ($)</th>
                  <th style="padding: 8px; text-align: center;">Ledger</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of laborAllocations" style="border-bottom: 1px solid #eef2f5;">
                  <td style="padding: 8px; font-weight: bold; color: #2c3e50;">{{ a.employeeName }}</td>
                  <td style="padding: 8px;">
                    <div>{{ a.allocationDate | date:'yyyy-MM-dd' }}</div>
                    <span style="font-size: 0.75rem; background: #fff3bf; color: #f59f00; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                      {{ a.activityType }}
                    </span>
                  </td>
                  <td style="padding: 8px; text-align: right;">{{ a.hoursWorked }} hrs</td>
                  <td style="padding: 8px; text-align: right;">{{ a.hourlyRate | currency:'USD' }}</td>
                  <td style="padding: 8px; text-align: right; font-weight: bold; color: #27ae60;">
                    {{ a.totalLaborCost | currency:'USD' }}
                  </td>
                  <td style="padding: 8px; text-align: center;">
                    <span style="font-size: 0.75rem; background: #d3f9d8; color: #2b8a3e; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
                      Posted GL 5110
                    </span>
                  </td>
                </tr>
                <tr *ngIf="laborAllocations.length === 0" style="text-align: center; color: #95a5a6;">
                  <td colspan="6" style="padding: 2rem;">No field labor allocations recorded. Use the form to assign employee hours.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Allocate Labor Form -->
          <div style="background: #fffaf4; border: 1px solid #ffd8b3; padding: 1.25rem; border-radius: 10px; border-left: 5px solid #e67e22; font-size: 0.85rem;">
            <h4 style="margin: 0 0 1rem 0; color: #e67e22;">Allocate Field Labor Hours</h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div>
                <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Select Employee</label>
                <select [(ngModel)]="newLabor.employeeId" (change)="onLaborEmpChange()" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="">-- Choose Employee --</option>
                  <option *ngFor="let emp of employees" [value]="emp.id">{{ emp.firstName }} {{ emp.lastName }} ({{ emp.role }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Activity Type</label>
                <select [(ngModel)]="newLabor.activityType" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="Harvesting">Harvesting</option>
                  <option value="Planting">Planting</option>
                  <option value="Pruning">Pruning</option>
                  <option value="Spraying">Spraying</option>
                  <option value="Weeding">Weeding</option>
                  <option value="Irrigation">Irrigation</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Work Date</label>
                <input type="date" [(ngModel)]="newLabor.allocationDate" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Hours</label>
                  <input type="number" [(ngModel)]="newLabor.hoursWorked" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Rate ($/hr)</label>
                  <input type="number" [(ngModel)]="newLabor.hourlyRate" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
              </div>
              <div>
                <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Notes</label>
                <input type="text" [(ngModel)]="newLabor.notes" placeholder="e.g. Field A-01 harvest team" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <button (click)="submitLaborAllocation()" [disabled]="!newLabor.employeeId || !newLabor.hoursWorked" style="padding: 10px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
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
