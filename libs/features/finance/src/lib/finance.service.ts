import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface TrialBalanceLine {
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: string;
    totalDebits: number;
    totalCredits: number;
    netBalance: number;
}

export interface IncomeStatementLine {
    accountCode: string;
    accountName: string;
    balance: number;
}

export interface IncomeStatement {
    revenues: IncomeStatementLine[];
    totalRevenue: number;
    expenses: IncomeStatementLine[];
    totalExpenses: number;
    netIncome: number;
}

export interface BalanceSheetLine {
    accountCode: string;
    accountName: string;
    balance: number;
}

export interface BalanceSheet {
    assets: BalanceSheetLine[];
    totalAssets: number;
    liabilities: BalanceSheetLine[];
    totalLiabilities: number;
    equity: BalanceSheetLine[];
    totalEquity: number;
    totalLiabilitiesAndEquity: number;
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/finance/Ledger`;

    getTrialBalance(): Observable<TrialBalanceLine[]> {
        return this.http.get<TrialBalanceLine[]>(`${this.apiUrl}/trial-balance`);
    }

    getIncomeStatement(): Observable<IncomeStatement> {
        return this.http.get<IncomeStatement>(`${this.apiUrl}/income-statement`);
    }

    getBalanceSheet(): Observable<BalanceSheet> {
        return this.http.get<BalanceSheet>(`${this.apiUrl}/balance-sheet`);
    }
}
