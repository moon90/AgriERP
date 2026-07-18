/* eslint-disable @nx/enforce-module-boundaries */
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Animal } from './animal.model';
import { environment } from '../../../../../src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AnimalService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/livestock/Animals`;

    getAnimals(): Observable<Animal[]> {
        return this.http.get<Animal[]>(this.apiUrl);
    }

    // নতুন মেথড: ডেটাবেসে নতুন পশু সেভ করার জন্য
    addAnimal(animalData: any): Observable<any> {
        return this.http.post(this.apiUrl, animalData);
    }
}