import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
        AnimalListComponent,
        InventoryDashboardComponent,
        TelemetryDashboardComponent,
        FinanceDashboardComponent,
        HasPermissionDirective
    ],
    template: `
    <div style="padding: 2rem; background-color: #f8fafc; min-height: 100vh;">
      
      <!-- Top header and logout btn -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #eef2f5; padding-bottom: 1rem;">
        <h2 style="font-family: Arial, sans-serif; color: #2c3e50; margin: 0; font-weight: 800;">AgriERP Master Enterprise Dashboard</h2>
        <button (click)="logout()" style="padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: background 0.2s;">
          Logout
        </button>
      </div>
      
      <!-- Modules Layout -->
      <div style="display: flex; flex-direction: column; gap: 3rem;">
        
        <!-- Inventory Module -->
        <div *hasPermission="'Inventory.View'" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); border: 1px solid #eef2f5;">
          <lib-inventory-dashboard></lib-inventory-dashboard>
        </div>

        <!-- Telemetry IoT & Geofencing Module -->
        <div *hasPermission="'Animal.View'" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); border: 1px solid #eef2f5;">
          <lib-telemetry-dashboard></lib-telemetry-dashboard>
        </div>

        <!-- Corporate Financial General Ledger Module -->
        <div *hasPermission="'Ledger.View'" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); border: 1px solid #eef2f5;">
          <lib-finance-dashboard></lib-finance-dashboard>
        </div>
        
        <!-- Livestock Animals Module -->
        <div *hasPermission="'Livestock.View'" style="background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.02); border: 1px solid #eef2f5;">
          <lib-animal-list></lib-animal-list>
        </div>
        
      </div>
    </div>
  `
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