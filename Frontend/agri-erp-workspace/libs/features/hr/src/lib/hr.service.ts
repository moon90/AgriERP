/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HrService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/hr/employees`;

    getEmployees(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    createEmployee(command: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, command);
    }

    getTimeCards(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/timecards`);
    }

    logTimeCard(command: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/timecards`, command);
    }

    approveTimeCards(command: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/timecards/approve`, command);
    }

    getPayrollPeriods(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/payroll/periods`);
    }

    getPayslips(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/payroll/payslips`);
    }

    processPayroll(command: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/payroll/runs`, command);
    }

    payPayroll(periodId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/payroll/runs/${periodId}/pay`, {});
    }
}
