import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogisticsService, Elevator, WeighbridgeTicket, StorageAnalytics } from './logistics.service';

@Component({
    selector: 'lib-logistics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2980b9; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Supply Chain Logistics & Silo Storage</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Manage grain elevator occupancies, calculate quality shrinkage deductions, and generate storage ledger rental statements.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Status
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'occupancy'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'occupancy' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'occupancy' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🛢️ Silo Occupancy
        </button>
        
        <button (click)="activeTab = 'weighbridge'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'weighbridge' ? '#27ae60' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'weighbridge' ? '3px solid #27ae60' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🚛 Weighbridge Inbound
        </button>
        
        <button (click)="activeTab = 'ledger'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'ledger' ? '#8e44ad' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'ledger' ? '3px solid #8e44ad' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📖 Storage Billing Ledger
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Silo Occupancy -->
        <div *ngIf="activeTab === 'occupancy'">
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
            <div style="background: #ebf5fb; border: 1px solid #a9cbe3; border-radius: 8px; padding: 1rem; text-align: center;">
              <div style="font-size: 0.75rem; color: #566573; margin-bottom: 0.25rem;">TOTAL STORAGE REVENUE BILLED</div>
              <div style="font-size: 1.75rem; font-weight: bold; color: #2980b9;">{{ analytics?.totalBilledRevenue | currency:'USD' }}</div>
            </div>
            
            <div style="background: #fdf2e9; border: 1px solid #f5cba7; border-radius: 8px; padding: 1rem; text-align: center;">
              <div style="font-size: 0.75rem; color: #566573; margin-bottom: 0.25rem;">PENDING BILLING TICKETS</div>
              <div style="font-size: 1.75rem; font-weight: bold; color: #e67e22;">{{ analytics?.pendingBillingTicketsCount }} Receipts</div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showElevatorForm = !showElevatorForm" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showElevatorForm ? 'Close Form' : '➕ Onboard Storage Silo' }}
            </button>
          </div>

          <!-- Add Elevator Form -->
          <div *ngIf="showElevatorForm" style="background: #ebf5fb; border: 1px solid #a9cbe3; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #2980b9;">
            <h4 style="margin: 0 0 1.25rem 0; color: #2980b9; font-size: 1.1rem;">Configure Elevator Storage Silo</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Silo Name</label>
                <input type="text" [(ngModel)]="newElevator.name" placeholder="e.g. Silo-A West Wing" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Total Capacity (Tons)</label>
                <input type="number" [(ngModel)]="newElevator.capacityTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Rental Rate ($ / Ton / Day)</label>
                <input type="number" [(ngModel)]="newElevator.rentalRatePerTonPerDay" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitElevator()" style="padding: 10px 24px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Silo Profile
              </button>
            </div>
          </div>

          <!-- Elevators Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let elevator of elevators" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #2980b9;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">🛢️ {{ elevator.name }}</h4>
                <span style="font-size: 0.75rem; color: #7f8c8d; font-family: monospace;">Rate: {{ elevator.rentalRatePerTonPerDay | currency:'USD' }}/t/d</span>
              </div>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6; margin-bottom: 1rem;">
                <div>📦 Occupancy: <strong>{{ elevator.currentStoredTons }} / {{ elevator.capacityTons }} Tons</strong></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #7f8c8d; margin-bottom: 0.25rem;">
                <span>Utilization</span>
                <span>{{ elevator.utilizationPercentage | number:'1.0-1' }}%</span>
              </div>
              <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div [style.width.%]="elevator.utilizationPercentage" style="background-color: #2980b9; height: 100%;"></div>
              </div>
            </div>
          </div>
          <div *ngIf="elevators.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No grain elevator silos registered. Set up a silo above to initialize logistics logs.
          </div>
        </div>

        <!-- Tab 2: Weighbridge Inbound -->
        <div *ngIf="activeTab === 'weighbridge'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
            <button (click)="showTicketForm = !showTicketForm" style="padding: 8px 16px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showTicketForm ? 'Close Form' : '➕ Register Inbound Load' }}
            </button>
          </div>

          <!-- Add Ticket Form -->
          <div *ngIf="showTicketForm" style="background: #e8f8f5; border: 1px solid #a3e4d7; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #27ae60; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #27ae60; font-size: 1.1rem;">Register Vehicle Weighbridge Load</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Ticket Number</label>
                <input type="text" [(ngModel)]="newTicket.ticketNumber" placeholder="e.g. TKT-7781" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Silo Silo</label>
                <select [(ngModel)]="newTicket.elevatorId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option *ngFor="let e of elevators" [value]="e.id">{{ e.name }} (Avail: {{ e.capacityTons - e.currentStoredTons }} t)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Vehicle License Plate</label>
                <input type="text" [(ngModel)]="newTicket.vehicleNumber" placeholder="e.g. TR-88-AB" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Gross Weight (Tons)</label>
                <input type="number" [(ngModel)]="newTicket.grossWeightTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Tare Weight (Tons)</label>
                <input type="number" [(ngModel)]="newTicket.tareWeightTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Moisture Content (%)</label>
                <input type="number" [(ngModel)]="newTicket.moisturePercentage" placeholder="Target: 14%" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Impurity Content (%)</label>
                <input type="number" [(ngModel)]="newTicket.impurityPercentage" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Client Contract ID</label>
                <input type="text" [(ngModel)]="newTicket.contractClientId" placeholder="e.g. AGRI-SYS-CO" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Delivery Date</label>
                <input type="date" [(ngModel)]="newTicket.ticketDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitTicket()" style="padding: 10px 24px; background: #27ae60; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Ingest Receipt & Update Silo
              </button>
            </div>
          </div>

          <!-- Tickets Table -->
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 8px;">Ticket No</th>
                <th style="padding: 8px;">Vehicle No</th>
                <th style="padding: 8px; text-align: right;">Gross / Tare Weight</th>
                <th style="padding: 8px; text-align: right;">Net Weight</th>
                <th style="padding: 8px; text-align: right;">Moisture / Impurity</th>
                <th style="padding: 8px; text-align: right;">Billable Weight</th>
                <th style="padding: 8px;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ticket of tickets" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 8px; font-weight: bold; font-family: monospace;">{{ ticket.ticketNumber }}</td>
                <td style="padding: 8px;">{{ ticket.vehicleNumber }}</td>
                <td style="padding: 8px; text-align: right;">{{ ticket.grossWeightTons }}t / {{ ticket.tareWeightTons }}t</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">{{ ticket.netWeightTons }} Tons</td>
                <td style="padding: 8px; text-align: right; color: #7f8c8d;">{{ ticket.moisturePercentage }}% / {{ ticket.impurityPercentage }}%</td>
                <td style="padding: 8px; text-align: right; font-weight: bold; color: #27ae60;">{{ ticket.finalBillableWeightTons }} Tons</td>
                <td style="padding: 8px;">
                  <span [ngStyle]="{
                    'background-color': getTicketStatusColor(ticket.status),
                    'color': 'white',
                    'padding': '2px 6px',
                    'border-radius': '3px',
                    'font-size': '0.75rem',
                    'font-weight': 'bold'
                  }">{{ ticket.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="tickets.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No weighbridge load receipts ingested. Use the register load button above to input weights.
          </div>
        </div>

        <!-- Tab 3: Storage Billing Ledger -->
        <div *ngIf="activeTab === 'ledger'">
          <div style="grid-template-columns: 320px 1fr; gap: 2rem; display: grid;">
            
            <!-- Left Pick Columns -->
            <div style="border-right: 1px solid #eef2f5; padding-right: 1.5rem;">
              <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1rem;">Select Ticket to Invoice</h4>
              <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 400px; overflow-y: auto;">
                <div *ngFor="let t of getPendingTickets()" 
                     (click)="setSelectedTicket(t)"
                     [ngStyle]="{
                       'padding': '10px',
                       'border': '1px solid',
                       'border-color': selectedTicket?.id === t.id ? '#8e44ad' : '#eef2f5',
                       'border-radius': '6px',
                       'cursor': 'pointer',
                       'background-color': selectedTicket?.id === t.id ? '#faf8fd' : 'transparent',
                       'transition': 'all 0.2s'
                     }">
                  <strong style="display: block; font-size: 0.85rem; color: #2c3e50;">🚛 Ticket: {{ t.ticketNumber }}</strong>
                  <span style="font-size: 0.75rem; color: #7f8c8d;">Billable: {{ t.finalBillableWeightTons }} Tons | Client: {{ t.contractClientId || 'Self-Stored' }}</span>
                </div>
                <div *ngIf="getPendingTickets().length === 0" style="font-size: 0.8rem; color: #95a5a6; padding: 1rem; text-align: center;">
                  No pending billing weighbridge tickets found.
                </div>
              </div>
            </div>

            <!-- Right Calculate Column -->
            <div>
              <div *ngIf="selectedTicket">
                <h4 style="margin: 0 0 1.5rem 0; color: #8e44ad;">📖 Calculate Storage Rental Statement</h4>
                <div style="background: #faf8fd; border: 1px solid #dcd0eb; border-left: 5px solid #8e44ad; padding: 1.25rem; border-radius: 8px; margin-bottom: 2rem; font-size: 0.9rem; line-height: 1.6;">
                  <div>Ticket Reference: <strong>{{ selectedTicket.ticketNumber }}</strong></div>
                  <div>Client Contractor: <strong>{{ selectedTicket.contractClientId || 'Internal farming stock' }}</strong></div>
                  <div>Final Billable Net Weight: <strong>{{ selectedTicket.finalBillableWeightTons }} Tons</strong></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end; margin-bottom: 1.5rem;">
                  <div>
                    <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Storage Period (Days)</label>
                    <input type="number" [(ngModel)]="daysStored" (input)="updateChargeValue()" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Invoice Date</label>
                    <input type="date" [(ngModel)]="chargeDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                  </div>
                </div>

                <div style="background: #f8fafc; padding: 1.25rem; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 2rem;">
                  <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">CALCULATED STORAGE RENTAL REVENUE</div>
                  <div style="font-size: 2rem; font-weight: bold; color: #8e44ad;">{{ computedChargeAmount | currency:'USD' }}</div>
                </div>

                <div style="display: flex; justify-content: flex-end;">
                  <button (click)="submitBilling()" style="padding: 10px 24px; background: #8e44ad; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                    💸 Bill storage fee to A/R (1100)
                  </button>
                </div>

              </div>
              <div *ngIf="!selectedTicket" style="padding: 4rem; text-align: center; color: #95a5a6;">
                Select an approved ticket from the left column to run storage rate simulations and release billing entries.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class LogisticsComponent implements OnInit {
    private logisticsService = inject(LogisticsService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'occupancy';
    elevators: Elevator[] = [];
    tickets: WeighbridgeTicket[] = [];
    analytics?: StorageAnalytics;
    selectedTicket?: WeighbridgeTicket;

    // Form triggers
    showElevatorForm: boolean = false;
    showTicketForm: boolean = false;

    // Bindings
    newElevator = { name: '', capacityTons: 100, rentalRatePerTonPerDay: 0.5 };
    newTicket = {
        ticketNumber: '',
        elevatorId: '',
        vehicleNumber: '',
        grossWeightTons: 20,
        tareWeightTons: 5,
        moisturePercentage: 14,
        impurityPercentage: 0,
        contractClientId: '',
        ticketDate: ''
    };
    daysStored: number = 10;
    chargeDate: string = '';
    computedChargeAmount: number = 0;

    ngOnInit(): void {
        this.loadAll();
        this.chargeDate = new Date().toISOString().split('T')[0];
    }

    loadAll(): void {
        this.logisticsService.getAnalytics().subscribe(a => {
            this.analytics = a;
            this.elevators = a.elevators;
            if (a.elevators.length > 0 && !this.newTicket.elevatorId) {
                this.newTicket.elevatorId = a.elevators[0].id;
            }
            this.cdr.detectChanges();
        });

        this.logisticsService.getTickets().subscribe(t => {
            this.tickets = t;
            if (this.selectedTicket) {
                const found = t.find(x => x.id === this.selectedTicket?.id);
                if (found) this.selectedTicket = found;
            }
            this.cdr.detectChanges();
        });
    }

    submitElevator(): void {
        if (!this.newElevator.name || this.newElevator.capacityTons <= 0) return;
        this.logisticsService.createElevator(this.newElevator).subscribe(() => {
            this.newElevator = { name: '', capacityTons: 100, rentalRatePerTonPerDay: 0.5 };
            this.showElevatorForm = false;
            this.loadAll();
        });
    }

    submitTicket(): void {
        if (!this.newTicket.ticketNumber || !this.newTicket.elevatorId || !this.newTicket.vehicleNumber) return;
        this.logisticsService.createTicket(this.newTicket).subscribe(() => {
            this.newTicket = {
                ticketNumber: '',
                elevatorId: this.elevators[0]?.id || '',
                vehicleNumber: '',
                grossWeightTons: 20,
                tareWeightTons: 5,
                moisturePercentage: 14,
                impurityPercentage: 0,
                contractClientId: '',
                ticketDate: new Date().toISOString().split('T')[0]
            };
            this.showTicketForm = false;
            this.loadAll();
        });
    }

    getPendingTickets(): WeighbridgeTicket[] {
        return this.tickets.filter(t => t.status === 'Approved');
    }

    setSelectedTicket(ticket: WeighbridgeTicket): void {
        this.selectedTicket = ticket;
        this.updateChargeValue();
    }

    updateChargeValue(): void {
        if (!this.selectedTicket) return;
        const elevator = this.elevators.find(e => e.id === this.selectedTicket?.elevatorId);
        const rate = elevator?.rentalRatePerTonPerDay || 0;
        this.computedChargeAmount = this.selectedTicket.finalBillableWeightTons * this.daysStored * rate;
    }

    submitBilling(): void {
        if (!this.selectedTicket || this.daysStored < 0 || !this.chargeDate) return;
        const command = {
            weighbridgeTicketId: this.selectedTicket.id,
            daysStored: this.daysStored,
            chargeDate: this.chargeDate
        };
        this.logisticsService.calculateCharge(command).subscribe(() => {
            this.selectedTicket = undefined;
            this.loadAll();
        });
    }

    getTicketStatusColor(status: string): string {
        return status === 'Billed' ? '#8e44ad' : status === 'Approved' ? '#27ae60' : '#d35400';
    }
}
