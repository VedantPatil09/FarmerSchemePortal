import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-lg w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        <!-- Header -->
        <div class="text-center">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Create your Account</h2>
          <p class="mt-2 text-sm text-slate-500">Register as a Farmer or an Auction Bidder</p>
        </div>

        @if (successMessage) {
          <div class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
            <div class="font-semibold mb-1 flex items-center space-x-2">
              <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Registration Submitted Successfully!</span>
            </div>
            <p>{{ successMessage }}</p>
            <div class="mt-4">
              <a routerLink="/login" class="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition">Proceed to Login</a>
            </div>
          </div>
        } @else {
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
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            
            <!-- Role Selector -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">Select Role</label>
              <div class="grid grid-cols-2 gap-3">
                <label 
                  class="cursor-pointer border rounded-xl p-3 flex items-center space-x-3 transition"
                  [class.border-emerald-500]="registerForm.get('role')?.value === 0"
                  [class.bg-emerald-50]="registerForm.get('role')?.value === 0"
                  [class.border-slate-200]="registerForm.get('role')?.value !== 0"
                >
                  <input type="radio" formControlName="role" [value]="0" class="sr-only">
                  <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">🌾</div>
                  <div>
                    <div class="font-semibold text-xs text-slate-900">Farmer</div>
                    <div class="text-[11px] text-slate-500">Sell crops & insurance</div>
                  </div>
                </label>

                <label 
                  class="cursor-pointer border rounded-xl p-3 flex items-center space-x-3 transition"
                  [class.border-amber-500]="registerForm.get('role')?.value === 1"
                  [class.bg-amber-50]="registerForm.get('role')?.value === 1"
                  [class.border-slate-200]="registerForm.get('role')?.value !== 1"
                >
                  <input type="radio" formControlName="role" [value]="1" class="sr-only">
                  <div class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">💼</div>
                  <div>
                    <div class="font-semibold text-xs text-slate-900">Bidder</div>
                    <div class="text-[11px] text-slate-500">Auction buyer & trader</div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Full Name -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Full Name</label>
              <input 
                type="text" 
                formControlName="fullName" 
                placeholder="e.g. Ramesh Kumar"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>

            <!-- Email & Phone Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Email</label>
                <input 
                  type="email" 
                  formControlName="email" 
                  placeholder="ramesh@gmail.com"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  formControlName="phoneNumber" 
                  placeholder="9876543210"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">Password</label>
              <input 
                type="password" 
                formControlName="password" 
                placeholder="••••••••"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <p class="text-slate-400 text-[11px] mt-1">Minimum 6 characters</p>
            </div>

            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading"
              class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              @if (isLoading) {
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registering Account...</span>
              } @else {
                <span>Complete Registration</span>
              }
            </button>
          </form>

          <div class="pt-4 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-600">
              Already registered? 
              <a routerLink="/login" class="font-semibold text-emerald-600 hover:text-emerald-700 ml-1">Sign In</a>
            </p>
          </div>
        }

      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      role: [0, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Your account has been registered and is pending administrator verification.';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to complete registration. Please try again.';
      }
    });
  }
}
