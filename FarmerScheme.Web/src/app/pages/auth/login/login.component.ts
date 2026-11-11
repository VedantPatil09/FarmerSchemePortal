import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RoleType } from '../../../core/models/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <!-- Header -->
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Sign In to KisanSetu</h2>
          <p class="mt-2 text-sm text-slate-500">Access your Farmer, Bidder, or Admin Portal</p>
        </div>

        <!-- Error Alert -->
        @if (errorMessage) {
          <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start space-x-2">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
        }

        <!-- Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-5">
          <div>
            <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Email Address</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="e.g. farmer@gmail.com"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
              [class.border-red-400]="isFieldInvalid('email')"
            />
            @if (isFieldInvalid('email')) {
              <p class="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
            }
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600">Password</label>
              <a routerLink="/forgot-password" class="text-xs font-medium text-emerald-600 hover:text-emerald-700">Forgot password?</a>
            </div>
            <input 
              type="password" 
              formControlName="password" 
              placeholder="••••••••"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
              [class.border-red-400]="isFieldInvalid('password')"
            />
            @if (isFieldInvalid('password')) {
              <p class="text-red-500 text-xs mt-1">Password is required.</p>
            }
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition duration-150 shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            @if (isLoading) {
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Authenticating...</span>
            } @else {
              <span>Sign In</span>
            }
          </button>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center">
          <p class="text-sm text-slate-600">
            Don't have an account? 
            <a routerLink="/register" class="font-semibold text-emerald-600 hover:text-emerald-700 ml-1">Create an account</a>
          </p>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        const role = this.authService.userRole();
        if (role === RoleType.Farmer) {
          this.router.navigate(['/farmer']);
        } else if (role === RoleType.Bidder) {
          this.router.navigate(['/bidder']);
        } else if (role === RoleType.Admin) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password, or account awaiting approval.';
      }
    });
  }
}
