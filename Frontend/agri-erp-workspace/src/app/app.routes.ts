import { Route } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UserListComponent } from './pages/users/user-list.component';
import { LandingPageComponent } from './pages/landing/landing-page.component';
import { SignupWizardComponent } from './pages/signup/signup-wizard.component';
import { authGuard } from '../../libs/core/guards/auth.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const appRoutes: Route[] = [
    // 1. Public Marketing & Onboarding Pages (No Layout Shell)
    {
        path: '',
        component: LandingPageComponent,
        pathMatch: 'full'
    },
    {
        path: 'signup',
        component: SignupWizardComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },

    // 2. Authenticated Enterprise Farm Management Shell (Main Layout)
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'users',
                component: UserListComponent
            },
            {
                path: 'roles',
                loadComponent: () => import('./pages/roles/roles.component').then(m => m.RolesComponent)
            },
            {
                path: 'inventory',
                loadComponent: () => import('@agri-erp-workspace/inventory').then(m => m.InventoryDashboardComponent)
            },
            {
                path: 'livestock',
                loadComponent: () => import('@agri-erp-workspace/livestock').then(m => m.AnimalListComponent)
            },
            {
                path: 'procurement',
                loadComponent: () => import('@agri-erp-workspace/inventory').then(m => m.ProcurementComponent)
            },
            {
                path: 'sales',
                loadComponent: () => import('@agri-erp-workspace/inventory').then(m => m.SalesComponent)
            },
            {
                path: 'hr',
                loadComponent: () => import('@agri-erp-workspace/hr').then(m => m.HrComponent)
            },
            {
                path: 'assets',
                loadComponent: () => import('@agri-erp-workspace/assets').then(m => m.AssetsComponent)
            },
            {
                path: 'crops',
                loadComponent: () => import('@agri-erp-workspace/crops').then(m => m.CropsComponent)
            },
            {
                path: 'logistics',
                loadComponent: () => import('@agri-erp-workspace/logistics').then(m => m.LogisticsComponent)
            },
            {
                path: 'trading',
                loadComponent: () => import('@agri-erp-workspace/trading').then(m => m.TradingComponent)
            },
            {
                path: 'land',
                loadComponent: () => import('@agri-erp-workspace/land').then(m => m.LandComponent)
            },
            {
                path: 'irrigation',
                loadComponent: () => import('@agri-erp-workspace/irrigation').then(m => m.IrrigationComponent)
            },
            {
                path: 'chemicals',
                loadComponent: () => import('@agri-erp-workspace/chemicals').then(m => m.ChemicalsComponent)
            },
            {
                path: 'agronomy',
                loadComponent: () => import('@agri-erp-workspace/agronomy').then(m => m.AgronomyComponent)
            },
            {
                path: 'weather',
                loadComponent: () => import('@agri-erp-workspace/weather').then(m => m.WeatherComponent)
            },
            {
                path: 'insurance',
                loadComponent: () => import('@agri-erp-workspace/insurance').then(m => m.InsuranceComponent)
            }
        ]
    },

    // 3. Fallback Route
    {
        path: '**',
        redirectTo: ''
    }
];