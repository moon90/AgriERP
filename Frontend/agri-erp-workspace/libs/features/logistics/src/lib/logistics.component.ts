import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticsService, Elevator, WeighbridgeTicket, StorageAnalytics } from './logistics.service';

@Component({
    selector: 'lib-logistics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Supply Chain Logistics & Silo Storage</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage grain elevator occupancies, calculate quality shrinkage deductions, and generate storage ledger rental statements.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Status
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'occupancy'" [style.border-bottom]="activeTab === 'occupancy' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'occupancy' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🛢️ Silo Occupancy
        </button>
        
        <button (click)="activeTab = 'weighbridge'" [style.border-bottom]="activeTab === 'weighbridge' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'weighbridge' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🚛 Weighbridge Inbound
        </button>
        
        <button (click)="activeTab = 'ledger'" [style.border-bottom]="activeTab === 'ledger' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'ledger' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📑 Rental Charges Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Silo Occupancy -->
        <div *ngIf="activeTab === 'occupancy'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showElevatorForm = !showElevatorForm" class="btn-primary">
              {{ showElevatorForm ? 'Close Form' : '➕ Onboard Silo / Elevator' }}
            </button>
          </div>

          <!-- Onboard Elevator Form -->
          <div *ngIf="showElevatorForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Register Storage Silo Facility</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Facility Name</label>
                <input type="text" [(ngModel)]="newElevator.name" placeholder="e.g. Silo-04 Grain Complex" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Total Capacity (Tons)</label>
                <input type="number" [(ngModel)]="newElevator.capacityTons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Daily Rent Rate ($/Ton/Day)</label>
                <input type="number" [(ngModel)]="newElevator.rentalRatePerTonPerDay" step="0.01" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitElevator()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Save Silo Unit
                </button>
              </div>
            </div>
          </div>

          <!-- Silos Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let el of elevators" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-blue);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ el.name }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Rate: {{ el.rentalRatePerTonPerDay | currency:'USD' }}/Ton/Day</span>
                </div>
                <span class="badge-pill badge-blue">{{ el.utilizationPercentage | number:'1.0-0' }}% Full</span>
              </div>
              
              <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                <div>Stored: <strong style="color: #ffffff;">{{ el.currentStoredTons }} Tons</strong> / {{ el.capacityTons }} Tons</div>
              </div>

              <!-- Utilization progress bar -->
              <div style="background: rgba(15, 23, 42, 0.6); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-glass);">
                <div [style.width.%]="el.utilizationPercentage" [style.background]="el.utilizationPercentage > 85 ? 'var(--accent-amber)' : 'var(--primary-emerald)'" style="height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Weighbridge Inbound -->
        <div *ngIf="activeTab === 'weighbridge'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Log Inbound Grain Weighbridge Ticket</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Ticket Number</label>
                <input type="text" [(ngModel)]="newTicket.ticketNumber" placeholder="e.g. WBT-88219" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Destination Silo</label>
                <select [(ngModel)]="newTicket.elevatorId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Silo --</option>
                  <option *ngFor="let el of elevators" [value]="el.id">{{ el.name }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Vehicle Reg</label>
                <input type="text" [(ngModel)]="newTicket.vehicleNumber" placeholder="e.g. TRK-4091" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Gross Weight (Tons)</label>
                <input type="number" [(ngModel)]="newTicket.grossWeightTons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Tare Weight (Tons)</label>
                <input type="number" [(ngModel)]="newTicket.tareWeightTons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Moisture (%)</label>
                <input type="number" [(ngModel)]="newTicket.moisturePercentage" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Impurity (%)</label>
                <input type="number" [(ngModel)]="newTicket.impurityPercentage" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitTicket()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Issue Ticket
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Ticket No</th>
                <th>Vehicle</th>
                <th>Net Weight</th>
                <th>Quality (Moisture/FM)</th>
                <th style="text-align: right;">Billable Dry Net</th>
                <th>Date</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of tickets">
                <td><strong style="color: #ffffff;">{{ t.ticketNumber }}</strong></td>
                <td>{{ t.vehicleNumber }}</td>
                <td>{{ t.netWeightTons }} Tons</td>
                <td style="font-size: 0.85rem; color: var(--text-muted);">{{ t.moisturePercentage }}% H2O | {{ t.impurityPercentage }}% FM</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--primary-emerald);">{{ t.finalBillableWeightTons | number:'1.2-2' }} Tons</td>
                <td>{{ t.ticketDate | date:'short' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">{{ t.status }}</span>
                </td>
              </tr>
              <tr *ngIf="tickets.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No weighbridge tickets issued.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 3: Rental Charges Ledger -->
        <div *ngIf="activeTab === 'ledger'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Post Storage Rental Charge Invoice</h4>
            <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Weighbridge Ticket</label>
                <select [(ngModel)]="chargeCalc.weighbridgeTicketId" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Ticket --</option>
                  <option *ngFor="let t of tickets" [value]="t.id">{{ t.ticketNumber }} ({{ t.finalBillableWeightTons }} Tons)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Storage Duration (Days)</label>
                <input type="number" [(ngModel)]="chargeCalc.daysStored" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <button (click)="calculateCharge()" class="btn-primary">
                💳 Calculate & Post Rental Charge
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class LogisticsComponent implements OnInit {
    private logisticsService = inject(LogisticsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'occupancy';
    showElevatorForm = false;

    elevators: Elevator[] = [];
    tickets: WeighbridgeTicket[] = [];

    newElevator = {
        name: '',
        capacityTons: 5000,
        rentalRatePerTonPerDay: 0.25
    };

    newTicket = {
        ticketNumber: '',
        elevatorId: '',
        vehicleNumber: '',
        grossWeightTons: 35.5,
        tareWeightTons: 12.0,
        moisturePercentage: 14.5,
        impurityPercentage: 1.2
    };

    chargeCalc = {
        weighbridgeTicketId: '',
        daysStored: 30
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.logisticsService.getAnalytics().subscribe({
            next: (data) => {
                this.elevators = data.elevators || [];
                if (this.elevators.length > 0 && !this.newTicket.elevatorId) {
                    this.newTicket.elevatorId = this.elevators[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching analytics:', err)
        });

        this.logisticsService.getTickets().subscribe({
            next: (data) => {
                this.tickets = data || [];
                if (this.tickets.length > 0 && !this.chargeCalc.weighbridgeTicketId) {
                    this.chargeCalc.weighbridgeTicketId = this.tickets[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching tickets:', err)
        });
    }

    submitElevator(): void {
        if (!this.newElevator.name) {
            alert('Please enter facility name.');
            return;
        }

        this.logisticsService.createElevator(this.newElevator).subscribe({
            next: () => {
                this.showElevatorForm = false;
                this.newElevator.name = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save elevator: ' + err.message)
        });
    }

    submitTicket(): void {
        if (!this.newTicket.ticketNumber || !this.newTicket.elevatorId) {
            alert('Please enter ticket number and select silo.');
            return;
        }

        const command = {
            ...this.newTicket,
            ticketDate: new Date().toISOString()
        };

        this.logisticsService.createTicket(command).subscribe({
            next: () => {
                this.newTicket.ticketNumber = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to issue ticket: ' + err.message)
        });
    }

    calculateCharge(): void {
        if (!this.chargeCalc.weighbridgeTicketId) {
            alert('Please select a weighbridge ticket.');
            return;
        }

        const command = {
            weighbridgeTicketId: this.chargeCalc.weighbridgeTicketId,
            daysStored: this.chargeCalc.daysStored,
            chargeDate: new Date().toISOString()
        };

        this.logisticsService.calculateCharge(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Storage rental charge posted successfully.');
            },
            error: (err) => alert('Failed to post charge: ' + err.message)
        });
    }
}
