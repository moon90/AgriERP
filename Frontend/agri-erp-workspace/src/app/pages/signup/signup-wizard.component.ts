import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../libs/core/services/auth.service';

@Component({
    selector: 'app-signup-wizard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div style="min-height: 100vh; background: #061a12; color: #f0fdf4; font-family: var(--font-sans); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; position: relative; overflow: hidden;">
      
      <!-- Botanical Background Glow Orbs -->
      <div style="position: absolute; top: -50px; left: 20%; width: 450px; height: 450px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); pointer-events: none; filter: blur(50px);"></div>
      <div style="position: absolute; bottom: -50px; right: 20%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(4, 120, 87, 0.2) 0%, transparent 70%); pointer-events: none; filter: blur(60px);"></div>

      <!-- Main Card Container -->
      <div style="width: 100%; max-width: 680px; background: rgba(10, 35, 24, 0.85); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 24px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7); backdrop-filter: blur(24px); padding: 2.5rem; position: relative; z-index: 10;">
        
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 2rem;">
          <div style="width: 50px; height: 50px; border-radius: 14px; background: linear-gradient(135deg, #10b981, #064e3b); display: inline-flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); margin-bottom: 0.75rem;">
            🌾
          </div>
          <h2 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: #ffffff; margin: 0;">
            Start Your 14-Day Free Farm Trial
          </h2>
          <p style="color: #a7f3d0; font-size: 0.9rem; margin: 0.35rem 0 0 0;">
            No credit card required up front. Instant multi-tenant farm provisioning.
          </p>
        </div>

        <!-- Step Progress Indicator -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; position: relative;">
          <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 2px; background: rgba(52, 211, 153, 0.2); z-index: 1;"></div>
          
          <div [style.background]="step >= 1 ? '#10b981' : 'rgba(10, 35, 24, 0.9)'"
               [style.color]="step >= 1 ? '#061a12' : '#86efac'"
               style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; position: relative; z-index: 2;">
            1
          </div>
          
          <div [style.background]="step >= 2 ? '#10b981' : 'rgba(10, 35, 24, 0.9)'"
               [style.color]="step >= 2 ? '#061a12' : '#86efac'"
               style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; position: relative; z-index: 2;">
            2
          </div>
          
          <div [style.background]="step >= 3 ? '#10b981' : 'rgba(10, 35, 24, 0.9)'"
               [style.color]="step >= 3 ? '#061a12' : '#86efac'"
               style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid #10b981; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; position: relative; z-index: 2;">
            3
          </div>
        </div>

        <!-- Step 1: Farm Account & Identity -->
        <div *ngIf="step === 1">
          <h3 style="font-size: 1.15rem; color: #ffffff; margin: 0 0 1.25rem 0;">1. Farm Entity & Organization</h3>
          
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Farm / Holding Name</label>
              <input type="text" [(ngModel)]="formData.farmName" placeholder="e.g. Green Valley Organic Estate" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Country / Region</label>
                <input type="text" [(ngModel)]="formData.country" placeholder="e.g. Czech Republic / Global" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Default Currency</label>
                <select [(ngModel)]="formData.currency" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;">
                  <option value="EUR">EUR (€) — Europe</option>
                  <option value="USD">USD ($) — International</option>
                  <option value="BDT">BDT (৳) — Bangladesh</option>
                </select>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 2rem;">
            <button (click)="nextStep()" class="btn-primary" style="padding: 12px 28px; font-size: 0.95rem;">
              Next: Operational Scope ➔
            </button>
          </div>
        </div>

        <!-- Step 2: Primary Scope -->
        <div *ngIf="step === 2">
          <h3 style="font-size: 1.15rem; color: #ffffff; margin: 0 0 1.25rem 0;">2. Choose Your Primary Operational Scope</h3>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            
            <div (click)="formData.scope = 'crops'"
                 [style.border]="formData.scope === 'crops' ? '2px solid #10b981' : '1px solid rgba(52, 211, 153, 0.2)'"
                 [style.background]="formData.scope === 'crops' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 26, 18, 0.6)'"
                 style="padding: 1.25rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.2s;">
              <span style="font-size: 2rem;">🌾</span>
              <div>
                <strong style="color: #ffffff; font-size: 1rem; display: block;">Crops, Agronomy & Soil Diagnostics</strong>
                <span style="font-size: 0.8rem; color: #a7f3d0;">Field plots, NPK soil tests, chemical spray logs, harvest forecasts.</span>
              </div>
            </div>

            <div (click)="formData.scope = 'livestock'"
                 [style.border]="formData.scope === 'livestock' ? '2px solid #10b981' : '1px solid rgba(52, 211, 153, 0.2)'"
                 [style.background]="formData.scope === 'livestock' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 26, 18, 0.6)'"
                 style="padding: 1.25rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.2s;">
              <span style="font-size: 2rem;">🐄</span>
              <div>
                <strong style="color: #ffffff; font-size: 1rem; display: block;">Dairy, Cattle & Veterinary Breeding</strong>
                <span style="font-size: 0.8rem; color: #a7f3d0;">Vaccination boosters, 283-day gestation calendar, milk yields.</span>
              </div>
            </div>

            <div (click)="formData.scope = 'full'"
                 [style.border]="formData.scope === 'full' ? '2px solid #10b981' : '1px solid rgba(52, 211, 153, 0.2)'"
                 [style.background]="formData.scope === 'full' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 26, 18, 0.6)'"
                 style="padding: 1.25rem; border-radius: 14px; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.2s;">
              <span style="font-size: 2rem;">🚜</span>
              <div>
                <strong style="color: #ffffff; font-size: 1rem; display: block;">Full Commercial Enterprise Suite</strong>
                <span style="font-size: 0.8rem; color: #a7f3d0;">All 15 modules: IoT telemetry, trading, logistics, PWA offline sync.</span>
              </div>
            </div>

          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button (click)="step = 1" class="btn-secondary" style="padding: 12px 24px;">
              ⬅ Back
            </button>
            <button (click)="nextStep()" class="btn-primary" style="padding: 12px 28px;">
              Next: Select Plan ➔
            </button>
          </div>
        </div>

        <!-- Step 3: Admin Credentials & Complete -->
        <div *ngIf="step === 3">
          <h3 style="font-size: 1.15rem; color: #ffffff; margin: 0 0 1.25rem 0;">3. Administrator & 14-Day Free Access</h3>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Admin Full Name</label>
              <input type="text" [(ngModel)]="formData.adminName" placeholder="e.g. Farm Operations Director" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Work Email</label>
              <input type="email" [(ngModel)]="formData.email" placeholder="admin@myfarm.com" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; color: #86efac; margin-bottom: 0.35rem;">Password</label>
              <input type="password" [(ngModel)]="formData.password" placeholder="••••••••" style="width: 100%; padding: 12px; background: #061a12; border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 10px; color: #ffffff; font-size: 0.95rem;" />
            </div>
          </div>

          <div style="margin-top: 1.5rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px; padding: 12px; display: flex; align-items: center; gap: 10px;">
            <span>🎁</span>
            <span style="font-size: 0.85rem; color: #34d399; font-weight: 600;">
              Your 14-day Commercial Pro trial is fully activated upon sign-in.
            </span>
          </div>

          <div style="display: flex; justify-content: space-between; margin-top: 2rem;">
            <button (click)="step = 2" class="btn-secondary" style="padding: 12px 24px;">
              ⬅ Back
            </button>
            <button (click)="completeSignup()" [disabled]="isLoading" class="btn-primary" style="padding: 12px 32px;">
              {{ isLoading ? 'Provisioning Farm...' : '🚀 Launch My Farm ERP' }}
            </button>
          </div>
        </div>

      </div>

    </div>
  `
})
export class SignupWizardComponent {
    router = inject(Router);
    authService = inject(AuthService);

    step = 1;
    isLoading = false;

    formData = {
        farmName: 'Sunrise Agro & Livestock Ltd',
        country: 'Czech Republic / Global',
        currency: 'EUR',
        scope: 'full',
        adminName: 'Lead Farm Administrator',
        email: 'admin@sunrise-agro.com',
        password: 'Password123!'
    };

    nextStep(): void {
        if (this.step === 1 && !this.formData.farmName) {
            alert('Please enter your Farm or Holding Name.');
            return;
        }
        this.step++;
    }

    completeSignup(): void {
        this.isLoading = true;

        setTimeout(() => {
            // Save tenant identity & seed profile
            localStorage.setItem('tenant_id', '11111111-1111-1111-1111-111111111111');
            localStorage.setItem('tenant_name', this.formData.farmName);
            localStorage.setItem('jwt_token', 'demo_token_authenticated');
            localStorage.setItem('user_email', this.formData.email);
            localStorage.setItem('user_name', this.formData.adminName);

            this.isLoading = false;
            this.router.navigate(['/dashboard']);
        }, 1200);
    }
}
