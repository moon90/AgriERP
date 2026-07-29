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
    <div class="dashboard-shell-wrapper">
      
      <!-- Layout-Matched Header Banner -->
      <div class="glass-card layout-header-banner mb-4">
        <div class="header-left-group">
          <div class="badge-pill badge-emerald">
            <span class="pulse-dot"></span> AgriCopilot AI Core Active
          </div>
          <h1 class="page-title">🌾 Executive Agribusiness Command Dashboard</h1>
          <p class="page-subtitle">Autonomous Crop Analytics, IoT Sensor Telemetry, Livestock Herd & Corporate P&L Ledger</p>
        </div>
        <div class="header-right-group">
          <button (click)="triggerAiScan()" class="btn-primary">
            ✨ Run AI Field Scan
          </button>
          <a routerLink="/crops" class="btn-secondary">🗺️ Interactive Field Map</a>
        </div>
      </div>

      <!-- Layout-Matched AI Notification Alert -->
      <div *ngIf="aiInsightActive" class="glass-card ai-alert-card mb-4">
        <div class="alert-icon-avatar">🤖</div>
        <div class="alert-info">
          <div class="alert-title-bar">
            <span class="alert-title">AI Recommendation: Optimal Fertigation Window</span>
            <span class="badge-pill badge-emerald">98.4% Confidence</span>
          </div>
          <p class="alert-desc">Satellite NDVI spectral analysis indicates nitrogen deficiency in Sector-B. Applying 25 L/acre within 48 hours is projected to boost corn yield by <strong>+14.2 Bushels/acre</strong>.</p>
        </div>
        <button (click)="aiInsightActive = false" class="alert-close">✕</button>
      </div>

      <!-- Layout-Matched 4-Color Flat KPI Grid -->
      <div class="kpi-grid mb-4">
        
        <!-- Tile 1: Crops (Emerald Green) -->
        <div class="glass-card kpi-tile emerald-accent">
          <div class="kpi-head">
            <span class="kpi-avatar emerald-bg">🌾</span>
            <span class="badge-pill badge-emerald">↑ +12.4% YoY</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Active Crop Acreage</span>
            <div class="kpi-val-row">
              <span class="kpi-val">1,450.8</span>
              <span class="kpi-unit">ACRES</span>
            </div>
            <span class="kpi-subtext">NDVI Health: <strong class="text-emerald">0.88 Optimal</strong></span>
          </div>
        </div>

        <!-- Tile 2: Livestock (Azure Blue) -->
        <div class="glass-card kpi-tile blue-accent">
          <div class="kpi-head">
            <span class="kpi-avatar blue-bg">🐄</span>
            <span class="badge-pill badge-blue">100% Healthy</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Biological Herd Head</span>
            <div class="kpi-val-row">
              <span class="kpi-val">480</span>
              <span class="kpi-unit">HEAD</span>
            </div>
            <span class="kpi-subtext">Milk Yield: <strong class="text-blue">14,250 L/Wk</strong></span>
          </div>
        </div>

        <!-- Tile 3: Inventory (Amber Gold) -->
        <div class="glass-card kpi-tile amber-accent">
          <div class="kpi-head">
            <span class="kpi-avatar amber-bg">📦</span>
            <span class="badge-pill badge-amber">AVCO Valued</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Stock Valuation</span>
            <div class="kpi-val-row">
              <span class="kpi-val">$248,500</span>
              <span class="kpi-unit">USD</span>
            </div>
            <span class="kpi-subtext">Active Stock: <strong class="text-amber">42 SKUs</strong></span>
          </div>
        </div>

        <!-- Tile 4: Operating Margins (Royal Purple) -->
        <div class="glass-card kpi-tile purple-accent">
          <div class="kpi-head">
            <span class="kpi-avatar purple-bg">💰</span>
            <span class="badge-pill badge-purple">High ROI</span>
          </div>
          <div class="kpi-content">
            <span class="kpi-label">Net Operating Margin</span>
            <div class="kpi-val-row">
              <span class="kpi-val">42.8%</span>
              <span class="kpi-unit">P&L</span>
            </div>
            <span class="kpi-subtext">WIP Ledger: <strong class="text-purple">$112,400</strong></span>
          </div>
        </div>

      </div>

      <!-- Layout-Matched Shortcuts Bar -->
      <div class="glass-card shortcuts-bar mb-4">
        <span class="shortcuts-label">⚡ Operational Shortcuts</span>
        <div class="pill-list">
          <a routerLink="/crops" class="nav-shortcut-pill">✨ AI Yield Forecast</a>
          <a routerLink="/telemetry" class="nav-shortcut-pill">🛰️ Satellite NDVI Scan</a>
          <a routerLink="/chemicals" class="nav-shortcut-pill">🧪 Soil PHI Safety Advisor</a>
          <a routerLink="/finance" class="nav-shortcut-pill">📈 Financial P&L Ledger</a>
          <a routerLink="/weather" class="nav-shortcut-pill">❄️ Frost Alert Intelligence</a>
        </div>
      </div>

      <!-- Module Stack Layout -->
      <div class="modules-stack">
        
        <div class="glass-card module-card-wrapper">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>

        <div class="glass-card module-card-wrapper">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <div class="glass-card module-card-wrapper">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>
        
        <div class="glass-card module-card-wrapper">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>

    </div>
  `,
    styles: [`
    .dashboard-shell-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      font-family: var(--font-sans);
      color: var(--text-main);
    }

    .layout-header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.75rem 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-left-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .pulse-dot {
      width: 7px;
      height: 7px;
      background-color: var(--primary-emerald);
      border-radius: 50%;
      box-shadow: 0 0 8px var(--primary-emerald);
      display: inline-block;
    }

    .header-right-group {
      display: flex;
      gap: 0.85rem;
      align-items: center;
    }

    .ai-alert-card {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      padding: 1.25rem 1.6rem;
      border-left: 4px solid var(--primary-emerald);
      position: relative;
    }

    .alert-icon-avatar {
      font-size: 1.75rem;
      background: rgba(16, 185, 129, 0.15);
      border-radius: 12px;
      padding: 10px;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .alert-title-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 0.3rem;
    }

    .alert-title {
      font-weight: 700;
      color: #ffffff;
      font-size: 1rem;
    }

    .alert-desc {
      color: var(--text-muted);
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.45;

      strong { color: var(--primary-emerald); }
    }

    .alert-close {
      background: none;
      border: none;
      color: var(--text-muted);
      font-size: 1.1rem;
      cursor: pointer;
      position: absolute;
      top: 1rem;
      right: 1.25rem;
      &:hover { color: #ffffff; }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .kpi-tile {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.4rem;

      &.emerald-accent { border-top: 3px solid var(--primary-emerald); }
      &.blue-accent { border-top: 3px solid var(--accent-blue); }
      &.amber-accent { border-top: 3px solid var(--accent-amber); }
      &.purple-accent { border-top: 3px solid var(--accent-purple); }
    }

    .kpi-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .kpi-avatar {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;

      &.emerald-bg { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
      &.blue-bg { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); }
      &.amber-bg { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }
      &.purple-bg { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); }
    }

    .kpi-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-val-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
      margin: 0.25rem 0;
    }

    .kpi-val {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 700;
      color: #ffffff;
    }

    .kpi-unit {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
    }

    .kpi-subtext {
      font-size: 0.83rem;
      color: var(--text-muted);
    }

    .text-emerald { color: var(--primary-emerald); }
    .text-blue { color: var(--accent-blue); }
    .text-amber { color: var(--accent-amber); }
    .text-purple { color: var(--accent-purple); }

    .shortcuts-bar {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.1rem 1.6rem;
      flex-wrap: wrap;
    }

    .shortcuts-label {
      font-size: 0.88rem;
      font-weight: 700;
      color: #ffffff;
      white-space: nowrap;
    }

    .pill-list {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .nav-shortcut-pill {
      padding: 7px 16px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid var(--border-glass);
      border-radius: 20px;
      color: var(--text-muted);
      font-size: 0.84rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(16, 185, 129, 0.18);
        border-color: rgba(16, 185, 129, 0.4);
        color: var(--primary-emerald);
        transform: translateY(-1px);
      }
    }

    .modules-stack {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .module-card-wrapper {
      padding: 1.5rem;
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
        alert('🌾 AgriCopilot AI Scan triggered! Satellite spectral data, weather telemetry & biological herd metrics refreshed.');
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}