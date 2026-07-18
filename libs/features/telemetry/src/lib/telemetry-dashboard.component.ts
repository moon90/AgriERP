import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryService, IotDevice, GeofenceZone, AnimalLocationLog } from './telemetry.service';

@Component({
    selector: 'lib-telemetry-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      <!-- Title Header -->
      <div style="margin-bottom: 1.5rem;">
        <h3 style="color: #2c3e50; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">IoT Sensors & Geofencing Telemetry</h3>
        <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor crop moisture level actuators and real-time animal boundary limits.</p>
      </div>

      <!-- Main Columns Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
        
        <!-- Left Column: Devices and Control Panel -->
        <div>
          <!-- IoT Devices List -->
          <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; margin-bottom: 1.5rem;">
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.2rem; font-weight: 600; border-bottom: 2px solid #3498db; padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">📡</span> Active IoT Devices
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div *ngFor="let device of devices" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #3498db;">
                <div>
                  <strong style="color: #2c3e50; display: block; font-size: 0.95rem;">{{ device.name }}</strong>
                  <span style="color: #7f8c8d; font-size: 0.8rem;">Type: {{ device.type }}</span>
                </div>
                <div>
                  <span [ngStyle]="{
                    'background-color': device.status === 'Actuator_Triggered_Irrigation' ? '#e67e22' : '#2ecc71',
                    'color': '#ffffff',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'font-size': '0.75rem',
                    'font-weight': '700'
                  }">
                    {{ device.status }}
                  </span>
                </div>
              </div>
              <div *ngIf="devices.length === 0" style="text-align: center; color: #95a5a6; padding: 1rem;">
                No IoT devices registered.
              </div>
            </div>
          </div>

          <!-- Hardwares Simulator Controls Panel -->
          <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5;">
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.2rem; font-weight: 600; border-bottom: 2px solid #9b59b6; padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">⚙️</span> IoT Hardware Simulators
            </h4>
            <p style="font-size: 0.85rem; color: #7f8c8d; margin-top: 0;">Trigger simulated hardware telemetry without needing physical devices connected.</p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
              <button (click)="triggerMoistureDropSimulation()" [disabled]="devices.length === 0" style="padding: 12px; background: linear-gradient(135deg, #3498db, #2980b9); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: background 0.2s;">
                🌊 Simulate Soil Moisture Drop (Drops below 25%)
              </button>
              <button (click)="triggerGpsBreachSimulation()" [disabled]="geofences.length === 0" style="padding: 12px; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 0.5rem; transition: background 0.2s;">
                🐂 Simulate Animal GPS Geofence Breach
              </button>
            </div>
            
            <!-- Simulation feedback messages -->
            <div *ngIf="simFeedback" style="margin-top: 1rem; padding: 0.75rem; background: #e8f4fd; border: 1px dashed #3498db; border-radius: 6px; font-size: 0.85rem; color: #2980b9; word-break: break-all; font-family: monospace;">
              {{ simFeedback }}
            </div>
          </div>
        </div>

        <!-- Right Column: Geofence Zones and Log Stream -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Active Geofence Zones -->
          <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5;">
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.2rem; font-weight: 600; border-bottom: 2px solid #2ecc71; padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">🗺️</span> Established Geofence Zones
            </h4>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div *ngFor="let fence of geofences" style="padding: 0.75rem; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #2ecc71;">
                <strong style="color: #2c3e50; font-size: 0.95rem; display: block; margin-bottom: 0.25rem;">{{ fence.name }}</strong>
                <span style="font-size: 0.8rem; color: #7f8c8d; font-family: monospace; display: block;">Latitude Range: {{ fence.minLatitude }} to {{ fence.maxLatitude }}</span>
                <span style="font-size: 0.8rem; color: #7f8c8d; font-family: monospace; display: block;">Longitude Range: {{ fence.minLongitude }} to {{ fence.maxLongitude }}</span>
              </div>
              <div *ngIf="geofences.length === 0" style="text-align: center; color: #95a5a6; padding: 1rem;">
                No pasture geofences established.
              </div>
            </div>
          </div>

          <!-- GPS Location Logs & Breach Warning System -->
          <div style="background: #ffffff; padding: 1.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; flex-grow: 1; display: flex; flex-direction: column;">
            <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1.2rem; font-weight: 600; border-bottom: 2px solid #e74c3c; padding-bottom: 0.5rem; display: flex; align-items: center;">
              <span style="margin-right: 0.5rem;">🚨</span> GPS Location Logs Stream
            </h4>
            <div style="overflow-y: auto; max-height: 250px; flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; padding-right: 0.25rem;">
              <div *ngFor="let log of locations" [ngStyle]="{
                'padding': '0.75rem',
                'border-radius': '8px',
                'display': 'flex',
                'justify-content': 'space-between',
                'align-items': 'center',
                'background-color': log.isWithinBounds ? '#f4fbf7' : '#fdf3f2',
                'border': log.isWithinBounds ? '1px solid #d4eedd' : '1px solid #fadbd8'
              }">
                <div>
                  <strong style="font-size: 0.85rem; color: #2c3e50; display: block;">Animal ID: {{ log.animalId | slice:0:8 }}...</strong>
                  <span style="font-size: 0.75rem; color: #7f8c8d; font-family: monospace;">Location: {{ log.latitude }}, {{ log.longitude }}</span>
                  <span style="font-size: 0.7rem; color: #95a5a6; display: block; margin-top: 0.15rem;">{{ log.recordedAt | date:'medium' }}</span>
                </div>
                <div>
                  <span [ngStyle]="{
                    'background-color': log.isWithinBounds ? '#2ecc71' : '#e74c3c',
                    'color': '#ffffff',
                    'padding': '4px 8px',
                    'border-radius': '4px',
                    'font-size': '0.7rem',
                    'font-weight': '700',
                    'text-transform': 'uppercase'
                  }">
                    {{ log.isWithinBounds ? 'Safe' : '🚨 Breach!' }}
                  </span>
                </div>
              </div>
              <div *ngIf="locations.length === 0" style="text-align: center; color: #95a5a6; padding: 2rem;">
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
