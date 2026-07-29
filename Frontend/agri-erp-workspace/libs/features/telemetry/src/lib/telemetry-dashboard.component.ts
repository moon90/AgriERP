import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryService, IotDevice, GeofenceZone, AnimalLocationLog } from './telemetry.service';

@Component({
    selector: 'lib-telemetry-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      <!-- Title Header -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.4rem; letter-spacing: -0.5px;">IoT Sensors & Geofencing Telemetry</h3>
        <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor crop moisture level actuators and real-time animal boundary limits.</p>
      </div>

      <!-- Main Columns Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
        
        <!-- Left Column: Devices and Control Panel -->
        <div>
          <!-- IoT Devices List -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1.1rem; font-weight: 600; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">📡</span> Active IoT Devices
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div *ngFor="let device of devices" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(30, 41, 59, 0.8); border-radius: 10px; border-left: 4px solid var(--accent-blue); border-top: 1px solid var(--border-glass);">
                <div>
                  <strong style="color: #ffffff; display: block; font-size: 0.95rem;">{{ device.name }}</strong>
                  <span style="color: var(--text-muted); font-size: 0.8rem;">Type: {{ device.type }}</span>
                </div>
                <div>
                  <span [ngStyle]="{
                    'background': device.status === 'Actuator_Triggered_Irrigation' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    'color': device.status === 'Actuator_Triggered_Irrigation' ? '#f59e0b' : '#10b981',
                    'border': device.status === 'Actuator_Triggered_Irrigation' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)',
                    'padding': '4px 10px',
                    'border-radius': '20px',
                    'font-size': '0.75rem',
                    'font-weight': '700'
                  }">
                    {{ device.status }}
                  </span>
                </div>
              </div>
              <div *ngIf="devices.length === 0" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
                No IoT devices registered.
              </div>
            </div>
          </div>

          <!-- Hardwares Simulator Controls Panel -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1.1rem; font-weight: 600; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">⚙️</span> IoT Hardware Simulators
            </h4>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0;">Trigger simulated hardware telemetry without needing physical devices connected.</p>
            
            <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
              <button (click)="triggerMoistureDropSimulation()" [disabled]="devices.length === 0" class="btn-primary" style="justify-content: center; width: 100%;">
                🌊 Simulate Soil Moisture Drop (Drops below 25%)
              </button>
              <button (click)="triggerGpsBreachSimulation()" [disabled]="geofences.length === 0" class="btn-danger" style="justify-content: center; width: 100%;">
                🐂 Simulate Animal GPS Geofence Breach
              </button>
            </div>
            
            <!-- Simulation feedback messages -->
            <div *ngIf="simFeedback" style="margin-top: 1rem; padding: 0.85rem; background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 10px; font-size: 0.85rem; color: var(--accent-blue); word-break: break-all; font-family: monospace;">
              {{ simFeedback }}
            </div>
          </div>
        </div>

        <!-- Right Column: Geofence Zones and Log Stream -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Active Geofence Zones -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1.1rem; font-weight: 600; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">🗺️</span> Established Geofence Zones
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div *ngFor="let fence of geofences" style="padding: 0.85rem 1rem; background: rgba(30, 41, 59, 0.8); border-radius: 10px; border-left: 4px solid var(--primary-emerald); border-top: 1px solid var(--border-glass);">
                <strong style="color: #ffffff; font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">{{ fence.name }}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block;">Latitude Range: {{ fence.minLatitude }} to {{ fence.maxLatitude }}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted); font-family: monospace; display: block;">Longitude Range: {{ fence.minLongitude }} to {{ fence.maxLongitude }}</span>
              </div>
              <div *ngIf="geofences.length === 0" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
                No pasture geofences established.
              </div>
            </div>
          </div>

          <!-- GPS Location Logs & Breach Warning System -->
          <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass); flex-grow: 1; display: flex; flex-direction: column;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff; font-size: 1.1rem; font-weight: 600; border-bottom: 1px solid var(--border-glass); padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">🚨</span> GPS Location Logs Stream
            </h4>
            <div style="overflow-y: auto; max-height: 250px; flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.25rem;">
              <div *ngFor="let log of locations" [ngStyle]="{
                'padding': '0.75rem 1rem',
                'border-radius': '8px',
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
                'background': log.isWithinBounds ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                'border': log.isWithinBounds ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(244, 63, 94, 0.25)'
              }">
                <div>
                  <strong style="font-size: 0.85rem; color: #ffffff; display: block;">Animal ID: {{ log.animalId | slice:0:8 }}...</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">Location: {{ log.latitude }}, {{ log.longitude }}</span>
                  <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 0.15rem;">{{ log.recordedAt | date:'medium' }}</span>
                </div>
                <div>
                  <span [ngStyle]="{
                    'background': log.isWithinBounds ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    'color': log.isWithinBounds ? '#10b981' : '#f43f5e',
                    'border': log.isWithinBounds ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
                    'padding': '4px 10px',
                    'border-radius': '20px',
                    'font-size': '0.7rem',
                    'font-weight': '700'
                  }">
                    {{ log.isWithinBounds ? 'Safe' : '🚨 Breach!' }}
                  </span>
                </div>
              </div>
              <div *ngIf="locations.length === 0" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                No GPS location data recorded.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `
})
export class TelemetryDashboardComponent implements OnInit {
    private telemetryService = inject(TelemetryService);
    private cdr = inject(ChangeDetectorRef);

    devices: IotDevice[] = [];
    geofences: GeofenceZone[] = [];
    locations: AnimalLocationLog[] = [];
    simFeedback = '';

    ngOnInit(): void {
        this.loadTelemetryData();
    }

    loadTelemetryData(): void {
        this.telemetryService.getDevices().subscribe({
            next: (data) => {
                this.devices = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching telemetry devices:', err)
        });

        this.telemetryService.getGeofences().subscribe({
            next: (data) => {
                this.geofences = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching geofences:', err)
        });

        this.telemetryService.getLocations().subscribe({
            next: (data) => {
                this.locations = data;
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching location logs:', err)
        });
    }

    triggerMoistureDropSimulation(): void {
        if (this.devices.length === 0) return;
        const targetDevice = this.devices[0];
        this.simFeedback = 'Initiating simulated soil moisture reading of 24.5%...';
        this.telemetryService.simulateMoistureDrop(targetDevice.id).subscribe({
            next: (res) => {
                this.simFeedback = `Moisture simulator success! Device: ${targetDevice.name}. Actuator status: ${res.triggeredActuatorStatus}.`;
                this.loadTelemetryData();
            },
            error: (err) => {
                this.simFeedback = `Moisture simulator failed: ${err.message}`;
            }
        });
    }

    triggerGpsBreachSimulation(): void {
        if (this.geofences.length === 0) return;
        const targetFence = this.geofences[0];
        const dummyAnimalId = '00000000-0000-0000-0000-000000000000';
        this.simFeedback = 'Posting simulated GPS boundary coordinate breaches...';
        this.telemetryService.simulateGpsBreach(dummyAnimalId, targetFence.id).subscribe({
            next: (res) => {
                this.simFeedback = `GPS simulation success! Logged coordinates inside geofence (Safe) and outside geofence (Breach).`;
                this.loadTelemetryData();
            },
            error: (err) => {
                this.simFeedback = `GPS simulation failed: ${err.message}`;
            }
        });
    }
}
