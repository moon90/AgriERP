import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingService, SalesContract, HedgePosition, TradingPortfolio } from './trading.service';

@Component({
    selector: 'lib-trading',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Crop Contract Sales & Futures Hedging</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Mitigate price volatility using futures contract short hedges and log forward sales agreements matching customer shipments.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Portfolio
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'contracts'" [style.border-bottom]="activeTab === 'contracts' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'contracts' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🌾 Sales Contracts
        </button>
        
        <button (click)="activeTab = 'hedges'" [style.border-bottom]="activeTab === 'hedges' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'hedges' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📈 Futures Hedging Board
        </button>
        
        <button (click)="activeTab = 'history'" [style.border-bottom]="activeTab === 'history' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'history' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🧾 Closed Hedges & PnL
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Sales Contracts -->
        <div *ngIf="activeTab === 'contracts'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showContractForm = !showContractForm" class="btn-primary">
              {{ showContractForm ? 'Close Form' : '➕ Onboard Forward Sales Contract' }}
            </button>
          </div>

          <div *ngIf="showContractForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Register Forward Sales Agreement</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Contract Number</label>
                <input type="text" [(ngModel)]="newContract.contractNumber" placeholder="e.g. S-CON-2026-CORN" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Crop Commodity</label>
                <input type="text" [(ngModel)]="newContract.cropType" placeholder="e.g. Yellow Corn #2" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Agreed Price ($/Ton)</label>
                <input type="number" [(ngModel)]="newContract.contractPricePerTon" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Total Volume (Tons)</label>
                <input type="number" [(ngModel)]="newContract.quantityTons" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitContract()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Save Contract
                </button>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let c of contracts" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--accent-amber);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                <div>
                  <strong style="color: #ffffff; font-size: 1.05rem;">{{ c.contractNumber }}</strong>
                  <span style="display: block; font-size: 0.8rem; color: var(--text-muted);">Commodity: {{ c.cropType }}</span>
                </div>
                <span class="badge-pill badge-amber">{{ c.compliancePercentage | number:'1.0-0' }}% Delivered</span>
              </div>
              
              <div style="background: rgba(15, 23, 42, 0.5); padding: 10px; border-radius: 8px; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.75rem;">
                <div>Price: <strong style="color: var(--primary-emerald);">{{ c.contractPricePerTon | currency:'USD' }}/Ton</strong></div>
                <div>Volume: <strong style="color: #ffffff;">{{ c.deliveredQuantityTons }} Tons</strong> / {{ c.quantityTons }} Tons</div>
              </div>

              <div style="background: rgba(15, 23, 42, 0.6); height: 8px; border-radius: 4px; overflow: hidden; border: 1px solid var(--border-glass);">
                <div [style.width.%]="c.compliancePercentage" style="background: var(--accent-amber); height: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Futures Hedging Board -->
        <div *ngIf="activeTab === 'hedges'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showHedgeForm = !showHedgeForm" class="btn-primary">
              {{ showHedgeForm ? 'Close Form' : '➕ Open Futures Short Hedge' }}
            </button>
          </div>

          <div *ngIf="showHedgeForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Open Futures Hedge Position</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Ticker Symbol</label>
                <input type="text" [(ngModel)]="newHedge.symbol" placeholder="e.g. ZC_FUT_DEC26" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Hedge Type</label>
                <select [(ngModel)]="newHedge.type" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="ShortHedge">Short Hedge (Sell Futures)</option>
                  <option value="LongHedge">Long Hedge (Buy Futures)</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">No. of Contracts</label>
                <input type="number" [(ngModel)]="newHedge.quantityContracts" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Entry Price ($/Ton)</label>
                <input type="number" [(ngModel)]="newHedge.entryPricePerTon" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitHedge()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Open Position
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Contracts</th>
                <th>Entry Price</th>
                <th>Current Market</th>
                <th style="text-align: right;">Unrealized PnL</th>
                <th style="text-align: center;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let h of openHedges">
                <td><strong style="color: #ffffff;">{{ h.symbol }}</strong></td>
                <td><span class="badge-pill badge-blue">{{ h.type }}</span></td>
                <td>{{ h.quantityContracts }} Contracts</td>
                <td>{{ h.entryPricePerTon | currency:'USD' }}/Ton</td>
                <td>{{ h.currentMarketPricePerTon | currency:'USD' }}/Ton</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;" [style.color]="h.pnl >= 0 ? 'var(--primary-emerald)' : 'var(--accent-rose)'">
                  {{ h.pnl | currency:'USD' }}
                </td>
                <td style="text-align: center;">
                  <button (click)="closeHedge(h.id, h.currentMarketPricePerTon)" class="badge-pill badge-amber" style="cursor: pointer; border: none;">
                    🔒 Close Position
                  </button>
                </td>
              </tr>
              <tr *ngIf="openHedges.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No active futures hedge positions open.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 3: Closed Hedges & PnL History -->
        <div *ngIf="activeTab === 'history'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Contracts</th>
                <th>Entry Price</th>
                <th>Exit Price</th>
                <th style="text-align: right;">Realized PnL ($)</th>
                <th style="text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of closedHedges">
                <td><strong style="color: #ffffff;">{{ c.symbol }}</strong></td>
                <td><span class="badge-pill badge-blue">{{ c.type }}</span></td>
                <td>{{ c.quantityContracts }} Contracts</td>
                <td>{{ c.entryPricePerTon | currency:'USD' }}</td>
                <td>{{ c.exitPricePerTon | currency:'USD' }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;" [style.color]="c.pnl >= 0 ? 'var(--primary-emerald)' : 'var(--accent-rose)'">
                  {{ c.pnl | currency:'USD' }}
                </td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Closed</span>
                </td>
              </tr>
              <tr *ngIf="closedHedges.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No closed hedge positions history recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class TradingComponent implements OnInit {
    private tradingService = inject(TradingService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'contracts';
    showContractForm = false;
    showHedgeForm = false;

    contracts: SalesContract[] = [];
    openHedges: HedgePosition[] = [];
    closedHedges: HedgePosition[] = [];

    newContract = {
        contractNumber: '',
        customerClientId: '00000000-0000-0000-0000-000000000000',
        cropType: 'Corn #2',
        contractPricePerTon: 185,
        quantityTons: 500
    };

    newHedge = {
        symbol: 'ZC_FUT_DEC26',
        type: 'ShortHedge',
        quantityContracts: 5,
        entryPricePerTon: 185
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.tradingService.getPortfolio().subscribe({
            next: (data) => {
                this.contracts = data.salesContracts || [];
                this.openHedges = data.openHedges || [];
                this.closedHedges = data.closedHedges || [];
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching trading portfolio:', err)
        });
    }

    submitContract(): void {
        if (!this.newContract.contractNumber) {
            alert('Please enter contract number.');
            return;
        }

        this.tradingService.createContract(this.newContract).subscribe({
            next: () => {
                this.showContractForm = false;
                this.newContract.contractNumber = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to save sales contract: ' + err.message)
        });
    }

    submitHedge(): void {
        if (!this.newHedge.symbol) {
            alert('Please enter ticker symbol.');
            return;
        }

        this.tradingService.openHedge(this.newHedge).subscribe({
            next: () => {
                this.showHedgeForm = false;
                this.loadAll();
            },
            error: (err) => alert('Failed to open hedge position: ' + err.message)
        });
    }

    closeHedge(positionId: string, marketPrice: number): void {
        const command = {
            hedgingPositionId: positionId,
            exitPricePerTon: marketPrice,
            closeDate: new Date().toISOString()
        };

        this.tradingService.closeHedge(command).subscribe({
            next: () => {
                this.loadAll();
                alert('Position closed and realized PnL recorded.');
            },
            error: (err) => alert('Failed to close position: ' + err.message)
        });
    }
}
