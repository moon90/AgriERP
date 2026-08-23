import { Injectable, signal, computed, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../../../src/environments/environment';

export interface TelemetryReading {
    deviceId: string;
    deviceName: string;
    zone: string;
    sensorType: string;
    value: number;
    unit: string;
    batteryPercentage: number;
    timestamp: string;
    isAlarm: boolean;
}

export interface TelemetryAlarm {
    alarmId: string;
    deviceId: string;
    deviceName: string;
    zone: string;
    severity: string;
    message: string;
    currentValue: number;
    thresholdValue: number;
    triggeredAt: string;
}

@Injectable({ providedIn: 'root' })
export class TelemetryStreamService {
    private hubConnection?: signalR.HubConnection;
    private hubUrl = `${environment.apiUrl.replace('/api', '')}/hubs/telemetry`;

    // Reactive Signals
    connectionStatus = signal<'connected' | 'connecting' | 'reconnecting' | 'disconnected'>('disconnected');
    liveReadings = signal<TelemetryReading[]>([]);
    activeAlarms = signal<TelemetryAlarm[]>([]);
    selectedZone = signal<string>('All');

    // Filtered readings based on selected zone
    filteredReadings = computed(() => {
        const zone = this.selectedZone();
        const readings = this.liveReadings();
        if (zone === 'All') return readings;
        return readings.filter(r => r.zone === zone);
    });

    // Summary Metric Signals
    latestSoilMoisture = computed(() => {
        const reading = this.liveReadings().find(r => r.sensorType === 'SoilMoisture');
        return reading ? reading.value : 42.5;
    });

    latestAmbientTemp = computed(() => {
        const reading = this.liveReadings().find(r => r.sensorType === 'AmbientTemp');
        return reading ? reading.value : 24.8;
    });

    latestCO2 = computed(() => {
        const reading = this.liveReadings().find(r => r.sensorType === 'CO2');
        return reading ? reading.value : 520;
    });

    latestAnimalHeartRate = computed(() => {
        const reading = this.liveReadings().find(r => r.sensorType === 'AnimalVitals');
        return reading ? reading.value : 74;
    });

    latestBatteryHealth = computed(() => {
        const reading = this.liveReadings().find(r => r.sensorType === 'BatteryPower');
        return reading ? reading.value : 94.2;
    });

    constructor() {
        this.initSignalR();
    }

    private initSignalR(): void {
        this.connectionStatus.set('connecting');

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect([0, 2000, 5000, 10000])
            .configureLogging(signalR.LogLevel.Warning)
            .build();

        this.hubConnection.onreconnecting(() => {
            this.connectionStatus.set('reconnecting');
        });

        this.hubConnection.onreconnected(() => {
            this.connectionStatus.set('connected');
        });

        this.hubConnection.onclose(() => {
            this.connectionStatus.set('disconnected');
        });

        // Register event listener for live readings
        this.hubConnection.on('ReceiveTelemetryReading', (reading: TelemetryReading) => {
            this.liveReadings.update(prev => {
                const updated = [reading, ...prev.slice(0, 39)];
                return updated;
            });
        });

        // Register event listener for threshold alarms
        this.hubConnection.on('ReceiveThresholdAlarm', (alarm: TelemetryAlarm) => {
            this.activeAlarms.update(prev => {
                // Prevent duplicate alarm spam
                const exists = prev.some(a => a.deviceId === alarm.deviceId && a.message === alarm.message);
                if (exists) return prev;
                return [alarm, ...prev.slice(0, 9)];
            });
        });

        this.startConnection();
    }

    startConnection(): void {
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
            this.hubConnection
                .start()
                .then(() => {
                    this.connectionStatus.set('connected');
                })
                .catch(err => {
                    console.warn('SignalR WebSocket connection attempt failed:', err);
                    this.connectionStatus.set('disconnected');
                });
        }
    }

    setZone(zone: string): void {
        this.selectedZone.set(zone);
        if (this.hubConnection && this.hubConnection.state === signalR.HubConnectionState.Connected) {
            if (zone !== 'All') {
                this.hubConnection.invoke('SubscribeZone', zone).catch(err => console.error(err));
            }
        }
    }

    dismissAlarm(alarmId: string): void {
        this.activeAlarms.update(prev => prev.filter(a => a.alarmId !== alarmId));
    }

    clearAllAlarms(): void {
        this.activeAlarms.set([]);
    }
}
