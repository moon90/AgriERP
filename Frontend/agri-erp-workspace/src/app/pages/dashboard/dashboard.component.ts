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
    <div class="ai-dashboard-wrapper">
      
      <!-- AI Executive Header Banner -->
      <div class="glass-hero-card mb-4">
        <div class="hero-content">
          <div class="ai-badge">
            <span class="ai-pulse"></span>
            🤖 AgriCopilot Neural AI v4.2 Active
          </div>
          <h1 class="hero-title">🌾 Executive AI Operations Command Center</h1>
          <p class="hero-subtitle">Real-Time Autonomous Agribusiness Intelligence, Satellite Telemetry, Financial Ledger & Biological Asset Analytics</p>
        </div>
        <div class="hero-actions">
          <button (click)="triggerAiScan()" class="btn-ai-glow">
            <span>✨ Run AI Field Scan</span>
          </button>
          <a routerLink="/crops" class="btn-glass">🗺️ View Crop Map</a>
        </div>
      </div>

      <!-- Live AI Insights Alert Banner -->
      <div *ngIf="aiInsightActive" class="ai-alert-card mb-4">
        <div class="ai-alert-icon">🤖</div>
        <div class="ai-alert-body">
          <div class="ai-alert-header">
            <strong>AI Operational Recommendation: Optimal Nitrogen Fertigation Window Detected</strong>
            <span class="confidence-tag">98.4% AI Confidence</span>
          </div>
          <p>Satellite NDVI spectral analysis detects nitrogen depletion in Sector-B Upper Slope. Applying 25 L/acre within 48h will boost expected corn yield by <strong>+14.2 Bushels/acre</strong>.</p>
        </div>
        <button (click)="aiInsightActive = false" class="alert-close-btn">✕</button>
      </div>

      <!-- Top KPI Metrics Grid -->
      <div class="kpi-grid mb-4">
        
        <div class="kpi-glass-card emerald-glow">
          <div class="kpi-top">
            <span class="kpi-icon-wrap emerald">🌾</span>
            <span class="kpi-chip positive">↑ +12.4% YoY</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-title">Active Crop Acreage</span>
            <span class="kpi-number">1,450.8 <small>ACRES</small></span>
            <span class="kpi-sub">NDVI Health Index: <strong>0.88 (Optimal)</strong></span>
          </div>
        </div>

        <div class="kpi-glass-card blue-glow">
          <div class="kpi-top">
            <span class="kpi-icon-wrap blue">🐄</span>
            <span class="kpi-chip positive">100% Verified</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-title">Biological Livestock Assets</span>
            <span class="kpi-number">480 <small>HEAD</small></span>
            <span class="kpi-sub">Milk Yield: <strong>14,250 L/Week</strong></span>
          </div>
        </div>

        <div class="kpi-glass-card amber-glow">
          <div class="kpi-top">
            <span class="kpi-icon-wrap amber">📦</span>
            <span class="kpi-chip neutral">AVCO Valued</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-title">Warehouse Stock Valuation</span>
            <span class="kpi-number">$248,500 <small>USD</small></span>
            <span class="kpi-sub">Active Stock Batches: <strong>42 SKUs</strong></span>
          </div>
        </div>

        <div class="kpi-glass-card purple-glow">
          <div class="kpi-top">
            <span class="kpi-icon-wrap purple">💰</span>
            <span class="kpi-chip positive">↑ High Margin</span>
          </div>
          <div class="kpi-body">
            <span class="kpi-title">Net Operating Margin</span>
            <span class="kpi-number">42.8% <small>P&L</small></span>
            <span class="kpi-sub">WIP Capitalized: <strong>$112,400</strong></span>
          </div>
        </div>

      </div>

      <!-- Quick AI Actions Toolbar -->
      <div class="glass-card toolbar-card mb-4">
        <h4 class="toolbar-title">⚡ Autonomous Agribusiness AI Shortcuts</h4>
        <div class="toolbar-buttons">
          <a routerLink="/crops" class="ai-tool-btn">✨ AI Yield Forecast</a>
          <a routerLink="/telemetry" class="ai-tool-btn">🛰️ Satellite NDVI Scan</a>
          <a routerLink="/chemicals" class="ai-tool-btn">🧪 Soil PHI Safety Advisor</a>
          <a routerLink="/finance" class="ai-tool-btn">📈 Automated P&L Forecast</a>
          <a routerLink="/weather" class="ai-tool-btn">❄️ Frost Alert Intelligence</a>
        </div>
      </div>

      <!-- Module Dashboards Stack -->
      <div class="modules-stack">
        
        <!-- Corporate Finance General Ledger -->
        <div class="glass-card module-card">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>

        <!-- Inventory Stock Batches & Procurement -->
        <div class="glass-card module-card">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <!-- Telemetry IoT Geofencing -->
        <div class="glass-card module-card">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>
        
        <!-- Livestock Herd Management -->
        <div class="glass-card module-card">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>

    </div>
  `,
    styles: [`
    .ai-dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .glass-hero-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 16px;
      padding: 1.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      border-radius: 20px;
      color: #34d399;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      margin-bottom: 0.75rem;
    }

    .ai-pulse {
      width: 8px;
      height: 8px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.8s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .hero-title {
      color: #ffffff;
      font-size: 1.75rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      color: #94a3b8;
      margin: 0.4rem 0 0 0;
      font-size: 0.95rem;
      max-width: 680px;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-ai-glow {
      padding: 12px 22px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
      transition: all 0.25s ease;
      &:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6); }
    }

    .btn-glass {
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s;
      &:hover { background: rgba(255, 255, 255, 0.15); color: #ffffff; }
    }

    .ai-alert-card {
      background: linear-gradient(135deg, rgba(6, 78, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(52, 211, 153, 0.5);
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      position: relative;
    }

    .ai-alert-icon {
      font-size: 2rem;
      background: rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 10px;
    }

    .ai-alert-header {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #6ee7b7;
      font-size: 1rem;
      margin-bottom: 0.35rem;
    }

    .confidence-tag {
      background: rgba(16, 185, 129, 0.25);
      color: #a7f3d0;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .ai-alert-body p {
      color: #cbd5e1;
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .alert-close-btn {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 1.25rem;
      cursor: pointer;
      position: absolute;
      top: 1rem;
      right: 1rem;
      &:hover { color: #ffffff; }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .kpi-glass-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover { transform: translateY(-4px); border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4); }
      &.emerald-glow { border-left: 4px solid #10b981; }
      &.blue-glow { border-left: 4px solid #3b82f6; }
      &.amber-glow { border-left: 4px solid #f59e0b; }
      &.purple-glow { border-left: 4px solid #8b5cf6; }
    }

    .kpi-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .kpi-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;

      &.emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
      &.blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); }
      &.amber { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }
      &.purple { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); }
    }

    .kpi-chip {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;

      &.positive { background: rgba(16, 185, 129, 0.18); color: #34d399; }
      &.neutral { background: rgba(245, 158, 11, 0.18); color: #fbbf24; }
    }

    .kpi-title {
      font-size: 0.82rem;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-number {
      font-size: 1.85rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0.3rem 0;

      small { font-size: 0.85rem; color: #64748b; font-weight: 600; }
    }

    .kpi-sub {
      font-size: 0.83rem;
      color: #cbd5e1;
      strong { color: #a7f3d0; }
    }

    .toolbar-card {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
    }

    .toolbar-title {
      color: #e2e8f0;
      font-size: 0.95rem;
      font-weight: 700;
      margin: 0 0 1rem 0;
      letter-spacing: 0.02em;
    }

    .toolbar-buttons {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .ai-tool-btn {
      padding: 9px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #cbd5e1;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;

      &:hover { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); color: #a7f3d0; transform: translateY(-1px); }
    }

    .modules-stack {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .module-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.85) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
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
        alert('🤖 AgriCopilot AI Scan triggered! Scanning satellite spectral data, weather telemetry & biological herd metrics...');
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}