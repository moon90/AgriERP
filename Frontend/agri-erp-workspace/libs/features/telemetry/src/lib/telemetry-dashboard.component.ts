import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TelemetryStreamService, TelemetryReading, TelemetryAlarm } from './telemetry-stream.service';
import { TelemetryService, IotDevice, GeofenceZone, AnimalLocationLog } from './telemetry.service';

@Component({
    selector: 'lib-telemetry-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header & Real-Time Status -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Real-Time IoT Edge Telemetry & Biometrics</h3>
            
            <!-- Live WebSocket Connection Pulse Badge -->
            <div style="display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600;"
                 [style.background]="streamService.connectionStatus() === 'connected' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'"
                 [style.border]="streamService.connectionStatus() === 'connected' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)'"
                 [style.color]="streamService.connectionStatus() === 'connected' ? 'var(--primary-emerald)' : 'var(--accent-rose)'">
              <span [style.background]="streamService.connectionStatus() === 'connected' ? 'var(--primary-emerald)' : 'var(--accent-rose)'"
                    style="width: 8px; height: 8px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px currentColor; animation: pulse 1.8s infinite;"></span>
              {{ streamService.connectionStatus() === 'connected' ? 'Live WebSocket Stream' : 'Reconnecting WebSocket...' }}
            </div>
          </div>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Sub-second edge sensory streaming across greenhouse microclimates, soil probes, irrigation lines, and animal biometric collars.</p>
        </div>

        <!-- Controls -->
        <div style="display: flex; gap: 0.75rem; align-items: center;">
          <button (click)="streamService.startConnection()" class="btn-secondary" style="font-size: 0.85rem;">
            ⚡ Reconnect Socket
          </button>
        </div>
      </div>

      <!-- Active Alarms Banner (if any alarm is active) -->
      <div *ngIf="streamService.activeAlarms().length > 0" style="background: rgba(244, 63, 94, 0.12); border: 1px solid rgba(244, 63, 94, 0.35); border-left: 5px solid var(--accent-rose); border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; backdrop-filter: blur(8px);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem; color: var(--accent-rose); font-weight: 700; font-size: 0.95rem;">
            <span>🚨 Active Edge Threshold Alarms ({{ streamService.activeAlarms().length }})</span>
          </div>
          <button (click)="streamService.clearAllAlarms()" style="background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline;">
            Dismiss All Alarms
          </button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div *ngFor="let alarm of streamService.activeAlarms()" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #ffffff; background: rgba(15, 23, 42, 0.6); padding: 8px 12px; border-radius: 8px;">
            <div>
              <strong style="color: var(--accent-rose);">[{{ alarm.zone }}]</strong> {{ alarm.message }}
              <span style="color: var(--text-muted); font-size: 0.75rem; margin-left: 8px;">({{ alarm.triggeredAt | date:'mediumTime' }})</span>
            </div>
            <button (click)="streamService.dismissAlarm(alarm.alarmId)" class="badge-pill badge-rose" style="border: none; cursor: pointer; font-size: 0.75rem;">
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <!-- 5 Dynamic Real-time Metric Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
        
        <!-- Soil Moisture -->
        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.25rem; border-top: 4px solid var(--accent-blue); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Soil Moisture Index</span>
              <div style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 0.25rem;">
                {{ streamService.latestSoilMoisture() }}<span style="font-size: 1.1rem; color: var(--accent-blue); font-weight: 600;">%</span>
              </div>
            </div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(59, 130, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              💧
            </div>
          </div>
          <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Target: 30% - 60%</span>
            <span class="badge-pill badge-blue" style="font-size: 0.7rem;">Optimal</span>
          </div>
        </div>

        <!-- Ambient Temperature -->
        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Greenhouse Climate</span>
              <div style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 0.25rem;">
                {{ streamService.latestAmbientTemp() }}<span style="font-size: 1.1rem; color: var(--primary-emerald); font-weight: 600;">°C</span>
              </div>
            </div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              🌡️
            </div>
          </div>
          <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Frost Limit: 0.0°C</span>
            <span class="badge-pill badge-emerald" style="font-size: 0.7rem;">Safe Range</span>
          </div>
        </div>

        <!-- Carbon Dioxide (CO2) -->
        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.25rem; border-top: 4px solid var(--accent-amber); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">CO2 Concentration</span>
              <div style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 0.25rem;">
                {{ streamService.latestCO2() | number:'1.0-0' }}<span style="font-size: 1.1rem; color: var(--accent-amber); font-weight: 600;">ppm</span>
              </div>
            </div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(245, 158, 11, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              💨
            </div>
          </div>
          <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Photosynthesis Boost</span>
            <span class="badge-pill badge-amber" style="font-size: 0.7rem;">Enriched</span>
          </div>
        </div>

        <!-- Livestock Biometrics -->
        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.25rem; border-top: 4px solid var(--accent-purple); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Cattle Herd Heart Rate</span>
              <div style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 0.25rem;">
                {{ streamService.latestAnimalHeartRate() | number:'1.0-0' }}<span style="font-size: 1.1rem; color: var(--accent-purple); font-weight: 600;">bpm</span>
              </div>
            </div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(139, 92, 246, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              🐄
            </div>
          </div>
          <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Resting Normal: 60-85</span>
            <span class="badge-pill badge-purple" style="font-size: 0.7rem;">Normal Vitals</span>
          </div>
        </div>

        <!-- Solar Power & Battery -->
        <div style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 14px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald); position: relative; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Solar Station Battery</span>
              <div style="font-size: 2rem; font-weight: 800; color: #ffffff; margin-top: 0.25rem;">
                {{ streamService.latestBatteryHealth() | number:'1.0-0' }}<span style="font-size: 1.1rem; color: var(--primary-emerald); font-weight: 600;">%</span>
              </div>
            </div>
            <div style="width: 42px; height: 42px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              ⚡
            </div>
          </div>
          <div style="margin-top: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted);">
            <span>Solar Input: +3.2 kW</span>
            <span class="badge-pill badge-emerald" style="font-size: 0.7rem;">Charging</span>
          </div>
        </div>

      </div>

      <!-- Zone Multi-Filter Tabs -->
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 4px;">
        <button *ngFor="let zone of zones"
                (click)="streamService.setZone(zone)"
                [style.background]="streamService.selectedZone() === zone ? 'var(--primary-emerald)' : 'rgba(30, 41, 59, 0.6)'"
                [style.color]="streamService.selectedZone() === zone ? '#0f172a' : 'var(--text-muted)'"
                [style.border]="streamService.selectedZone() === zone ? '1px solid var(--primary-emerald)' : '1px solid var(--border-glass)'"
                style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap;">
          {{ zone }}
        </button>
      </div>

      <!-- Live Stream Timeline Table Container -->
      <div style="background: rgba(15, 23, 42, 0.6); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h4 style="color: #ffffff; margin: 0; font-size: 1.1rem; font-weight: 700;">📡 Live Edge Ingestion Stream ({{ streamService.filteredReadings().length }} Events)</h4>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Auto-updating via WebSocket Channel</span>
        </div>

        <table class="modern-table">
          <thead>
            <tr>
              <th>Device Name</th>
              <th>Farm Zone</th>
              <th>Sensor Type</th>
              <th style="text-align: right;">Live Value</th>
              <th style="text-align: center;">Battery</th>
              <th>Timestamp</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of streamService.filteredReadings()">
              <td>
                <strong style="color: #ffffff;">{{ item.deviceName }}</strong>
              </td>
              <td style="color: var(--text-muted);">{{ item.zone }}</td>
              <td>
                <span class="badge-pill badge-blue">{{ item.sensorType }}</span>
              </td>
              <td style="text-align: right; font-family: monospace; font-weight: 800; font-size: 1rem;"
                  [style.color]="item.isAlarm ? 'var(--accent-rose)' : 'var(--primary-emerald)'">
                {{ item.value }} {{ item.unit }}
              </td>
              <td style="text-align: center;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">🔋 {{ item.batteryPercentage }}%</span>
              </td>
              <td style="font-size: 0.85rem; color: var(--text-muted);">{{ item.timestamp | date:'mediumTime' }}</td>
              <td style="text-align: center;">
                <span [ngClass]="item.isAlarm ? 'badge-pill badge-rose' : 'badge-pill badge-emerald'">
                  {{ item.isAlarm ? '⚠️ Threshold Breach' : '✅ Normal' }}
                </span>
              </td>
            </tr>
            <tr *ngIf="streamService.filteredReadings().length === 0">
              <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 3rem;">
                Connecting to IoT Edge WebSocket Stream... Readings will appear automatically every 3 seconds.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  `
})
export class TelemetryDashboardComponent implements OnInit {
    streamService = inject(TelemetryStreamService);
    telemetryService = inject(TelemetryService);

    zones: string[] = [
        'All',
        'Greenhouse Complex',
        'Sector-A North Plot',
        'Livestock Barn 3',
        'Sector-B Lower Basin',
        'Central Station'
    ];

    ngOnInit(): void {
        this.streamService.startConnection();
    }
}
