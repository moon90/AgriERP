/* eslint-disable @angular-eslint/prefer-inject */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    private permissionsSubject = new BehaviorSubject<string[]>([]);
    public permissions$ = this.permissionsSubject.asObservable();

    constructor(private http: HttpClient) {
        // পেজ রিফ্রেশ হলে লোকাল স্টোরেজ থেকে পারমিশনগুলো রিস্টোর করা
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
                }

                // নতুন কাজ: ব্যাকএন্ড থেকে আসা পারমিশনগুলো সেভ করা
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
        localStorage.removeItem('permissions'); // এটি যুক্ত করুন
        this.permissionsSubject.next([]);
    }

    public registerUser(userData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/register-user`, userData);
    }

    public getUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/users`);
    }
}
