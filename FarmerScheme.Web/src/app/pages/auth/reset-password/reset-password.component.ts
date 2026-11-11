import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Set New Password</h2>
          <p class="mt-2 text-sm text-slate-500">Provide the reset token and your desired new password.</p>
        </div>

        @if (successMessage) {
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-3">
            <p>{{ successMessage }}</p>
            <a routerLink="/login" class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition">Proceed to Login</a>
          </div>
        } @else {
          @if (errorMessage) {
            <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Reset Token</label>
              <input 
                type="text" 
                formControlName="token" 
                placeholder="Paste the reset token here"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">New Password</label>
              <input 
                type="password" 
                formControlName="newPassword" 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <p class="text-slate-400 text-[11px] mt-1">Minimum 6 characters</p>
            </div>

            <button 
              type="submit" 
              [disabled]="resetForm.invalid || isLoading"
              class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              @if (isLoading) {
                <span>Updating Password...</span>
              } @else {
                <span>Reset Password</span>
              }
            </button>
          </form>
        }

        <div class="text-center pt-2">
          <a routerLink="/login" class="text-xs text-slate-500 hover:text-slate-900">Back to Sign In</a>
        </div>

      </div>
    </div>
  `
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      token: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Password reset successfully! You can now log in with your new password.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid or expired token. Please try again.';
      }
    });
  }
}
