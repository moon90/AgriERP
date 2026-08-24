/* eslint-disable @angular-eslint/prefer-inject */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';

export interface TenantOrganization {
    id: string;
    name: string;
    subdomain?: string;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    private permissionsSubject = new BehaviorSubject<string[]>([]);
    public permissions$ = this.permissionsSubject.asObservable();

    private tenantNameSubject = new BehaviorSubject<string>(localStorage.getItem('tenant_name') || 'Green Valley Organic Estate');
    public currentTenantName$ = this.tenantNameSubject.asObservable();

    private tenantIdSubject = new BehaviorSubject<string>(localStorage.getItem('tenant_id') || '');
    public currentTenantId$ = this.tenantIdSubject.asObservable();

    constructor(private http: HttpClient) {
        const storedPermissions = localStorage.getItem('permissions');
        if (storedPermissions) {
            this.permissionsSubject.next(JSON.parse(storedPermissions));
        }
    }

    public login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('jwt_token', response.accessToken || response.token);

                if (response.tenantId) {
                    localStorage.setItem('tenant_id', response.tenantId);
                    this.tenantIdSubject.next(response.tenantId);
                }

                if (response.tenantName) {
                    localStorage.setItem('tenant_name', response.tenantName);
                    this.tenantNameSubject.next(response.tenantName);
                }

                if (response.permissions) {
                    localStorage.setItem('permissions', JSON.stringify(response.permissions));
                    this.permissionsSubject.next(response.permissions);
                }
            })
        );
    }

    public getTenants(): Observable<TenantOrganization[]> {
        return this.http.get<TenantOrganization[]>(`${this.apiUrl}/tenants`);
    }

    public switchTenant(tenantId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/switch-tenant`, { tenantId }).pipe(
            tap(response => {
                if (response.accessToken) {
                    localStorage.setItem('jwt_token', response.accessToken);
                }
                if (response.tenantId) {
                    localStorage.setItem('tenant_id', response.tenantId);
                    this.tenantIdSubject.next(response.tenantId);
                }
                if (response.tenantName) {
                    localStorage.setItem('tenant_name', response.tenantName);
                    this.tenantNameSubject.next(response.tenantName);
                }
                if (response.permissions) {
                    localStorage.setItem('permissions', JSON.stringify(response.permissions));
                    this.permissionsSubject.next(response.permissions);
                }
            })
        );
    }

    public loadPermissions(): Observable<string[]> {
        return this.http.get<{ permissions: string[] }>(`${this.apiUrl}/my-permissions`).pipe(
            map(response => response.permissions),
            tap(permissions => {
                this.permissionsSubject.next(permissions);
            })
        );
    }

    public hasPermission(requiredPermission: string): boolean {
        const currentPermissions = this.permissionsSubject.getValue();
        if (currentPermissions.includes('*') || currentPermissions.includes('Admin')) {
            return true;
        }
        return currentPermissions.includes(requiredPermission);
    }

    public logout(): void {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('tenant_id');
        localStorage.removeItem('tenant_name');
        localStorage.removeItem('permissions');
        this.permissionsSubject.next([]);
    }

    public registerUser(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register-user`, userData);
    }

    public getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }
}
