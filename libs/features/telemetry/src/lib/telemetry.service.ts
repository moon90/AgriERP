import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface IotDevice {
    id: string;
    name: string;
    type: string;
    status: string;
}

export interface GeofenceZone {
    id: string;
    name: string;
    minLatitude: number;
    maxLatitude: number;
    minLongitude: number;
    maxLongitude: number;
}

export interface AnimalLocationLog {
    id: string;
    animalId: string;
    latitude: number;
    longitude: number;
    recordedAt: string;
    isWithinBounds: boolean;
}

@Injectable({ providedIn: 'root' })
export class TelemetryService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/Telemetry`;

    getDevices(): Observable<IotDevice[]> {
        return this.http.get<IotDevice[]>(`${this.apiUrl}/devices`);
    }

    getGeofences(): Observable<GeofenceZone[]> {
        return this.http.get<GeofenceZone[]>(`${this.apiUrl}/geofences`);
    }

    getLocations(): Observable<AnimalLocationLog[]> {
        return this.http.get<AnimalLocationLog[]>(`${this.apiUrl}/locations`);
    }

    simulateMoistureDrop(deviceId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/simulator/moisture-drop?deviceId=${deviceId}`, {});
    }

    simulateGpsBreach(animalId: string, geofenceId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/simulator/gps-breach?animalId=${animalId}&geofenceId=${geofenceId}`, {});
    }
}
