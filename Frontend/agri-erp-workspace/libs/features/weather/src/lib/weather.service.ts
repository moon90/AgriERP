import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

export interface WeatherStation {
    id: string;
    stationName: string;
    locationLatitude: number;
    locationLongitude: number;
    isActive: boolean;
}

export interface WeatherReading {
    id: string;
    weatherStationId: string;
    stationName: string;
    readingTime: string;
    temperatureCelsius: number;
    humidityPercentage: number;
    windSpeedKph: number;
    precipitationMm: number;
    soilMoisturePercentage: number;
    isFrostRisk: boolean;
}

export interface FrostAlertConfig {
    id: string;
    fieldId: string;
    temperatureThreshold: number;
    alertEmail: string;
    isAlertActive: boolean;
}

export interface WeatherSubscriptionBilling {
    id: string;
    subscriptionFee: number;
    billingDate: string;
}

export interface WeatherAnalytics {
    stations: WeatherStation[];
    readings: WeatherReading[];
    frostConfigs: FrostAlertConfig[];
    billings: WeatherSubscriptionBilling[];
    totalSubscriptionExpenses: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/weather`;

    registerStation(command: {
        stationName: string;
        locationLatitude: number;
        locationLongitude: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/stations`, command);
    }

    logReading(command: {
        weatherStationId: string;
        fieldId: string;
        temperatureCelsius: number;
        humidityPercentage: number;
        windSpeedKph: number;
        precipitationMm: number;
        soilMoisturePercentage: number;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/readings`, command);
    }

    configureFrostAlert(command: {
        fieldId: string;
        temperatureThreshold: number;
        alertEmail: string;
        isAlertActive: boolean;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/frost-configs`, command);
    }

    processSubscriptionBill(command: {
        subscriptionFee: number;
        billingDate: string;
    }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/subscription-bills`, command);
    }

    getAnalytics(): Observable<WeatherAnalytics> {
        return this.http.get<WeatherAnalytics>(`${this.apiUrl}/analytics`);
    }
}
