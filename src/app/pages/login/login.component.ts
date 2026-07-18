/* eslint-disable @angular-eslint/template/prefer-control-flow */
/* eslint-disable @angular-eslint/template/prefer-control-flow */
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
      <div class="login-card">
        <div class="login-header">
          <h2>AgriERP</h2>
          <p>Welcome back! Please enter your details.</p>
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

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid || isLoading">
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
        
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f6f8; font-family: Arial, sans-serif; }
    .login-card { background: white; padding: 2.5rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); width: 100%; max-width: 400px; }
    .login-header { text-align: center; margin-bottom: 2rem; }
    .login-header h2 { color: #2c3e50; font-size: 24px; margin: 0 0 8px 0; }
    .login-header p { color: #7f8c8d; font-size: 14px; margin: 0; }
    .form-group { margin-bottom: 1.5rem; }
    .form-group label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 600; }
    .form-control { width: 100%; padding: 10px 12px; border: 1px solid #dcdde1; border-radius: 6px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s; }
    .form-control:focus { outline: none; border-color: #3498db; }
    .btn-login { width: 100%; padding: 12px; background-color: #27ae60; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; }
    .btn-login:hover:not(:disabled) { background-color: #2ecc71; }
    .btn-login:disabled { background-color: #95a5a6; cursor: not-allowed; }
    .error-message { color: #e74c3c; margin-top: 1rem; text-align: center; font-size: 14px; }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    loginForm: FormGroup = this.fb.group({
        email: ['admin@email.com', [Validators.required, Validators.email]],
        password: ['YourAdminPassword123!', [Validators.required]] // আপনার আসল পাসওয়ার্ডটি এখানে বসাতে পারেন টেস্টিংয়ের জন্য
    });

    isLoading = false;
    errorMessage = '';

    onSubmit() {
        if (this.loginForm.valid) {
            this.isLoading = true;
            this.errorMessage = '';

            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    // লগইন সফল হলে পারমিশন লোড করে ড্যাশবোর্ডে পাঠিয়ে দেওয়া হবে
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