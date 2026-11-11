import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="md:col-span-2">
            <div class="flex items-center space-x-2.5 mb-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span class="text-lg font-bold text-white">KisanSetu Farmer Scheme</span>
            </div>
            <p class="text-sm text-slate-400 max-w-md">Empowering Indian farmers with transparent crop auctions, comprehensive insurance protection, direct market bidding, and AI-powered agronomy advisory.</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Portal Services</h4>
            <ul class="space-y-2 text-sm">
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Crop Registration</span></li>
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Live Bidding Marketplace</span></li>
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Crop Insurance & Claims</span></li>
              <li><span class="hover:text-emerald-400 transition cursor-pointer">AI Crop Doctor & Advisor</span></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-white uppercase tracking-wider mb-3">Security & Compliance</h4>
            <ul class="space-y-2 text-sm">
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Admin KYC Verification</span></li>
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Encrypted JWT Authentication</span></li>
              <li><span class="hover:text-emerald-400 transition cursor-pointer">Transparent Price Discovery</span></li>
            </ul>
          </div>
        </div>
        <div class="pt-8 border-t border-slate-800 text-xs text-center text-slate-500">
          © 2026 KisanSetu Farmer Scheme Portal. Designed for modern agricultural empowerment.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
