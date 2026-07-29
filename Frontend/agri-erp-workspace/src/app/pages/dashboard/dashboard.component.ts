import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AnimalListComponent } from '@agri-erp-workspace/livestock';
import { InventoryDashboardComponent } from '@agri-erp-workspace/inventory';
import { TelemetryDashboardComponent } from '@agri-erp-workspace/telemetry';
import { FinanceDashboardComponent } from '@agri-erp-workspace/finance';
import { AuthService } from '../../../../libs/core/services/auth.service';
import { HasPermissionDirective } from '../../../../libs/core/directives/has-permission.directive';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AnimalListComponent,
        InventoryDashboardComponent,
        TelemetryDashboardComponent,
        FinanceDashboardComponent,
        HasPermissionDirective
    ],
    template: `
    <div class="dashboard-container">
      
      <!-- Executive Header Banner -->
      <div class="dashboard-header glass-card mb-4">
        <div>
          <h1 class="page-title">🌾 AgriERP Executive Command Center</h1>
          <p class="page-subtitle">Real-time Agribusiness Operations, IoT Telemetry, Financial Ledger & Field Analytics</p>
        </div>
        <div class="header-actions">
          <span class="badge-pill badge-emerald">🟢 All 14 Modules Active</span>
          <a routerLink="/hr" class="btn-primary"><span>+</span> Allocate Labor</a>
        </div>
      </div>
      
      <!-- Top Metric KPI Summary Grid -->
      <div class="kpi-grid mb-4">
        <div class="glass-card kpi-card">
          <div class="kpi-icon emerald">📈</div>
          <div class="kpi-details">
            <span class="kpi-label">Active Crop Acres</span>
            <span class="kpi-value">1,450.8 <small>ACRES</small></span>
            <span class="kpi-trend positive">↑ 12.4% vs last season</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon blue">🐄</div>
          <div class="kpi-details">
            <span class="kpi-label">Total Livestock Head</span>
            <span class="kpi-value">480 <small>HEAD</small></span>
            <span class="kpi-trend positive">↑ 100% Health Score</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon amber">📦</div>
          <div class="kpi-details">
            <span class="kpi-label">Valuation Asset Stock</span>
            <span class="kpi-value">$248,500 <small>USD</small></span>
            <span class="kpi-trend positive">AVCO Valuation</span>
          </div>
        </div>

        <div class="glass-card kpi-card">
          <div class="kpi-icon purple">💰</div>
          <div class="kpi-details">
            <span class="kpi-label">Net Operating Margin</span>
            <span class="kpi-value">42.8% <small>P&L</small></span>
            <span class="kpi-trend positive">↑ High ROI</span>
          </div>
        </div>
      </div>

      <!-- Modules Layout Grid -->
      <div class="modules-stack">
        
        <!-- Corporate Financial General Ledger Module -->
        <div class="glass-card module-card">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>

        <!-- Inventory Module -->
        <div class="glass-card module-card">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <!-- Telemetry IoT & Geofencing Module -->
        <div class="glass-card module-card">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>
        
        <!-- Livestock Animals Module -->
        <div class="glass-card module-card">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 20px 24px;
    }

    .kpi-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      
      &.emerald { background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); }
      &.blue { background: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); }
      &.amber { background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); }
      &.purple { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); }
    }

    .kpi-details {
      display: flex;
      flex-direction: column;
    }

    .kpi-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .kpi-value {
      font-family: var(--font-heading);
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin: 2px 0;

      small {
        font-size: 11px;
        color: var(--text-muted);
        font-weight: 500;
      }
    }

    .kpi-trend {
      font-size: 11.5px;
      font-weight: 600;
      &.positive { color: var(--primary-emerald); }
    }

    .modules-stack {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .module-card {
      padding: 24px;
    }
  `]
})
export class DashboardComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit() {
        this.authService.loadPermissions().subscribe({
            error: (err) => console.error('Failed to load permissions', err)
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}