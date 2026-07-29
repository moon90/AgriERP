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
    <div class="flat-dashboard-container">
      
      <!-- Clean Header Banner -->
      <div class="header-card">
        <div class="header-left">
          <div class="status-pill">
            <span class="dot"></span> AI Copilot Online
          </div>
          <h1 class="header-title">Executive Command Dashboard</h1>
          <p class="header-desc">Agribusiness Operations, IoT Telemetry, Financial Ledger & Field Analytics</p>
        </div>
        <div class="header-right">
          <button (click)="triggerAiScan()" class="btn-flat-primary">
            ✨ Run AI Field Scan
          </button>
          <a routerLink="/crops" class="btn-flat-secondary">🗺️ Crop Map</a>
        </div>
      </div>

      <!-- Flat AI Notification Banner -->
      <div *ngIf="aiInsightActive" class="flat-alert-banner">
        <div class="alert-icon">🤖</div>
        <div class="alert-content">
          <div class="alert-title-row">
            <span class="alert-title">AI Insight: Optimal Fertigation Window</span>
            <span class="badge-confidence">98.4% Confidence</span>
          </div>
          <p class="alert-text">Satellite NDVI analysis indicates nitrogen deficiency in Sector-B. Applying 25 L/acre within 48 hours is projected to boost crop yield by <strong>+14.2 Bushels/acre</strong>.</p>
        </div>
        <button (click)="aiInsightActive = false" class="btn-close">✕</button>
      </div>

      <!-- Flat KPI Metrics Grid -->
      <div class="kpi-grid">
        
        <!-- Tile 1: Crops -->
        <div class="kpi-tile emerald-tile">
          <div class="kpi-top-row">
            <span class="tile-icon emerald-bg">🌾</span>
            <span class="flat-badge emerald-badge">↑ +12.4%</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-label">Active Crop Acreage</span>
            <div class="kpi-num-wrap">
              <span class="kpi-num">1,450.8</span>
              <span class="kpi-unit">ACRES</span>
            </div>
            <span class="kpi-footer">NDVI Index: <strong class="text-emerald">0.88 Optimal</strong></span>
          </div>
        </div>

        <!-- Tile 2: Livestock -->
        <div class="kpi-tile blue-tile">
          <div class="kpi-top-row">
            <span class="tile-icon blue-bg">🐄</span>
            <span class="flat-badge blue-badge">100% Healthy</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-label">Livestock Head</span>
            <div class="kpi-num-wrap">
              <span class="kpi-num">480</span>
              <span class="kpi-unit">HEAD</span>
            </div>
            <span class="kpi-footer">Milk Output: <strong class="text-blue">14,250 L/Wk</strong></span>
          </div>
        </div>

        <!-- Tile 3: Inventory -->
        <div class="kpi-tile amber-tile">
          <div class="kpi-top-row">
            <span class="tile-icon amber-bg">📦</span>
            <span class="flat-badge amber-badge">AVCO Valued</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-label">Stock Valuation</span>
            <div class="kpi-num-wrap">
              <span class="kpi-num">$248,500</span>
              <span class="kpi-unit">USD</span>
            </div>
            <span class="kpi-footer">Inventory: <strong class="text-amber">42 Active SKUs</strong></span>
          </div>
        </div>

        <!-- Tile 4: Margins -->
        <div class="kpi-tile purple-tile">
          <div class="kpi-top-row">
            <span class="tile-icon purple-bg">💰</span>
            <span class="flat-badge purple-badge">High ROI</span>
          </div>
          <div class="kpi-main">
            <span class="kpi-label">Net Operating Margin</span>
            <div class="kpi-num-wrap">
              <span class="kpi-num">42.8%</span>
              <span class="kpi-unit">P&L</span>
            </div>
            <span class="kpi-footer">WIP Ledger: <strong class="text-purple">$112,400</strong></span>
          </div>
        </div>

      </div>

      <!-- Quick Action Pills Bar -->
      <div class="action-bar-card">
        <span class="bar-title">⚡ Operational Shortcuts</span>
        <div class="pill-group">
          <a routerLink="/crops" class="flat-pill">✨ AI Yield Forecast</a>
          <a routerLink="/telemetry" class="flat-pill">🛰️ Satellite NDVI</a>
          <a routerLink="/chemicals" class="flat-pill">🧪 Soil Safety</a>
          <a routerLink="/finance" class="flat-pill">📈 Financial P&L</a>
          <a routerLink="/weather" class="flat-pill">❄️ Weather Risk</a>
        </div>
      </div>

      <!-- Module Stack Cards -->
      <div class="modules-stack">
        
        <div class="flat-card">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>

        <div class="flat-card">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <div class="flat-card">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>
        
        <div class="flat-card">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>

    </div>
  `,
    styles: [`
    .flat-dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
    }

    /* Header Banner */
    .header-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      flex-wrap: wrap;
      gap: 1rem;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 20px;
      color: #047857;
      font-size: 0.78rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .dot {
      width: 7px;
      height: 7px;
      background-color: #10b981;
      border-radius: 50%;
    }

    .header-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-desc {
      color: #64748b;
      font-size: 0.9rem;
      margin: 0.25rem 0 0 0;
    }

    .header-right {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn-flat-primary {
      padding: 9px 18px;
      background: #059669;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      cursor: pointer;
      transition: background 0.2s;
      &:hover { background: #047857; }
    }

    .btn-flat-secondary {
      padding: 9px 16px;
      background: #f8fafc;
      color: #334155;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      transition: background 0.2s;
      &:hover { background: #f1f5f9; color: #0f172a; }
    }

    /* Flat Alert Banner */
    .flat-alert-banner {
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      border-radius: 12px;
      padding: 1.15rem 1.4rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      position: relative;
    }

    .alert-icon { font-size: 1.5rem; }

    .alert-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 0.25rem;
    }

    .alert-title {
      font-weight: 700;
      color: #065f46;
      font-size: 0.95rem;
    }

    .badge-confidence {
      background: #d1fae5;
      color: #047857;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .alert-text {
      color: #047857;
      margin: 0;
      font-size: 0.88rem;
      line-height: 1.4;
    }

    .btn-close {
      background: none;
      border: none;
      color: #059669;
      font-size: 1.1rem;
      cursor: pointer;
      position: absolute;
      top: 0.85rem;
      right: 1rem;
    }

    /* Flat KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .kpi-tile {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      transition: border-color 0.2s, box-shadow 0.2s;

      &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); }
      &.emerald-tile { border-top: 4px solid #059669; }
      &.blue-tile { border-top: 4px solid #2563eb; }
      &.amber-tile { border-top: 4px solid #d97706; }
      &.purple-tile { border-top: 4px solid #7c3aed; }
    }

    .kpi-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
    }

    .tile-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;

      &.emerald-bg { background: #d1fae5; }
      &.blue-bg { background: #dbeafe; }
      &.amber-bg { background: #fef3c7; }
      &.purple-bg { background: #ede9fe; }
    }

    .flat-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;

      &.emerald-badge { background: #ecfdf5; color: #047857; }
      &.blue-badge { background: #eff6ff; color: #1d4ed8; }
      &.amber-badge { background: #fffbeb; color: #b45309; }
      &.purple-badge { background: #f5f3ff; color: #6d28d9; }
    }

    .kpi-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .kpi-num-wrap {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin: 0.2rem 0;
    }

    .kpi-num {
      font-size: 1.75rem;
      font-weight: 800;
      color: #0f172a;
    }

    .kpi-unit {
      font-size: 0.8rem;
      font-weight: 600;
      color: #94a3b8;
    }

    .kpi-footer {
      font-size: 0.82rem;
      color: #64748b;
    }

    .text-emerald { color: #059669; }
    .text-blue { color: #2563eb; }
    .text-amber { color: #d97706; }
    .text-purple { color: #7c3aed; }

    /* Operational Shortcuts */
    .action-bar-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.1rem 1.4rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      flex-wrap: wrap;
    }

    .bar-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #334155;
      white-space: nowrap;
    }

    .pill-group {
      display: flex;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    .flat-pill {
      padding: 6px 14px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      color: #475569;
      font-size: 0.82rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s;

      &:hover { background: #ecfdf5; border-color: #a7f3d0; color: #047857; }
    }

    /* Modules Stack */
    .modules-stack {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .flat-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
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
        alert('🤖 AI Field Scan completed! All satellite NDVI indices and herd metrics are up to date.');
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}