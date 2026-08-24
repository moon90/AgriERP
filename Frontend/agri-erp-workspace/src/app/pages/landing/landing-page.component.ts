import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div style="min-height: 100vh; background: #061a12; color: #f0fdf4; font-family: var(--font-sans); overflow-x: hidden; position: relative;">
      
      <!-- Ambient Botanical Glow Background Orbs -->
      <div style="position: absolute; top: -100px; left: 10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%); pointer-events: none; filter: blur(50px);"></div>
      <div style="position: absolute; top: 400px; right: 5%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(4, 120, 87, 0.15) 0%, transparent 70%); pointer-events: none; filter: blur(60px);"></div>

      <!-- Top Navigation Bar -->
      <header style="max-width: 1280px; margin: 0 auto; padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 10;">
        <div style="display: flex; align-items: center; gap: 12px; cursor: pointer;" (click)="router.navigate(['/'])">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #10b981, #064e3b); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);">
            🌾
          </div>
          <div>
            <div style="font-family: var(--font-heading); font-weight: 800; font-size: 1.4rem; color: #ffffff; letter-spacing: -0.5px;">AgriERP</div>
            <div style="font-size: 0.7rem; color: #34d399; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Lush Enterprise Ag-Tech</div>
          </div>
        </div>

        <nav style="display: flex; gap: 2rem; align-items: center;" class="hide-mobile">
          <a href="#features" style="color: #a7f3d0; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s;">Features</a>
          <a href="#roi" style="color: #a7f3d0; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s;">ROI Calculator</a>
          <a href="#pricing" style="color: #a7f3d0; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s;">Pricing</a>
        </nav>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button (click)="router.navigate(['/login'])"
                  style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); color: #6ee7b7; padding: 8px 18px; border-radius: 10px; font-weight: 600; font-size: 0.9rem; cursor: pointer; backdrop-filter: blur(8px);">
            Sign In
          </button>
          <button (click)="router.navigate(['/signup'])"
                  style="background: linear-gradient(135deg, #10b981, #059669); border: none; color: #061a12; padding: 8px 22px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); transition: transform 0.2s;">
            🌱 Start Free Trial
          </button>
        </div>
      </header>

      <!-- Hero Section -->
      <section style="max-width: 1280px; margin: 3rem auto 5rem auto; padding: 0 2rem; text-align: center; position: relative; z-index: 10;">
        
        <!-- Live Tag Badge -->
        <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(52, 211, 153, 0.3); padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; color: #34d399; margin-bottom: 1.5rem; backdrop-filter: blur(10px);">
          <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; animation: pulse 2s infinite;"></span>
          The Commercial Operating System for High-Yield Crops & Livestock
        </div>

        <h1 style="font-family: var(--font-heading); font-size: clamp(2.5rem, 5vw, 4.2rem); font-weight: 800; color: #ffffff; line-height: 1.15; max-width: 950px; margin: 0 auto 1.5rem auto; letter-spacing: -1px;">
          Empower Your Acreage with <span style="background: linear-gradient(135deg, #34d399, #10b981, #84cc16); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Lush Ag-Tech Intelligence</span>
        </h1>

        <p style="font-size: clamp(1.05rem, 2vw, 1.25rem); color: #a7f3d0; max-width: 750px; margin: 0 auto 2.5rem auto; line-height: 1.6;">
          Real-time IoT environmental telemetry, automated 283-day cattle gestation workflows, and PWA offline sync for field scouts. Engineered for progressive growers and ranch holdings worldwide.
        </p>

        <!-- CTA Action Buttons -->
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 3.5rem;">
          <button (click)="router.navigate(['/signup'])"
                  style="background: linear-gradient(135deg, #10b981 0%, #047857 100%); color: #061a12; font-weight: 800; font-size: 1.05rem; padding: 14px 32px; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35); transition: transform 0.2s;">
            🚀 Start 14-Day Free Trial
          </button>
          
          <button (click)="router.navigate(['/dashboard'])"
                  style="background: rgba(10, 35, 24, 0.8); color: #6ee7b7; font-weight: 700; font-size: 1.05rem; padding: 14px 28px; border-radius: 12px; border: 1px solid rgba(52, 211, 153, 0.3); cursor: pointer; backdrop-filter: blur(12px);">
            ⚡ Explore Live Demo Sandbox
          </button>
        </div>

        <!-- Glassmorphic Dashboard Preview Card -->
        <div style="background: rgba(10, 35, 24, 0.7); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 20px; padding: 1.5rem; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6); backdrop-filter: blur(20px); text-align: left; max-width: 1100px; margin: 0 auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(52, 211, 153, 0.15); padding-bottom: 1rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 12px; height: 12px; border-radius: 50%; background: #f43f5e; display: inline-block;"></span>
              <span style="width: 12px; height: 12px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span style="width: 12px; height: 12px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
              <span style="font-size: 0.85rem; color: #6ee7b7; margin-left: 12px; font-weight: 600;">🌾 Live Agricultural Mesh • Green Valley Estate</span>
            </div>
            <span class="badge-pill badge-emerald" style="font-size: 0.75rem;">🟢 Live SignalR Stream</span>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <div style="background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 12px; padding: 1rem; border-left: 4px solid #10b981;">
              <div style="font-size: 0.75rem; color: #86efac; text-transform: uppercase; font-weight: 700;">Soil Moisture</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 4px 0;">44.2%</div>
              <div style="font-size: 0.75rem; color: #34d399;">💧 Optimal Field Plot 4</div>
            </div>

            <div style="background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 12px; padding: 1rem; border-left: 4px solid #38bdf8;">
              <div style="font-size: 0.75rem; color: #86efac; text-transform: uppercase; font-weight: 700;">Greenhouse Climate</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 4px 0;">24.5°C</div>
              <div style="font-size: 0.75rem; color: #38bdf8;">🌡️ Sub-Zero Alert Safe</div>
            </div>

            <div style="background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 12px; padding: 1rem; border-left: 4px solid #f59e0b;">
              <div style="font-size: 0.75rem; color: #86efac; text-transform: uppercase; font-weight: 700;">Active Gestations</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 4px 0;">18 Cows</div>
              <div style="font-size: 0.75rem; color: #f59e0b;">🐄 283-Day Countdown</div>
            </div>

            <div style="background: rgba(6, 26, 18, 0.8); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 12px; padding: 1rem; border-left: 4px solid #a855f7;">
              <div style="font-size: 0.75rem; color: #86efac; text-transform: uppercase; font-weight: 700;">Offline PWA Outbox</div>
              <div style="font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 4px 0;">Synced</div>
              <div style="font-size: 0.75rem; color: #a855f7;">📱 Remote Soil Tests Logged</div>
            </div>
          </div>
        </div>

      </section>

      <!-- Key Capabilities Grid -->
      <section id="features" style="max-width: 1280px; margin: 6rem auto; padding: 0 2rem; position: relative; z-index: 10;">
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 2.4rem; color: #ffffff; margin-bottom: 0.75rem;">Full-Spectrum Precision Farm Management</h2>
          <p style="color: #a7f3d0; font-size: 1.1rem; max-width: 650px; margin: 0 auto;">Everything you need to optimize harvest yields, protect herd biosecurity, and maintain financial margins.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
          
          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              🌾
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">Crops, Agronomy & Soil NPK</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Diagnose soil chemistry profiles, map customized fertilizer application advisory plans, and enforce chemical REI/PHI harvest safety restrictions.</p>
          </div>

          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(56, 189, 248, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              💉
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">Veterinary & 283-Day Breeding</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Automated booster alerts for Anthrax/FMD, pregnancy ultrasound diagnosis logs, gestation countdowns, and newborn calf delivery registration.</p>
          </div>

          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(245, 158, 11, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              📱
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">Mobile PWA Offline Sync</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Log soil samples and crop scouting notes in remote fields with zero cell tower coverage. Automatic background replay upon reconnecting.</p>
          </div>

          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(168, 85, 247, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              📡
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">Real-Time IoT WebSockets</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Sub-second edge sensor ingestion for soil moisture probes, greenhouse CO2 density, cattle heart rate collars, and solar battery banks.</p>
          </div>

          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              🏢
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">Multi-Tenant Farm Switcher</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Manage multiple distinct farm estates, subsidiaries, and corporate holding branches with cryptographic row-level data isolation.</p>
          </div>

          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 16px; padding: 2rem; backdrop-filter: blur(14px);">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(244, 63, 94, 0.2); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.25rem;">
              📊
            </div>
            <h3 style="color: #ffffff; font-size: 1.3rem; margin: 0 0 0.5rem 0;">General Ledger & Grain Trading</h3>
            <p style="color: #a7f3d0; font-size: 0.95rem; line-height: 1.5; margin: 0;">Automated double-entry journal vouchers, grain weighbridge ticket settlements, and forward futures contract short hedging.</p>
          </div>

        </div>
      </section>

      <!-- Interactive Farm ROI Calculator -->
      <section id="roi" style="max-width: 900px; margin: 6rem auto; padding: 2.5rem; background: rgba(10, 35, 24, 0.85); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); backdrop-filter: blur(20px); position: relative; z-index: 10;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-heading); font-size: 2.2rem; color: #ffffff; margin: 0 0 0.5rem 0;">🌾 Calculate Your Farm's Annual ROI</h2>
          <p style="color: #a7f3d0; font-size: 1rem;">Estimate the labor hours saved and fertilizer waste prevented with AgriERP.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
          <div>
            <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #86efac; margin-bottom: 0.5rem;">
              Cultivated Acreage: <strong style="color: #ffffff; font-size: 1.1rem;">{{ farmAcres }} Acres</strong>
            </label>
            <input type="range" [(ngModel)]="farmAcres" min="100" max="10000" step="100" style="width: 100%; accent-color: #10b981;" />
            
            <label style="display: block; font-size: 0.9rem; font-weight: 600; color: #86efac; margin: 1.5rem 0 0.5rem 0;">
              Livestock Head Count: <strong style="color: #ffffff; font-size: 1.1rem;">{{ herdCount }} Head</strong>
            </label>
            <input type="range" [(ngModel)]="herdCount" min="0" max="2500" step="50" style="width: 100%; accent-color: #10b981;" />
          </div>

          <div style="background: rgba(6, 26, 18, 0.9); border: 1px solid rgba(52, 211, 153, 0.25); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; justify-content: center;">
            <div style="font-size: 0.85rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700;">Estimated Annual Savings</div>
            <div style="font-size: 2.5rem; font-weight: 800; color: #34d399; margin: 0.5rem 0;">
              {{ (farmAcres * 14.5 + herdCount * 32) | currency:'USD':'symbol':'1.0-0' }}
            </div>
            <div style="font-size: 0.85rem; color: #86efac;">
              ⏱️ ~{{ (farmAcres * 0.4 + herdCount * 0.8) | number:'1.0-0' }} hours of manual administrative labor eliminated per year.
            </div>
          </div>
        </div>

        <div style="text-align: center;">
          <button (click)="router.navigate(['/signup'])" class="btn-primary" style="padding: 12px 30px; font-size: 1rem;">
            🌱 Claim Your Savings — Start 14-Day Trial
          </button>
        </div>
      </section>

      <!-- Multi-Currency Pricing Grid -->
      <section id="pricing" style="max-width: 1280px; margin: 6rem auto; padding: 0 2rem; position: relative; z-index: 10;">
        <div style="text-align: center; margin-bottom: 3.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 2.4rem; color: #ffffff; margin: 0 0 0.5rem 0;">Transparent Global Farm Pricing</h2>
          <p style="color: #a7f3d0; font-size: 1.1rem; margin: 0 0 1.5rem 0;">Choose the plan tailored to your operational acreage and livestock capacity.</p>

          <!-- Currency Selector -->
          <div style="display: inline-flex; gap: 6px; background: rgba(10, 35, 24, 0.8); padding: 4px; border-radius: 10px; border: 1px solid rgba(52, 211, 153, 0.3);">
            <button (click)="currency = 'USD'" [style.background]="currency === 'USD' ? '#10b981' : 'transparent'" [style.color]="currency === 'USD' ? '#061a12' : '#a7f3d0'" style="padding: 6px 16px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer;">USD ($)</button>
            <button (click)="currency = 'EUR'" [style.background]="currency === 'EUR' ? '#10b981' : 'transparent'" [style.color]="currency === 'EUR' ? '#061a12' : '#a7f3d0'" style="padding: 6px 16px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer;">EUR (€)</button>
            <button (click)="currency = 'BDT'" [style.background]="currency === 'BDT' ? '#10b981' : 'transparent'" [style.color]="currency === 'BDT' ? '#061a12' : '#a7f3d0'" style="padding: 6px 16px; border-radius: 8px; border: none; font-weight: 700; cursor: pointer;">BDT (৳)</button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1100px; margin: 0 auto;">
          
          <!-- Starter Tier -->
          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.4rem; margin: 0 0 0.5rem 0;">🌱 Starter Farm</h3>
              <p style="color: #a7f3d0; font-size: 0.85rem; margin-bottom: 1.5rem;">For boutique growers and single-plot farms.</p>
              <div style="font-size: 2.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1.5rem;">
                {{ getPrice(199) }} <span style="font-size: 1rem; color: #a7f3d0; font-weight: 500;">/ month</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: #f0fdf4;">
                <li>✅ Up to 500 Acres / 150 Head</li>
                <li>✅ Core Crops & Field Inventory</li>
                <li>✅ Soil Chemistry & NPK Advisory</li>
                <li>✅ Single Farm Organization</li>
                <li>✅ Email & Community Support</li>
              </ul>
            </div>
            <button (click)="router.navigate(['/signup'])" class="btn-secondary" style="width: 100%; justify-content: center; padding: 12px;">
              Start 14-Day Trial
            </button>
          </div>

          <!-- Commercial Pro Tier (Featured) -->
          <div style="background: rgba(10, 35, 24, 0.9); border: 2px solid #10b981; border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 0 35px rgba(16, 185, 129, 0.25); position: relative;">
            <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: #10b981; color: #061a12; padding: 4px 16px; border-radius: 9999px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase;">
              Most Popular
            </div>
            <div>
              <h3 style="color: #ffffff; font-size: 1.4rem; margin: 0 0 0.5rem 0;">🚜 Commercial Pro</h3>
              <p style="color: #a7f3d0; font-size: 0.85rem; margin-bottom: 1.5rem;">For commercial agribusinesses & livestock feedlots.</p>
              <div style="font-size: 2.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1.5rem;">
                {{ getPrice(599) }} <span style="font-size: 1rem; color: #a7f3d0; font-weight: 500;">/ month</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: #f0fdf4;">
                <li>✅ Up to 5,000 Acres / 1,500 Head</li>
                <li>✅ Automated Veterinary & 283-Day Breeding</li>
                <li>✅ Grain Weighbridge & Logistics Scale</li>
                <li>✅ PWA Offline Field Sync Outbox</li>
                <li>✅ 5 Team Seats & Priority Support</li>
              </ul>
            </div>
            <button (click)="router.navigate(['/signup'])" class="btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
              Start 14-Day Trial
            </button>
          </div>

          <!-- Enterprise Tier -->
          <div style="background: rgba(10, 35, 24, 0.75); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: 20px; padding: 2rem; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <h3 style="color: #ffffff; font-size: 1.4rem; margin: 0 0 0.5rem 0;">🏢 Enterprise Ag-Holding</h3>
              <p style="color: #a7f3d0; font-size: 0.85rem; margin-bottom: 1.5rem;">For multi-subsidiary agricultural holding groups.</p>
              <div style="font-size: 2.5rem; font-weight: 800; color: #ffffff; margin-bottom: 1.5rem;">
                {{ getPrice(1499) }} <span style="font-size: 1rem; color: #a7f3d0; font-weight: 500;">/ month</span>
              </div>
              <ul style="list-style: none; padding: 0; margin: 0 0 2rem 0; display: flex; flex-direction: column; gap: 0.75rem; font-size: 0.9rem; color: #f0fdf4;">
                <li>✅ Unlimited Acreage & Livestock Headcount</li>
                <li>✅ Multi-Tenant Enterprise Switcher</li>
                <li>✅ Sub-Second Live SignalR IoT Mesh</li>
                <li>✅ Futures Trading & Hedging Board</li>
                <li>✅ Dedicated SLA & Enterprise Account Manager</li>
              </ul>
            </div>
            <button (click)="router.navigate(['/signup'])" class="btn-secondary" style="width: 100%; justify-content: center; padding: 12px;">
              Contact Enterprise Sales
            </button>
          </div>

        </div>
      </section>

      <!-- Footer -->
      <footer style="border-top: 1px solid rgba(52, 211, 153, 0.15); padding: 3rem 2rem; text-align: center; color: #86efac; font-size: 0.85rem; position: relative; z-index: 10;">
        <div style="display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 1rem;">
          <span>🌾</span>
          <strong style="color: #ffffff;">AgriERP Enterprise</strong> — The Global Agriculture & Livestock SaaS Platform
        </div>
        <p style="margin: 0;">© 2026 AgriERP Systems. Operating Globally from Europe & South Asia. All Rights Reserved.</p>
      </footer>

    </div>
  `
})
export class LandingPageComponent {
    router = inject(Router);

    farmAcres = 850;
    herdCount = 200;
    currency: 'USD' | 'EUR' | 'BDT' = 'USD';

    getPrice(usdAmount: number): string {
        if (this.currency === 'EUR') {
            return `€${Math.round(usdAmount * 0.92)}`;
        }
        if (this.currency === 'BDT') {
            return `৳${(usdAmount * 115).toLocaleString()}`;
        }
        return `$${usdAmount}`;
    }
}
