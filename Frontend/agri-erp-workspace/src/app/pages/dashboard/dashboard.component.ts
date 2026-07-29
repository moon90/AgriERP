import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnimalListComponent } from '@agri-erp-workspace/livestock';
import { InventoryDashboardComponent } from '@agri-erp-workspace/inventory';
import { TelemetryDashboardComponent } from '@agri-erp-workspace/telemetry';
import { FinanceDashboardComponent } from '@agri-erp-workspace/finance';
import { AuthService } from '../../../../libs/core/services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AnimalListComponent,
        InventoryDashboardComponent,
        TelemetryDashboardComponent,
        FinanceDashboardComponent
    ],
    template: `
    <div class="greener-dashboard-wrapper">
      
      <!-- Greener Clean Header Banner -->
      <div class="greener-header-card">
        <div class="header-left">
          <div class="green-status-pill">
            <span class="green-dot"></span> AgriCopilot AI Engine Active
          </div>
          <h1 class="greener-title">🌾 Executive Agribusiness Command Dashboard</h1>
          <p class="greener-sub">Autonomous Agriculture Analytics, IoT Sensor Telemetry, Livestock Herd & P&L Ledger</p>
        </div>
        <div class="header-right">
          <button (click)="triggerAiScan()" class="btn-greener-primary">
            ✨ Run AI Field Scan
          </button>
          <a routerLink="/crops" class="btn-greener-secondary">🗺️ Interactive Field Map</a>
        </div>
      </div>

      <!-- Botanical Greener AI Alert Banner -->
      <div *ngIf="aiInsightActive" class="greener-alert-banner">
        <div class="alert-icon-box">🤖</div>
        <div class="alert-content-box">
          <div class="alert-headline">
            <span class="headline-text">AI Recommendation: Optimal Nitrogen Fertigation Window</span>
            <span class="confidence-pill">98.4% AI Match</span>
          </div>
          <p class="headline-sub">Satellite NDVI spectral scanning indicates nitrogen depletion in Sector-B Upper Slope. Applying 25 L/acre within 48h increases expected corn yield by <strong>+14.2 Bushels/acre</strong>.</p>
        </div>
        <button (click)="aiInsightActive = false" class="alert-close">✕</button>
      </div>

      <!-- Greener Flat KPI Grid -->
      <div class="kpi-grid">
        
        <!-- Tile 1: Crops (Emerald Green) -->
        <div class="greener-kpi-card emerald-theme">
          <div class="card-header-row">
            <span class="icon-avatar emerald-avatar">🌾</span>
            <span class="green-tag emerald-tag">↑ +12.4% YoY</span>
          </div>
          <div class="card-body">
            <span class="card-label">Active Crop Acreage</span>
            <div class="value-row">
              <span class="card-value">1,450.8</span>
              <span class="card-unit">ACRES</span>
            </div>
            <span class="card-footer">NDVI Health: <strong class="c-emerald">0.88 Optimal</strong></span>
          </div>
        </div>

        <!-- Tile 2: Livestock (Teal Mint Green) -->
        <div class="greener-kpi-card mint-theme">
          <div class="card-header-row">
            <span class="icon-avatar mint-avatar">🐄</span>
            <span class="green-tag mint-tag">100% Healthy</span>
          </div>
          <div class="card-body">
            <span class="card-label">Biological Herd Head</span>
            <div class="value-row">
              <span class="card-value">480</span>
              <span class="card-unit">HEAD</span>
            </div>
            <span class="card-footer">Milk Production: <strong class="c-mint">14,250 L/Wk</strong></span>
          </div>
        </div>

        <!-- Tile 3: Inventory (Olive Lime Green) -->
        <div class="greener-kpi-card lime-theme">
          <div class="card-header-row">
            <span class="icon-avatar lime-avatar">📦</span>
            <span class="green-tag lime-tag">AVCO Valued</span>
          </div>
          <div class="card-body">
            <span class="card-label">Warehouse Stock Valuation</span>
            <div class="value-row">
              <span class="card-value">$248,500</span>
              <span class="card-unit">USD</span>
            </div>
            <span class="card-footer">Warehouse Batches: <strong class="c-lime">42 SKUs</strong></span>
          </div>
        </div>

        <!-- Tile 4: Operating Margins (Forest Eco Green) -->
        <div class="greener-kpi-card forest-theme">
          <div class="card-header-row">
            <span class="icon-avatar forest-avatar">💰</span>
            <span class="green-tag forest-tag">High ROI</span>
          </div>
          <div class="card-body">
            <span class="card-label">Net Operating Margin</span>
            <div class="value-row">
              <span class="card-value">42.8%</span>
              <span class="card-unit">P&L</span>
            </div>
            <span class="card-footer">WIP Capitalized: <strong class="c-forest">$112,400</strong></span>
          </div>
        </div>

      </div>

      <!-- Greener Operational Shortcuts Bar -->
      <div class="shortcuts-card">
        <span class="shortcuts-title">⚡ Botanical AI Operational Shortcuts</span>
        <div class="shortcuts-group">
          <a routerLink="/crops" class="green-pill">✨ AI Yield Forecast</a>
          <a routerLink="/telemetry" class="green-pill">🛰️ Satellite NDVI Scan</a>
          <a routerLink="/chemicals" class="green-pill">🧪 Soil PHI Safety Advisor</a>
          <a routerLink="/finance" class="green-pill">📈 Financial P&L Ledger</a>
          <a routerLink="/weather" class="green-pill">❄️ Frost Alert Intelligence</a>
        </div>
      </div>

      <!-- Module Stack Cards -->
      <div class="modules-stack">
        
        <div class="greener-module-card">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>

        <div class="greener-module-card">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <div class="greener-module-card">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>
        
        <div class="greener-module-card">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>

    </div>
  `,
    styles: [`
    .greener-dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #064e3b;
      background-color: #f0fdf4;
      padding: 0.5rem;
      border-radius: 16px;
    }

    /* Header Banner */
    .greener-header-card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 1.6rem 1.8rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.06);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .green-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: #d1fae5;
      border: 1px solid #6ee7b7;
      border-radius: 20px;
      color: #047857;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .green-dot {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .greener-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: #064e3b;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .greener-sub {
      color: #047857;
      font-size: 0.92rem;
      margin: 0.3rem 0 0 0;
    }

    .header-right {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn-greener-primary {
      padding: 10px 20px;
      background: #059669;
      color: #ffffff;
      border: none;
      border-radius: 9px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25);
      transition: all 0.2s ease;
      &:hover { background: #047857; transform: translateY(-1px); }
    }

    .btn-greener-secondary {
      padding: 10px 18px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      border-radius: 9px;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      &:hover { background: #d1fae5; color: #064e3b; }
    }

    /* Botanical Greener Alert */
    .greener-alert-banner {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border: 1px solid #6ee7b7;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1.15rem;
      position: relative;
      box-shadow: 0 2px 10px rgba(5, 150, 105, 0.08);
    }

    .alert-icon-box { font-size: 1.6rem; }

    .alert-headline {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 0.3rem;
    }

    .headline-text {
      font-weight: 800;
      color: #064e3b;
      font-size: 0.98rem;
    }

    .confidence-pill {
      background: #059669;
      color: #ffffff;
      padding: 2px 9px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .headline-sub {
      color: #047857;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .alert-close {
      background: none;
      border: none;
      color: #047857;
      font-size: 1.2rem;
      cursor: pointer;
      position: absolute;
      top: 0.9rem;
      right: 1.1rem;
    }

    /* Flat Greener KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .greener-kpi-card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.05);
      transition: all 0.25s ease;

      &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(5, 150, 105, 0.12); }
      &.emerald-theme { border-top: 4px solid #059669; }
      &.mint-theme { border-top: 4px solid #0d9488; }
      &.lime-theme { border-top: 4px solid #65a30d; }
      &.forest-theme { border-top: 4px solid #16a34a; }
    }

    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.9rem;
    }

    .icon-avatar {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;

      &.emerald-avatar { background: #d1fae5; border: 1px solid #a7f3d0; }
      &.mint-avatar { background: #ccfbf1; border: 1px solid #99f6e4; }
      &.lime-avatar { background: #ecfccb; border: 1px solid #d9f99d; }
      &.forest-avatar { background: #dcfce7; border: 1px solid #bbf7d0; }
    }

    .green-tag {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 9px;
      border-radius: 8px;

      &.emerald-tag { background: #ecfdf5; color: #047857; }
      &.mint-tag { background: #f0fdfa; color: #0f766e; }
      &.lime-tag { background: #f7fee7; color: #4d7c0f; }
      &.forest-tag { background: #f0fdf4; color: #15803d; }
    }

    .card-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .value-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin: 0.25rem 0;
    }

    .card-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #064e3b;
    }

    .card-unit {
      font-size: 0.82rem;
      font-weight: 700;
      color: #059669;
    }

    .card-footer {
      font-size: 0.84rem;
      color: #047857;
    }

    .c-emerald { color: #059669; }
    .c-mint { color: #0d9488; }
    .c-lime { color: #65a30d; }
    .c-forest { color: #16a34a; }

    /* Operational Shortcuts */
    .shortcuts-card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 1.2rem 1.6rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.05);
      flex-wrap: wrap;
    }

    .shortcuts-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: #064e3b;
      white-space: nowrap;
    }

    .shortcuts-group {
      display: flex;
      gap: 0.7rem;
      flex-wrap: wrap;
    }

    .green-pill {
      padding: 7px 15px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 20px;
      color: #047857;
      font-size: 0.84rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover { background: #059669; color: #ffffff; border-color: #059669; transform: translateY(-1px); }
    }

    /* Modules Stack */
    .modules-stack {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .greener-module-card {
      background: #ffffff;
      border: 1px solid #bbf7d0;
      border-radius: 14px;
      padding: 1.6rem;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.05);
    }
  `]
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    aiInsightActive: boolean = true;

    ngOnInit() {
        this.authService.loadPermissions().subscribe({
            error: (err) => console.error('Failed to load permissions', err)
        });
    }

    triggerAiScan() {
        alert('🌾 Botanical AI Field Scan completed! Satellite NDVI greenness index and crop health scores updated successfully.');
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}