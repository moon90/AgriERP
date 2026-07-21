import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherStation, WeatherReading, FrostAlertConfig, WeatherSubscriptionBilling } from './weather.service';

@Component({
    selector: 'lib-weather',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin-bottom: 3rem;">
      
      <!-- Top Title Header -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="color: #2980b9; margin: 0; font-weight: 700; font-size: 1.5rem; letter-spacing: -0.5px;">Weather Integration & Frost Alerting</h3>
          <p style="color: #7f8c8d; margin: 0.25rem 0 0 0; font-size: 0.9rem;">Monitor telemetry towers, configure dynamic frost alerts, simulate sensor logs, and audit subscription invoices.</p>
        </div>
        <button (click)="loadAll()" style="padding: 8px 16px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
          🔄 Refresh Telemetry
        </button>
      </div>

      <!-- Tab Buttons Navigation -->
      <div style="display: flex; gap: 1rem; border-bottom: 2px solid #eef2f5; padding-bottom: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;">
        <button (click)="activeTab = 'telemetry'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'telemetry' ? '#2980b9' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'telemetry' ? '3px solid #2980b9' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          📡 Telemetry & Readings
        </button>
        
        <button (click)="activeTab = 'stations'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'stations' ? '#16a085' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'stations' ? '3px solid #16a085' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          🗼 Monitoring Towers
        </button>
        
        <button (click)="activeTab = 'frost'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'frost' ? '#e67e22' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'frost' ? '3px solid #e67e22' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          ❄️ Frost warning Limits
        </button>

        <button (click)="activeTab = 'payments'" [ngStyle]="{
          'padding': '10px 20px',
          'background': 'none',
          'border': 'none',
          'color': activeTab === 'payments' ? '#2c3e50' : '#7f8c8d',
          'font-weight': '700',
          'font-size': '1rem',
          'cursor': 'pointer',
          'border-bottom': activeTab === 'payments' ? '3px solid #2c3e50' : 'none',
          'margin-bottom': '-14px',
          'transition': 'all 0.2s'
        }">
          💳 API Subscriptions
        </button>
      </div>

      <!-- Tab Content Area -->
      <div style="background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px solid #eef2f5; padding: 1.5rem;">

        <!-- Tab 1: Telemetry & Readings -->
        <div *ngIf="activeTab === 'telemetry'">
          <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem;">
            
            <!-- Readings Table -->
            <div>
              <h4 style="margin: 0 0 1.25rem 0; color: #2c3e50;">Live Weather Sensor Streams</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                    <th style="padding: 10px;">Station</th>
                    <th style="padding: 10px; text-align: right;">Temperature</th>
                    <th style="padding: 10px; text-align: right;">Humidity</th>
                    <th style="padding: 10px; text-align: right;">Wind</th>
                    <th style="padding: 10px; text-align: right;">Soil Moisture</th>
                    <th style="padding: 10px; text-align: center;">Frost Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let r of readings" style="border-bottom: 1px solid #eef2f5;">
                    <td style="padding: 10px; font-weight: bold;">🗼 {{ r.stationName }}</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold;" [ngStyle]="{'color': r.isFrostRisk ? '#c53030' : '#2d3748'}">
                      {{ r.temperatureCelsius | number:'1.1-2' }} °C
                    </td>
                    <td style="padding: 10px; text-align: right;">{{ r.humidityPercentage | number:'1.1-2' }}%</td>
                    <td style="padding: 10px; text-align: right;">{{ r.windSpeedKph | number:'1.1-2' }} kph</td>
                    <td style="padding: 10px; text-align: right; color: #3182ce; font-weight: bold;">
                      {{ r.soilMoisturePercentage | number:'1.1-2' }}%
                    </td>
                    <td style="padding: 10px; text-align: center;">
                      <span *ngIf="r.isFrostRisk" style="padding: 4px 8px; background: #ffebeb; color: #c53030; font-weight: bold; border-radius: 4px; font-size: 0.75rem;">
                        ⚠️ FROST ALARM
                      </span>
                      <span *ngIf="!r.isFrostRisk" style="padding: 4px 8px; background: #e6fffa; color: #319795; font-weight: bold; border-radius: 4px; font-size: 0.75rem;">
                        OK
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="readings.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
                No weather sensor telemetries registered.
              </div>
            </div>

            <!-- Telemetry Simulator Panel -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;">
              <h4 style="margin: 0 0 1rem 0; color: #2d3748; font-size: 1rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 6px;">🗼 Telemetry Simulator</h4>
              <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Select Weather Station</label>
                  <select [(ngModel)]="simReading.weatherStationId" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <option value="">-- Choose Tower --</option>
                    <option *ngFor="let s of stations" [value]="s.id">{{ s.stationName }}</option>
                  </select>
                </div>
                
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Target Field</label>
                  <select [(ngModel)]="simReading.fieldId" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;">
                    <option value="00000000-0000-0000-0000-000000000000">Default Field (Warning: 2.0°C)</option>
                    <option *ngFor="let c of frostConfigs" [value]="c.fieldId">Field ID: {{ c.fieldId.substring(0,8) }} (Limit: {{ c.temperatureThreshold }}°C)</option>
                  </select>
                </div>

                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Temperature (°C)</label>
                  <input type="number" [(ngModel)]="simReading.temperatureCelsius" step="0.5" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>

                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Humidity (%)</label>
                  <input type="number" [(ngModel)]="simReading.humidityPercentage" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>

                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Wind Speed (kph)</label>
                  <input type="number" [(ngModel)]="simReading.windSpeedKph" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>

                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Soil Moisture (%)</label>
                  <input type="number" [(ngModel)]="simReading.soilMoisturePercentage" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>

                <button (click)="simulateReading()" [disabled]="!simReading.weatherStationId" style="margin-top: 0.5rem; padding: 10px; background: #2980b9; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; opacity: simReading.weatherStationId ? 1 : 0.6;">
                  Emit Telemetry
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 2: Weather Stations Directory -->
        <div *ngIf="activeTab === 'stations'">
          <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem;">
            
            <!-- Stations Directory Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; align-content: flex-start;">
              <div *ngFor="let s of stations" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; border-top: 4px solid #16a085;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <strong style="color: #2d3748;">🗼 {{ s.stationName }}</strong>
                  <span style="padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;" [ngStyle]="{'background': s.isActive ? '#e6fffa' : '#fee2e2', 'color': s.isActive ? '#319795' : '#c53030'}">
                    {{ s.isActive ? 'ONLINE' : 'OFFLINE' }}
                  </span>
                </div>
                <div style="font-size: 0.8rem; color: #64748b;">
                  <div>Latitude: <strong>{{ s.locationLatitude | number:'1.6-6' }}</strong></div>
                  <div>Longitude: <strong>{{ s.locationLongitude | number:'1.6-6' }}</strong></div>
                </div>
              </div>
              <div *ngIf="stations.length === 0" style="padding: 2rem; color: #95a5a6; grid-column: 1/-1; text-align: center;">
                No monitoring towers onboarded.
              </div>
            </div>

            <!-- New Station Form -->
            <div style="background: #eefbf9; border: 1px solid #bcece3; border-radius: 10px; padding: 1.25rem; border-left: 5px solid #16a085;">
              <h4 style="margin: 0 0 1rem 0; color: #16a085; font-size: 1rem;">Register Telemetry Tower</h4>
              <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Station Name</label>
                  <input type="text" [(ngModel)]="newStation.stationName" placeholder="e.g. North Field Tower" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Latitude</label>
                  <input type="number" [(ngModel)]="newStation.locationLatitude" step="0.0001" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Longitude</label>
                  <input type="number" [(ngModel)]="newStation.locationLongitude" step="0.0001" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <button (click)="submitStation()" style="padding: 10px; background: #16a085; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 0.5rem;">
                  Add Station
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 3: Frost warning Limits -->
        <div *ngIf="activeTab === 'frost'">
          <div style="display: grid; grid-template-columns: 1fr 360px; gap: 2rem;">
            
            <!-- Threshold configs list -->
            <div>
              <h4 style="margin: 0 0 1.25rem 0; color: #2c3e50;">Active Frost Warning Triggers</h4>
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                    <th style="padding: 10px;">Field Reference</th>
                    <th style="padding: 10px; text-align: right;">Critical Temperature</th>
                    <th style="padding: 10px;">Alert Contact Email</th>
                    <th style="padding: 10px; text-align: center;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let c of frostConfigs" style="border-bottom: 1px solid #eef2f5;">
                    <td style="padding: 10px; font-family: monospace;">Field ID: {{ c.fieldId.substring(0,8) }}</td>
                    <td style="padding: 10px; text-align: right; color: #e67e22; font-weight: bold;">
                      {{ c.temperatureThreshold | number:'1.1-2' }} °C
                    </td>
                    <td style="padding: 10px;">{{ c.alertEmail }}</td>
                    <td style="padding: 10px; text-align: center;">
                      <span [ngStyle]="{'color': c.isAlertActive ? '#2b6cb0' : '#718096', 'font-weight': 'bold'}">
                        {{ c.isAlertActive ? 'ACTIVE' : 'MUTED' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="frostConfigs.length === 0" style="padding: 2rem; text-align: center; color: #95a5a6;">
                No frost configuration rules mapped.
              </div>
            </div>

            <!-- Configure new Threshold Form -->
            <div style="background: #fffaf4; border: 1px solid #ffd8b3; border-radius: 10px; padding: 1.25rem; border-left: 5px solid #e67e22;">
              <h4 style="margin: 0 0 1rem 0; color: #e67e22; font-size: 1rem;">Set Warning Parameters</h4>
              <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Field ID</label>
                  <input type="text" [(ngModel)]="newConfig.fieldId" placeholder="e.g. Guid value" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Critical Temperature (°C)</label>
                  <input type="number" [(ngModel)]="newConfig.temperatureThreshold" step="0.5" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Alert Email</label>
                  <input type="email" [(ngModel)]="newConfig.alertEmail" placeholder="manager@agrierp.com" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
                  <input type="checkbox" [(ngModel)]="newConfig.isAlertActive" id="activeChk" />
                  <label for="activeChk" style="font-weight: bold; color: #2d3748;">Enable Frost Alarm</label>
                </div>
                <button (click)="submitConfig()" style="padding: 10px; background: #e67e22; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 0.5rem;">
                  Apply Configuration
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Tab 4: Subscription payments -->
        <div *ngIf="activeTab === 'payments'">
          
          <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem;">
            
            <!-- Invoices List -->
            <div>
              <div style="background: #eef2f7; border: 1px solid #cbd5e1; border-radius: 8px; padding: 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; border-left: 5px solid #2c3e50;">
                <span style="font-size: 0.9rem; color: #2c3e50; font-weight: bold;">TOTAL TELEMETRY SUBSCRIPTION FEES</span>
                <strong style="font-size: 1.75rem; color: #2c3e50;">
                  {{ totalSubscriptionExpenses | currency:'USD' }}
                </strong>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                  <tr style="border-bottom: 2px solid #eef2f5; background-color: #f8fafc;">
                    <th style="padding: 10px;">Billing Date</th>
                    <th style="padding: 10px;">Billing Reference</th>
                    <th style="padding: 10px; text-align: right;">Subscription Invoice Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let b of billings" style="border-bottom: 1px solid #eef2f5;">
                    <td style="padding: 10px;">{{ b.billingDate | date:'yyyy-MM-dd' }}</td>
                    <td style="padding: 10px;">Weather API Subscription Invoice (Posted in AP)</td>
                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #c53030;">
                      {{ b.subscriptionFee | currency:'USD' }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="billings.length === 0" style="padding: 3rem; text-align: center; color: #95a5a6;">
                No subscription billing statements archived.
              </div>
            </div>

            <!-- Inbound Subscription Billing Form -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem; border-left: 5px solid #2c3e50; font-size: 0.85rem;">
              <h4 style="margin: 0 0 1rem 0; color: #2c3e50; font-size: 1rem;">Log Telemetry Service Invoice</h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Subscription Fee ($)</label>
                  <input type="number" [(ngModel)]="newBilling.subscriptionFee" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem;">Billing Date</label>
                  <input type="date" [(ngModel)]="newBilling.billingDate" style="width: 100%; padding: 6px; border: 1px solid #cbd5e1; border-radius: 6px;" />
                </div>
                <button (click)="submitBilling()" style="padding: 10px; background: #2c3e50; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 0.5rem;">
                  Post Subscription Bill
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  `,
    styles: []
})
export class WeatherComponent implements OnInit {
    private weatherService = inject(WeatherService);
    private cdr = inject(ChangeDetectorRef);

    activeTab: string = 'telemetry';
    stations: WeatherStation[] = [];
    readings: WeatherReading[] = [];
    frostConfigs: FrostAlertConfig[] = [];
    billings: WeatherSubscriptionBilling[] = [];
    totalSubscriptionExpenses: number = 0;

    newStation = {
        stationName: '',
        locationLatitude: 41.5342,
        locationLongitude: -93.6182
    };

    simReading = {
        weatherStationId: '',
        fieldId: '00000000-0000-0000-0000-000000000000',
        temperatureCelsius: 1.0,
        humidityPercentage: 75.0,
        windSpeedKph: 12.0,
        precipitationMm: 0.0,
        soilMoisturePercentage: 42.0
    };

    newConfig = {
        fieldId: '',
        temperatureThreshold: 2.0,
        alertEmail: '',
        isAlertActive: true
    };

    newBilling = {
        subscriptionFee: 75,
        billingDate: ''
    };

    ngOnInit(): void {
        this.newBilling.billingDate = new Date().toISOString().split('T')[0];
        this.loadAll();
    }

    loadAll(): void {
        this.weatherService.getAnalytics().subscribe(w => {
            this.stations = w.stations;
            this.readings = w.readings;
            this.frostConfigs = w.frostConfigs;
            this.billings = w.billings;
            this.totalSubscriptionExpenses = w.totalSubscriptionExpenses;
            this.cdr.detectChanges();
        });
    }

    submitStation(): void {
        if (!this.newStation.stationName) return;
        this.weatherService.registerStation(this.newStation).subscribe(() => {
            this.newStation = {
                stationName: '',
                locationLatitude: 41.5342,
                locationLongitude: -93.6182
            };
            this.loadAll();
        });
    }

    simulateReading(): void {
        if (!this.simReading.weatherStationId) return;
        this.weatherService.logReading(this.simReading).subscribe(() => {
            this.simReading.temperatureCelsius = 1.0;
            this.simReading.humidityPercentage = 75.0;
            this.simReading.windSpeedKph = 12.0;
            this.simReading.precipitationMm = 0.0;
            this.simReading.soilMoisturePercentage = 42.0;
            this.loadAll();
        });
    }

    submitConfig(): void {
        if (!this.newConfig.fieldId || !this.newConfig.alertEmail) return;
        this.weatherService.configureFrostAlert(this.newConfig).subscribe(() => {
            this.newConfig = {
                fieldId: '',
                temperatureThreshold: 2.0,
                alertEmail: '',
                isAlertActive: true
            };
            this.loadAll();
        });
    }

    submitBilling(): void {
        if (this.newBilling.subscriptionFee <= 0 || !this.newBilling.billingDate) return;
        const payload = {
            ...this.newBilling,
            billingDate: new Date(this.newBilling.billingDate).toISOString()
        };
        this.weatherService.processSubscriptionBill(payload).subscribe(() => {
            this.newBilling = {
                subscriptionFee: 75,
                billingDate: new Date().toISOString().split('T')[0]
            };
            this.loadAll();
        });
    }
}
