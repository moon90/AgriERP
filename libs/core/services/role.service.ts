import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../src/environments/environment';

export interface PermissionDto {
    code: string;
    name: string;
    module: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/auth/roles`;

    // ডাটাবেস থেকে সব পারমিশন আনা
    getPermissions(): Observable<PermissionDto[]> {
        return this.http.get<PermissionDto[]>(`${this.apiUrl}/permissions`);
    }

    // নতুন রোল তৈরি করা
    createRole(roleData: { name: string; description: string; permissionCodes: string[] }): Observable<any> {
        return this.http.post<any>(this.apiUrl, roleData);
    }

    // ডাটাবেস থেকে শুধু বর্তমান ট্যানেন্টের রোলগুলোর লিস্ট (Id, Name) নিয়ে আসবে
    getRoles(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}