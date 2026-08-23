import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface VaccinationSchedule {
    id: string;
    animalId: string;
    animalTag: string;
    vaccineItemId: string;
    vaccineName: string;
    scheduledDate: string;
    administeredDate?: string;
    status: 'Scheduled' | 'Completed' | 'Overdue';
}

export interface BreedingCycle {
    id: string;
    femaleAnimalId: string;
    femaleAnimalTag: string;
    maleAnimalId?: string;
    maleAnimalTag?: string;
    inseminationDate: string;
    inseminationType: string;
    status: 'Active' | 'Failed' | 'Successful';
    pregnancyCheckDate?: string;
    pregnancyResult?: string;
    expectedCalvingDate?: string;
    actualCalvingDate?: string;
}

@Injectable({ providedIn: 'root' })
export class VeterinaryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/livestock/Veterinary`;

    getVaccinations(): Observable<VaccinationSchedule[]> {
        return this.http.get<VaccinationSchedule[]>(`${this.apiUrl}/vaccinations`);
    }

    scheduleVaccination(data: { animalId: string; vaccineItemId: string; scheduledDate: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/vaccinations`, data);
    }

    completeVaccination(id: string, administeredDate: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/vaccinations/${id}/complete`, { administeredDate });
    }

    getBreedingCycles(): Observable<BreedingCycle[]> {
        return this.http.get<BreedingCycle[]>(`${this.apiUrl}/breeding-cycles`);
    }

    recordInsemination(data: { femaleAnimalId: string; maleAnimalId?: string; inseminationDate: string; inseminationType: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/breeding-cycles`, data);
    }

    recordPregnancyCheck(id: string, checkDate: string, result: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/breeding-cycles/${id}/pregnancy-check`, { checkDate, result });
    }

    recordCalving(id: string, data: { calvingDate: string; gender: string; birthWeight: number; tagNumber: string; status: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/breeding-cycles/${id}/calving`, data);
    }
}
