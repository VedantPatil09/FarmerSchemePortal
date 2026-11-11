import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          
          <!-- Logo & Brand -->
          <div class="flex items-center space-x-3">
            <a routerLink="/" class="flex items-center space-x-2.5 group">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span class="text-xl font-bold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">KisanSetu</span>
                <span class="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Farmer Scheme</span>
              </div>
            </a>

            <!-- Public / Common Links -->
            <nav class="hidden md:flex ml-8 space-x-1">
              <a routerLink="/" routerLinkActive="bg-emerald-50 text-emerald-700 font-semibold" [routerLinkActiveOptions]="{exact: true}" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Home</a>
              <a routerLink="/open-auctions" routerLinkActive="bg-emerald-50 text-emerald-700 font-semibold" class="px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">Open Auctions</a>
            </nav>
          </div>

          <!-- User Navigation / Actions -->
          <div class="flex items-center space-x-3">
            @if (authService.isAuthenticated()) {
              <!-- Role Portal Navigation -->
              @if (authService.isFarmer()) {
                <a routerLink="/farmer" class="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm">Farmer Portal</a>
              }
              @if (authService.isBidder()) {
                <a routerLink="/bidder" class="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 transition shadow-sm">Bidding Portal</a>
              }
              @if (authService.isAdmin()) {
                <a routerLink="/admin" class="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">Admin Dashboard</a>
              }

              <!-- User Badge & Logout -->
              <div class="flex items-center pl-3 border-l border-slate-200 space-x-2">
                <div class="text-right hidden sm:block">
                  <div class="text-xs font-semibold text-slate-900 truncate max-w-[140px]">{{ authService.currentUser()?.email }}</div>
                  <div class="text-[11px] text-emerald-600 font-medium capitalize">{{ authService.userRole() }}</div>
                </div>
                <button (click)="logout()" title="Logout" class="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            } @else {
              <!-- Unauthenticated State -->
              <a routerLink="/login" class="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg transition">Sign In</a>
              <a routerLink="/register" class="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20">Register</a>
            }
          </div>

        </div>
      </div>
    </header>
  `
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
