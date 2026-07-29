import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../libs/core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="login-container">
      <div class="glass-card login-card">
        <div class="login-header">
          <div class="app-logo">🌾</div>
          <h2>AgriERP Enterprise</h2>
          <p>Sign in to access Agribusiness Command Center</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="admin@email.com" />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="••••••••" />
          </div>

          <button type="submit" class="btn-primary btn-login" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Authenticating...' : 'Sign In to Dashboard' }}
          </button>
        </form>
        
        <div class="error-message" *ngIf="errorMessage">
          ⚠️ {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container { 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      min-height: 100vh; 
      background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%); 
      font-family: var(--font-sans); 
    }
    .login-card { 
      width: 100%; 
      max-width: 420px; 
      padding: 36px 32px; 
    }
    .login-header { 
      text-align: center; 
      margin-bottom: 28px; 
      .app-logo { font-size: 40px; margin-bottom: 8px; }
      h2 { font-family: var(--font-heading); font-size: 24px; color: #ffffff; margin: 0 0 6px 0; }
      p { color: var(--text-muted); font-size: 13.5px; margin: 0; }
    }
    .form-group { 
      margin-bottom: 20px; 
      label { display: block; margin-bottom: 6px; color: var(--text-muted); font-size: 13px; font-weight: 600; }
      .form-control { 
        width: 100%; 
        padding: 12px 14px; 
        background: var(--bg-dark-slate); 
        border: 1px solid var(--border-glass); 
        border-radius: 10px; 
        color: #ffffff; 
        font-size: 14px; 
        outline: none; 
        transition: border-color 0.2s; 
        &:focus { border-color: var(--primary-emerald); box-shadow: 0 0 0 3px var(--primary-emerald-glow); }
      }
    }
    .btn-login { 
      width: 100%; 
      justify-content: center; 
      padding: 14px; 
      font-size: 15px; 
      margin-top: 8px; 
    }
    .error-message { 
      color: #f43f5e; 
      background: rgba(244, 63, 94, 0.12); 
      border: 1px solid rgba(244, 63, 94, 0.25); 
      padding: 10px; 
      border-radius: 8px; 
      margin-top: 18px; 
      text-align: center; 
      font-size: 13px; 
      font-weight: 500; 
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        email: ['admin@email.com', [Validators.required, Validators.email]],
        password: ['admin123', [Validators.required]]
    });

    isLoading = false;
    errorMessage = '';

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.authService.loadPermissions().subscribe(() => {
                        this.router.navigate(['/dashboard']);
                    });
                },
                error: (err) => {
                    this.isLoading = false;
                    this.errorMessage = 'Invalid email or password. Please try again.';
                    console.error(err);
                }
            });
        }
    }
}