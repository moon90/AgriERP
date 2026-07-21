import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingService, SalesContract, HedgePosition, TradingPortfolio } from './trading.service';

@Component({
    selector: 'lib-trading',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #c0392b; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Contract Sales & Futures Hedging</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Mitigate price volatility using futures contract short hedges and log forward sales agreements matching customer shipments.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #c0392b; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'contracts'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'contracts' ? '#c0392b' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'contracts' ? '3px solid #c0392b' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🌾 Sales Contracts
        </button>
        
        <button (click)="activeTab = 'hedges'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'hedges' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'hedges' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📈 Futures Hedging Board
        </button>
        
        <button (click)="activeTab = 'history'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'history' ? '#27ae60' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'history' ? '3px solid #27ae60' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📖 Closed Settlements
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Sales Contracts -->
        <div *ngIf="activeTab === 'contracts'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; gap: 1rem;">
            <button (click)="showDeliveryForm = !showDeliveryForm; showContractForm = false" style="padding: 8px 16px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showDeliveryForm ? 'Close Delivery Form' : '🚛 Log Physical Shipment' }}
            </button>
            <button (click)="showContractForm = !showContractForm; showDeliveryForm = false" style="padding: 8px 16px; background: #c0392b; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showContractForm ? 'Close Contract Form' : '➕ Create Sales Contract' }}
            </button>
          </div>

          <!-- Add Contract Form -->
          <div *ngIf="showContractForm" style="background: #fdf2f2; border: 1px solid #f5c2c2; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #c0392b;">
            <h4 style="margin: 0 0 1.25rem 0; color: #c0392b; font-size: 1.1rem;">Configure Forward Crop Sales Contract</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Contract Number</label>
                <input type="text" [(ngModel)]="newContract.contractNumber" placeholder="e.g. CON-8812" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Customer Client</label>
                <input type="text" [(ngModel)]="newContract.customerClientId" placeholder="e.g. NESTLE-AGRI" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Crop Type</label>
                <select [(ngModel)]="newContract.cropType" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="Corn">Corn</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Soybeans">Soybeans</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Sales Price per Ton ($)</label>
                <input type="number" [(ngModel)]="newContract.contractPricePerTon" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #64748b; margin-bottom: 0.25rem;">Total Volume (Tons)</label>
                <input type="number" [(ngModel)]="newContract.quantityTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitContract()" style="padding: 10px 24px; background: #c0392b; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Save Contract
              </button>
            </div>
          </div>

          <!-- Log Shipment Form -->
          <div *ngIf="showDeliveryForm" style="background: #fff9f2; border: 1px solid #ffe6cc; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #e67e22; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #e67e22; font-size: 1.1rem;">Record physical contract delivery</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Select Sales Contract</label>
                <select [(ngModel)]="newDelivery.salesContractId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option *ngFor="let c of getActiveContracts()" [value]="c.id">{{ c.contractNumber }} ({{ c.cropType }} - Client: {{ c.customerClientId }})</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Delivered Volume (Tons)</label>
                <input type="number" [(ngModel)]="newDelivery.deliveredTons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Delivery Date</label>
                <input type="date" [(ngModel)]="newDelivery.deliveryDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitDelivery()" style="padding: 10px 24px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Post Delivery Shipment & Bill A/R
              </button>
            </div>
          </div>

          <!-- Contracts List -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let contract of contracts" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #c0392b;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">🌾 Contract: {{ contract.contractNumber }}</h4>
                <span [ngStyle]="{
                  'background-color': contract.status === 'Completed' ? '#27ae60' : '#e67e22',
                  'color': 'white',
                  'padding': '2px 6px',
                  'border-radius': '3px',
                  'font-size': '0.75rem',
                  'font-weight': 'bold'
                }">{{ contract.status }}</span>
              </div>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6; margin-bottom: 1rem;">
                <div>Client: <strong>{{ contract.customerClientId }}</strong></div>
                <div>Crop: <strong>{{ contract.cropType }}</strong></div>
                <div>Price: <strong>{{ contract.contractPricePerTon | currency:'USD' }} / Ton</strong></div>
                <div>Fulfillment: <strong>{{ contract.deliveredQuantityTons }} / {{ contract.quantityTons }} Tons</strong></div>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #7f8c8d; margin-bottom: 0.25rem;">
                <span>Delivery compliance</span>
                <span>{{ contract.compliancePercentage | number:'1.0-1' }}%</span>
              </div>
              <div style="background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden;">
                <div [style.width.%]="contract.compliancePercentage" style="background-color: #c0392b; height: 100%;"></div>
              </div>
            </div>
          </div>
          <div *ngIf="contracts.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No forward crop sales contracts registered. Create one above to initialize trading portfolio.
          </div>
        </div>

        <!-- Tab 2: Futures Hedging Board -->
        <div *ngIf="activeTab === 'hedges'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem; gap: 1rem;">
            <button (click)="showHedgeForm = !showHedgeForm; showCloseHedgeForm = false" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showHedgeForm ? 'Close Form' : '📊 Initiate Futures Hedge' }}
            </button>
            <button (click)="showCloseHedgeForm = !showCloseHedgeForm; showHedgeForm = false" style="padding: 8px 16px; background: #8e44ad; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
              {{ showCloseHedgeForm ? 'Close Trade Form' : '💸 Liquidate Hedge Position' }}
            </button>
          </div>

          <!-- Add Hedge Form -->
          <div *ngIf="showHedgeForm" style="background: #ebf5fb; border: 1px solid #a9cbe3; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #2980b9; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #2980b9; font-size: 1.1rem;">Open Commodities Futures Contract Position</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Symbol / Contract</label>
                <input type="text" [(ngModel)]="newHedge.symbol" placeholder="e.g. CORN26" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Hedge Type</label>
                <select [(ngModel)]="newHedge.type" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option value="Short">Short (Sell futures to protect crop price drop)</option>
                  <option value="Long">Long (Buy futures to protect crop price spike)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Contracts Quantity</label>
                <input type="number" [(ngModel)]="newHedge.quantityContracts" placeholder="1 contract = 136 Tons" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Entry Target Price ($/Ton)</label>
                <input type="number" [(ngModel)]="newHedge.entryPricePerTon" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitHedge()" style="padding: 10px 24px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Enter Position
              </button>
            </div>
          </div>

          <!-- Liquidate Form -->
          <div *ngIf="showCloseHedgeForm" style="background: #f5eef8; border: 1px solid #d5dbdb; padding: 1.5rem; border-radius: 10px; margin-bottom: 2rem; border-left: 5px solid #8e44ad; font-size: 0.9rem;">
            <h4 style="margin: 0 0 1.25rem 0; color: #8e44ad; font-size: 1.1rem;">Liquidate open futures position</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Select Hedge Contract</label>
                <select [(ngModel)]="newClose.hedgingPositionId" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;">
                  <option *ngFor="let h of openHedges" [value]="h.id">{{ h.symbol }} (Type: {{ h.type }} | Entry: {{ h.entryPricePerTon | currency:'USD' }}/t)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Exit Settlement Price ($/Ton)</label>
                <input type="number" [(ngModel)]="newClose.exitPricePerTon" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: #64748b; margin-bottom: 0.25rem;">Close Date</label>
                <input type="date" [(ngModel)]="newClose.closeDate" style="width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px;" />
              </div>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
              <button (click)="submitCloseHedge()" style="padding: 10px 24px; background: #8e44ad; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                Liquidate Position & Post realized P&L
              </button>
            </div>
          </div>

          <!-- Open Hedges Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
            <div *ngFor="let hedge of openHedges" style="background: #ffffff; border: 1px solid #eef2f5; border-radius: 10px; padding: 1.25rem; box-shadow: 0 2px 8px rgba(0,0,0,0.02); border-top: 4px solid #2980b9;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; color: #2c3e50; font-size: 1.1rem; font-weight: 700;">📊 Symbol: {{ hedge.symbol }}</h4>
                <span [ngStyle]="{
                  'background-color': hedge.type === 'Short' ? '#e74c3c' : '#2ecc71',
                  'color': 'white',
                  'padding': '2px 6px',
                  'border-radius': '3px',
                  'font-size': '0.75rem',
                  'font-weight': 'bold'
                }">{{ hedge.type }}</span>
              </div>
              <div style="font-size: 0.85rem; color: #34495e; line-height: 1.6; margin-bottom: 1rem;">
                <div>Contracts Quantity: <strong>{{ hedge.quantityContracts }}</strong> ({{ hedge.quantityContracts * 136 }} Tons)</div>
                <div>Entry price: <strong>{{ hedge.entryPricePerTon | currency:'USD' }} / Ton</strong></div>
                <div>Last trade price: <strong>{{ hedge.currentMarketPricePerTon | currency:'USD' }} / Ton</strong></div>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eef2f5; padding-top: 0.75rem;">
                <span style="font-size: 0.85rem; color: #7f8c8d;">Unrealized P&L</span>
                <strong [style.color]="hedge.pnl >= 0 ? '#27ae60' : '#c0392b'" style="font-size: 1.1rem;">
                  {{ hedge.pnl >= 0 ? '+' : '' }}{{ hedge.pnl | currency:'USD' }}
                </strong>
              </div>
            </div>
          </div>
          <div *ngIf="openHedges.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No active commodity futures positions. Open a hedge contract to start tracking portfolio exposures.
          </div>
        </div>

        <!-- Tab 3: Closed Settlements -->
        <div *ngIf="activeTab === 'history'">
          <div style="background: #ebf5fb; border: 1px solid #a9cbe3; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.9rem; color: #34495e; font-weight: bold;">TOTAL REALIZED HEDGING PROFIT / LOSS</span>
            <strong [style.color]="totalRealizedPnl >= 0 ? '#27ae60' : '#c0392b'" style="font-size: 1.75rem;">
              {{ totalRealizedPnl >= 0 ? '+' : '' }}{{ totalRealizedPnl | currency:'USD' }}
            </strong>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                <th style="padding: 8px;">Symbol</th>
                <th style="padding: 8px;">Type</th>
                <th style="padding: 8px; text-align: right;">Contracts</th>
                <th style="padding: 8px; text-align: right;">Entry Price</th>
                <th style="padding: 8px; text-align: right;">Exit Price</th>
                <th style="padding: 8px; text-align: right;">Realized P&L</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let hedge of closedHedges" style="border-bottom: 1px solid #eef2f5;">
                <td style="padding: 8px; font-weight: bold; font-family: monospace;">{{ hedge.symbol }}</td>
                <td style="padding: 8px;">{{ hedge.type }}</td>
                <td style="padding: 8px; text-align: right;">{{ hedge.quantityContracts }}</td>
                <td style="padding: 8px; text-align: right;">{{ hedge.entryPricePerTon | currency:'USD' }}/t</td>
                <td style="padding: 8px; text-align: right;">{{ hedge.exitPricePerTon | currency:'USD' }}/t</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;" [style.color]="hedge.pnl >= 0 ? '#27ae60' : '#c0392b'">
                  {{ hedge.pnl >= 0 ? '+' : '' }}{{ hedge.pnl | currency:'USD' }}
                </td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="closedHedges.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
            No closed futures hedge settlements recorded.
          </div>
        </div>

      </div>

    </div>
  `,
    styles: []
})
export class TradingComponent implements OnInit {
    private tradingService = inject(TradingService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'contracts';
    contracts: SalesContract[] = [];
    openHedges: HedgePosition[] = [];
    closedHedges: HedgePosition[] = [];
    totalRealizedPnl: number = 0;

    // Form triggers
    showContractForm: boolean = false;
    showDeliveryForm: boolean = false;
    showHedgeForm: boolean = false;
    showCloseHedgeForm: boolean = false;

    // Bindings
    newContract = {
        contractNumber: '',
        customerClientId: '',
        cropType: 'Corn',
        contractPricePerTon: 220,
        quantityTons: 100
    };
    newDelivery = {
        salesContractId: '',
        deliveredTons: 20,
        deliveryDate: ''
    };
    newHedge = {
        symbol: '',
        type: 'Short',
        quantityContracts: 2,
        entryPricePerTon: 210
    };
    newClose = {
        hedgingPositionId: '',
        exitPricePerTon: 190,
        closeDate: ''
    };

    ngOnInit(): void {
        this.loadAll();
        this.newDelivery.deliveryDate = new Date().toISOString().split('T')[0];
        this.newClose.closeDate = new Date().toISOString().split('T')[0];
    }

    loadAll(): void {
        this.tradingService.getPortfolio().subscribe(p => {
            this.contracts = p.salesContracts;
            this.openHedges = p.openHedges;
            this.closedHedges = p.closedHedges;
            this.totalRealizedPnl = p.totalRealizedPnl;

            if (p.salesContracts.length > 0 && !this.newDelivery.salesContractId) {
                this.newDelivery.salesContractId = p.salesContracts[0].id;
            }

            if (p.openHedges.length > 0 && !this.newClose.hedgingPositionId) {
                this.newClose.hedgingPositionId = p.openHedges[0].id;
            }

            this.cdr.detectChanges();
        });
    }

    submitContract(): void {
        if (!this.newContract.contractNumber || !this.newContract.customerClientId || this.newContract.quantityTons <= 0) return;
        this.tradingService.createContract(this.newContract).subscribe(() => {
            this.newContract = {
                contractNumber: '',
                customerClientId: '',
                cropType: 'Corn',
                contractPricePerTon: 220,
                quantityTons: 100
            };
            this.showContractForm = false;
            this.loadAll();
        });
    }

    getActiveContracts(): SalesContract[] {
        return this.contracts.filter(c => c.status === 'Active');
    }

    submitDelivery(): void {
        if (!this.newDelivery.salesContractId || this.newDelivery.deliveredTons <= 0) return;
        this.tradingService.deliverContract(this.newDelivery).subscribe(() => {
            this.newDelivery = {
                salesContractId: this.contracts[0]?.id || '',
                deliveredTons: 20,
                deliveryDate: new Date().toISOString().split('T')[0]
            };
            this.showDeliveryForm = false;
            this.loadAll();
        });
    }

    submitHedge(): void {
        if (!this.newHedge.symbol || this.newHedge.quantityContracts <= 0) return;
        this.tradingService.openHedge(this.newHedge).subscribe(() => {
            this.newHedge = {
                symbol: '',
                type: 'Short',
                quantityContracts: 2,
                entryPricePerTon: 210
            };
            this.showHedgeForm = false;
            this.loadAll();
        });
    }

    submitCloseHedge(): void {
        if (!this.newClose.hedgingPositionId || this.newClose.exitPricePerTon <= 0) return;
        this.tradingService.closeHedge(this.newClose).subscribe(() => {
            this.newClose = {
                hedgingPositionId: this.openHedges[0]?.id || '',
                exitPricePerTon: 190,
                closeDate: new Date().toISOString().split('T')[0]
            };
            this.showCloseHedgeForm = false;
            this.loadAll();
        });
    }
}
