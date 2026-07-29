import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherStation, WeatherReading, FrostAlertConfig, WeatherSubscriptionBilling } from './weather.service';

@Component({
    selector: 'lib-weather',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: var(--font-sans); color: var(--text-main);">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
        <div>
          <h3 style="color: #ffffff; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Weather Integration & Frost Alerting</h3>
          <p style="color: var(--text-muted); margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor telemetry towers, configure dynamic frost alerts, simulate sensor logs, and audit subscription invoices.</p>
        </div>
        <button (click)="loadAll()" class="btn-secondary">
          🔄 Refresh Telemetry
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 0.75rem; border-bottom: 1px solid var(--border-glass); margin-bottom: 1.5rem; padding-bottom: 2px; flex-wrap: wrap;">
        <button (click)="activeTab = 'telemetry'" [style.border-bottom]="activeTab === 'telemetry' ? '3px solid var(--accent-blue)' : 'none'" [style.color]="activeTab === 'telemetry' ? 'var(--accent-blue)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          📡 Telemetry & Readings
        </button>
        
        <button (click)="activeTab = 'stations'" [style.border-bottom]="activeTab === 'stations' ? '3px solid var(--primary-emerald)' : 'none'" [style.color]="activeTab === 'stations' ? 'var(--primary-emerald)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          🗼 Monitoring Towers
        </button>
        
        <button (click)="activeTab = 'frost'" [style.border-bottom]="activeTab === 'frost' ? '3px solid var(--accent-amber)' : 'none'" [style.color]="activeTab === 'frost' ? 'var(--accent-amber)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          ❄️ Frost Warning Limits
        </button>

        <button (click)="activeTab = 'payments'" [style.border-bottom]="activeTab === 'payments' ? '3px solid var(--accent-purple)' : 'none'" [style.color]="activeTab === 'payments' ? 'var(--accent-purple)' : 'var(--text-muted)'" style="padding: 10px 18px; font-weight: 700; background: none; border: none; cursor: pointer; transition: all 0.2s; font-size: 0.95rem;">
          💳 API Subscriptions
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: rgba(15, 23, 42, 0.6); border-radius: 14px; border: 1px solid var(--border-glass); padding: 1.5rem;">

        <!-- Tab 1: Telemetry & Readings -->
        <div *ngIf="activeTab === 'telemetry'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Simulate Live Station Telemetry Reading</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Station</label>
                <select [(ngModel)]="newReading.weatherStationId" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;">
                  <option value="">-- Choose Station --</option>
                  <option *ngFor="let st of stations" [value]="st.id">{{ st.stationName }}</option>
                </select>
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Air Temp (°C)</label>
                <input type="number" [(ngModel)]="newReading.temperatureCelsius" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Relative Humidity (%)</label>
                <input type="number" [(ngModel)]="newReading.humidityPercentage" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Precipitation (mm)</label>
                <input type="number" [(ngModel)]="newReading.precipitationMm" step="0.1" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Wind Speed (km/h)</label>
                <input type="number" [(ngModel)]="newReading.windSpeedKph" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitReading()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Post Sensor Log
                </button>
              </div>
            </div>
          </div>

          <table class="modern-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Station</th>
                <th>Air Temp</th>
                <th>Humidity</th>
                <th>Rainfall</th>
                <th>Wind Speed</th>
                <th>Frost Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of readings">
                <td>{{ r.readingTime | date:'short' }}</td>
                <td><strong style="color: #ffffff;">{{ getStationName(r.weatherStationId) }}</strong></td>
                <td><strong [style.color]="r.temperatureCelsius <= 0 ? 'var(--accent-blue)' : '#ffffff'">{{ r.temperatureCelsius }} °C</strong></td>
                <td>{{ r.humidityPercentage }}%</td>
                <td>{{ r.precipitationMm }} mm</td>
                <td>{{ r.windSpeedKph }} km/h</td>
                <td>
                  <span [ngClass]="r.isFrostRisk ? 'badge-pill badge-rose' : 'badge-pill badge-emerald'">
                    {{ r.isFrostRisk ? '❄️ Frost Alert!' : 'Optimal' }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="readings.length === 0">
                <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">No telemetry log readings recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab 2: Monitoring Towers -->
        <div *ngIf="activeTab === 'stations'">
          <div style="display: flex; justify-content: flex-end; margin-bottom: 1.25rem;">
            <button (click)="showStationForm = !showStationForm" class="btn-primary">
              {{ showStationForm ? 'Close Form' : '➕ Onboard Monitoring Tower' }}
            </button>
          </div>

          <div *ngIf="showStationForm" style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Onboard Weather Telemetry Tower</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; align-items: flex-end;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Station Name</label>
                <input type="text" [(ngModel)]="newStation.stationName" placeholder="e.g. North Pasture Tower" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">GPS Latitude</label>
                <input type="number" [(ngModel)]="newStation.locationLatitude" step="0.0001" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">GPS Longitude</label>
                <input type="number" [(ngModel)]="newStation.locationLongitude" step="0.0001" style="width: 100%; padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <button (click)="submitStation()" class="btn-primary" style="width: 100%; justify-content: center;">
                  Save Tower Station
                </button>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;">
            <div *ngFor="let st of stations" style="background: rgba(30, 41, 59, 0.8); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1.25rem; border-top: 4px solid var(--primary-emerald);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <strong style="color: #ffffff; font-size: 1.05rem;">{{ st.stationName }}</strong>
                <span class="badge-pill badge-emerald">Online</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
                GPS Coordinates: {{ st.locationLatitude }}, {{ st.locationLongitude }}
              </p>
            </div>
          </div>
        </div>

        <!-- Tab 3: Frost Warning Limits -->
        <div *ngIf="activeTab === 'frost'">
          <div style="background: rgba(15, 23, 42, 0.8); padding: 1.5rem; border-radius: 14px; border: 1px solid var(--border-glass-light); margin-bottom: 2rem;">
            <h4 style="margin: 0 0 1rem 0; color: #ffffff;">Set Frost Alert Temperature Limits</h4>
            <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Min Alert Threshold (°C)</label>
                <input type="number" [(ngModel)]="frostConfig.temperatureThreshold" step="0.5" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem;">Alert Contact Email</label>
                <input type="email" [(ngModel)]="frostConfig.alertEmail" style="padding: 10px; background: var(--bg-dark-slate); border: 1px solid var(--border-glass); border-radius: 8px; color: #ffffff;" />
              </div>
              <button (click)="saveFrostConfig()" class="btn-primary">
                Save Frost Limits
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 4: API Subscriptions -->
        <div *ngIf="activeTab === 'payments'">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Subscription ID</th>
                <th>Billing Date</th>
                <th style="text-align: right;">Fee Amount ($)</th>
                <th style="text-align: center;">Posting</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of billings">
                <td><strong style="color: #ffffff;">Sub-{{ b.id.substring(0, 8) }}</strong></td>
                <td>{{ b.billingDate | date:'mediumDate' }}</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: var(--accent-rose);">{{ b.subscriptionFee | currency:'USD' }}</td>
                <td style="text-align: center;">
                  <span class="badge-pill badge-emerald">Posted GL 5310</span>
                </td>
              </tr>
              <tr *ngIf="billings.length === 0">
                <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 2rem;">No weather API subscription billings recorded.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `
})
export class WeatherComponent implements OnInit {
    private weatherService = inject(WeatherService);
    private cdr = inject(ChangeDetectorRef);

    activeTab = 'telemetry';
    showStationForm = false;

    stations: WeatherStation[] = [];
    readings: WeatherReading[] = [];
    billings: WeatherSubscriptionBilling[] = [];

    frostConfig = {
        fieldId: '00000000-0000-0000-0000-000000000000',
        temperatureThreshold: 1.0,
        alertEmail: 'admin@agrierp.com',
        isAlertActive: true
    };

    newReading = {
        weatherStationId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        temperatureCelsius: 0.5,
        humidityPercentage: 88,
        precipitationMm: 2.4,
        windSpeedKph: 14.5,
        soilMoisturePercentage: 45
    };

    newStation = {
        stationName: '',
        locationLatitude: 41.8781,
        locationLongitude: -87.6298
    };

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.weatherService.getAnalytics().subscribe({
            next: (data) => {
                this.stations = data.stations || [];
                this.readings = data.readings || [];
                this.billings = data.billings || [];
                if (this.stations.length > 0 && !this.newReading.weatherStationId) {
                    this.newReading.weatherStationId = this.stations[0].id;
                }
                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error fetching analytics:', err)
        });
    }

    getStationName(id: string): string {
        const st = this.stations.find(s => s.id === id);
        return st ? st.stationName : 'Station Tower';
    }

    submitReading(): void {
        if (!this.newReading.weatherStationId) {
            alert('Please select a weather station.');
            return;
        }

        this.weatherService.logReading(this.newReading).subscribe({
            next: () => {
                this.loadAll();
            },
            error: (err) => alert('Failed to log telemetry: ' + err.message)
        });
    }

    submitStation(): void {
        if (!this.newStation.stationName) {
            alert('Please fill out Station Name.');
            return;
        }

        this.weatherService.registerStation(this.newStation).subscribe({
            next: () => {
                this.showStationForm = false;
                this.newStation.stationName = '';
                this.loadAll();
            },
            error: (err) => alert('Failed to onboard station: ' + err.message)
        });
    }

    saveFrostConfig(): void {
        this.weatherService.configureFrostAlert(this.frostConfig).subscribe({
            next: () => {
                alert('Frost alert limits updated successfully.');
            },
            error: (err) => alert('Failed to save frost config: ' + err.message)
        });
    }
}
