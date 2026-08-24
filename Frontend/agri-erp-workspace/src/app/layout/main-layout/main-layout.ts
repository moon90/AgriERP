import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService, TenantOrganization } from '../../../../libs/core/services/auth.service';
import { FieldSyncCenterComponent } from '../field-sync-center/field-sync-center.component';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterModule, FieldSyncCenterComponent],
    templateUrl: './main-layout.html',
    styleUrls: ['./main-layout.scss']
})
export class MainLayoutComponent implements OnInit {
    authService = inject(AuthService);
    router = inject(Router);
    cdr = inject(ChangeDetectorRef);

    showTenantDropdown = false;
    tenants: TenantOrganization[] = [
        { id: '11111111-1111-1111-1111-111111111111', name: 'Green Valley Organic Farm', subdomain: 'greenvalley', isActive: true },
        { id: '22222222-2222-2222-2222-222222222222', name: 'Sunrise Dairy & Livestock Ranch', subdomain: 'sunrisedairy', isActive: true },
        { id: '33333333-3333-3333-3333-333333333333', name: 'Highland Grain & Logistics LLC', subdomain: 'highlandgrain', isActive: true }
    ];

    ngOnInit(): void {
        this.loadTenants();
    }

    loadTenants(): void {
        this.authService.getTenants().subscribe({
            next: (data) => {
                if (data && data.length > 0) {
                    this.tenants = data;
                    this.cdr.detectChanges();
                }
            },
            error: () => {
                // Keep default demo organizations for offline testing
            }
        });
    }

    toggleTenantDropdown(): void {
        this.showTenantDropdown = !this.showTenantDropdown;
    }

    selectTenant(tenant: TenantOrganization): void {
        this.showTenantDropdown = false;
        this.authService.switchTenant(tenant.id).subscribe({
            next: () => {
                this.cdr.detectChanges();
                window.location.reload(); // Refresh active view with switched tenant partition
            },
            error: () => {
                // Fallback for mock environment
                localStorage.setItem('tenant_id', tenant.id);
                localStorage.setItem('tenant_name', tenant.name);
                window.location.reload();
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}