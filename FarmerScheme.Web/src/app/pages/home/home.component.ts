import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SellRequestService } from '../../core/services/sell-request.service';
import { AuthService } from '../../core/services/auth.service';
import { OpenAuctionItem } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-16 pb-16">
      
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div class="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <span>✨ India's Unified Agriculture Portal</span>
          </div>

          <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Fair Prices for Farmers. <br/>
            <span class="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">Direct Auctions & Crop Security.</span>
          </h1>

          <p class="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            Eliminating middlemen through transparent live crop bidding, comprehensive crop insurance coverage, prompt disaster claims, and instant AI crop advisory.
          </p>

          <div class="flex flex-wrap justify-center gap-4 pt-4">
            @if (authService.isAuthenticated()) {
              @if (authService.isFarmer()) {
                <a routerLink="/farmer" class="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25">Go to Farmer Portal →</a>
              }
              @if (authService.isBidder()) {
                <a routerLink="/bidder" class="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/25">Go to Bidding Portal →</a>
              }
              @if (authService.isAdmin()) {
                <a routerLink="/admin" class="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm transition shadow-lg shadow-indigo-500/25">Open Admin Dashboard →</a>
              }
            } @else {
              <a routerLink="/register" class="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/25">Join as Farmer / Bidder</a>
              <a routerLink="/login" class="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition backdrop-blur-sm border border-white/20">Sign In to Account</a>
            }
            <a routerLink="/open-auctions" class="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-300 font-semibold text-sm transition border border-emerald-500/30">View Live Auctions 🌾</a>
          </div>
        </div>
      </section>

      <!-- Key Pillars -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900">Everything for the Agricultural Ecosystem</h2>
          <p class="mt-2 text-slate-500 text-sm">Designed specifically to protect farmers' livelihoods and ensure transparent trade.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-4 font-bold">🌾</div>
            <h3 class="text-base font-bold text-slate-900 mb-2">Crop Marketplace</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Farmers list verified produce with base pricing. Certified traders bid live, ensuring competitive price discovery.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-4 font-bold">🛡️</div>
            <h3 class="text-base font-bold text-slate-900 mb-2">Crop Insurance</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Integrated scheme premium calculator for Kharif, Rabi, and Summer seasons with direct policy issuance.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl mb-4 font-bold">🤖</div>
            <h3 class="text-base font-bold text-slate-900 mb-2">AI Agronomist</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Instant advice on soil nutrients, pest defense, irrigation, and weather risk customized to your crop location.</p>
          </div>

          <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-4 font-bold">📄</div>
            <h3 class="text-base font-bold text-slate-900 mb-2">Damage Claims</h3>
            <p class="text-xs text-slate-500 leading-relaxed">Submit damage proofs online during unseasonal rains, drought, or pest outbreaks with fast administrative approval.</p>
          </div>

        </div>
      </section>

      <!-- Live Auctions Preview -->
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-end mb-6">
          <div>
            <div class="inline-flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full mb-1 border border-emerald-200">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Market</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">Current Open Auctions</h2>
          </div>
          <a routerLink="/open-auctions" class="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View All →</a>
        </div>

        @if (isLoading) {
          <div class="py-12 text-center text-slate-400">Loading active crop auctions...</div>
        } @else if (openAuctions.length === 0) {
          <div class="bg-white rounded-2xl p-8 border border-slate-200 text-center">
            <div class="text-3xl mb-2">🚜</div>
            <h3 class="font-semibold text-slate-700">No active auctions at the moment</h3>
            <p class="text-xs text-slate-400 mt-1">Farmers can create crop sell requests from the Farmer Portal.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (item of openAuctions.slice(0, 3); track item.sellRequestId) {
              <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-emerald-500/50 transition">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-lg font-bold text-slate-900">{{ item.cropName }}</h3>
                    <span class="text-xs text-slate-400">Auction #{{ item.sellRequestId }}</span>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
                </div>

                <div class="space-y-2 mb-6">
                  <div class="flex justify-between text-xs">
                    <span class="text-slate-500">Quantity:</span>
                    <span class="font-semibold text-slate-800">{{ item.quantity }} Quintals</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-slate-500">Base Price:</span>
                    <span class="font-semibold text-slate-800">₹{{ item.basePrice | number }}</span>
                  </div>
                  <div class="flex justify-between text-xs pt-2 border-t border-slate-100">
                    <span class="text-slate-500">Current Highest Bid:</span>
                    <span class="font-bold text-emerald-600 text-sm">
                      {{ item.currentHighestBid ? '₹' + (item.currentHighestBid | number) : 'No bids yet' }}
                    </span>
                  </div>
                </div>

                @if (authService.isBidder()) {
                  <a [routerLink]="['/bidder']" class="block w-full py-2.5 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition">
                    Place Bid Now
                  </a>
                } @else {
                  <a routerLink="/login" class="block w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
                    Sign in to Bid
                  </a>
                }
              </div>
            }
          </div>
        }
      </section>

    </div>
  `
})
export class HomeComponent implements OnInit {
  openAuctions: OpenAuctionItem[] = [];
  isLoading = true;

  constructor(
    private sellRequestService: SellRequestService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.sellRequestService.getOpenAuctions(1, 6).subscribe({
      next: (res) => {
        this.openAuctions = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
