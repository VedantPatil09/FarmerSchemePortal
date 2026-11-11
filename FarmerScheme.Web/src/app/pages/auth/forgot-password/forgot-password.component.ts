import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h2>
          <p class="mt-2 text-sm text-slate-500">Enter your registered email address to receive password reset instructions.</p>
        </div>

        @if (successMessage) {
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm space-y-3">
            <p>{{ successMessage }}</p>
            <p class="text-xs text-slate-500">In this development version, check your backend server terminal output for the generated reset token.</p>
            <a routerLink="/reset-password" class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition">Enter Reset Token</a>
          </div>
        } @else {
          @if (errorMessage) {
            <div class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {{ errorMessage }}
            </div>
          }

          <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email Address</label>
              <input 
                type="email" 
                formControlName="email" 
                placeholder="e.g. farmer@gmail.com"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <button 
              type="submit" 
              [disabled]="forgotForm.invalid || isLoading"
              class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              @if (isLoading) {
                <span>Sending Request...</span>
              } @else {
                <span>Generate Reset Instructions</span>
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.forgotPassword(this.forgotForm.value.email).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'If an account exists with this email, reset instructions have been generated.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error processing request.';
      }
    });
  }
}
