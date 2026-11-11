import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SellRequestService } from '../../core/services/sell-request.service';
import { BidService } from '../../core/services/bid.service';
import { AuthService } from '../../core/services/auth.service';
import { OpenAuctionItem, BidResponse } from '../../core/models/models';

@Component({
  selector: 'app-open-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Active Crop Auctions</h1>
          <p class="text-sm text-slate-500 mt-1">Real-time marketplace for agricultural produce direct from verified farmers.</p>
        </div>
        <button (click)="loadAuctions()" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh Live Bids</span>
        </button>
      </div>

      <!-- Action Feedback Banner -->
      @if (actionMessage) {
        <div class="p-4 rounded-xl text-sm" [class.bg-emerald-50]="isSuccess" [class.text-emerald-800]="isSuccess" [class.border]="true" [class.border-emerald-200]="isSuccess" [class.bg-red-50]="!isSuccess" [class.text-red-800]="!isSuccess" [class.border-red-200]="!isSuccess">
          {{ actionMessage }}
        </div>
      }

      <!-- Auctions Grid -->
      @if (isLoading) {
        <div class="py-20 text-center text-slate-400">Loading open auctions...</div>
      } @else if (auctions.length === 0) {
        <div class="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div class="text-4xl mb-3">🌾</div>
          <h3 class="text-lg font-bold text-slate-800">No auctions are currently active</h3>
          <p class="text-sm text-slate-500 max-w-md mx-auto mt-1">Once farmers submit crops and administrator approves them, active auctions will appear here.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (item of auctions; track item.sellRequestId) {
            <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active Auction</span>
                    <h3 class="text-xl font-bold text-slate-900 mt-2">{{ item.cropName }}</h3>
                  </div>
                  <span class="text-xs text-slate-400 font-mono">#{{ item.sellRequestId }}</span>
                </div>

                <div class="space-y-2 py-4 border-y border-slate-100 text-sm">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Available Quantity:</span>
                    <span class="font-semibold text-slate-800">{{ item.quantity }} Quintals</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Base Price:</span>
                    <span class="font-semibold text-slate-800">₹{{ item.basePrice | number }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 text-base">
                    <span class="text-slate-600 font-medium">Highest Bid:</span>
                    <span class="font-extrabold text-emerald-600">
                      {{ item.currentHighestBid ? '₹' + (item.currentHighestBid | number) : 'No bids yet' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="pt-6 space-y-2">
                @if (authService.isBidder()) {
                  <button (click)="openBidModal(item)" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition shadow-sm">
                    Place Bid
                  </button>
                  <button (click)="viewHistory(item.sellRequestId)" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition">
                    View Bid History
                  </button>
                } @else if (authService.isAuthenticated()) {
                  <div class="p-2.5 bg-slate-50 text-slate-500 text-xs rounded-xl text-center">
                    Must be registered as a Bidder to place bids.
                  </div>
                  <button (click)="viewHistory(item.sellRequestId)" class="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition">
                    View Bid History
                  </button>
                } @else {
                  <a routerLink="/login" class="block w-full py-2.5 text-center bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition">
                    Sign In to Bid
                  </a>
                }
              </div>
            </div>
          }
        </div>
      }

      <!-- Place Bid Modal -->
      @if (selectedAuction) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Place Bid on {{ selectedAuction.cropName }}</h3>
              <button (click)="selectedAuction = null" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-800 space-y-1">
              <div>Base Price: <strong class="font-bold">₹{{ selectedAuction.basePrice }}</strong></div>
              <div>Current Highest Bid: <strong class="font-bold">₹{{ selectedAuction.currentHighestBid || selectedAuction.basePrice }}</strong></div>
              <div class="text-[11px] text-emerald-600 mt-1">* Your bid must exceed the current highest bid.</div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Your Bid Amount (₹)</label>
              <input 
                type="number" 
                [(ngModel)]="bidAmountInput" 
                placeholder="Enter amount"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base font-semibold"
              />
            </div>

            <div class="flex space-x-3 pt-2">
              <button (click)="selectedAuction = null" class="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
              <button (click)="submitBid()" [disabled]="isSubmittingBid" class="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50">
                {{ isSubmittingBid ? 'Submitting...' : 'Confirm Bid' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Bid History Modal -->
      @if (historyAuctionId) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Bid History (Auction #{{ historyAuctionId }})</h3>
              <button (click)="historyAuctionId = null" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            @if (isLoadingHistory) {
              <div class="py-10 text-center text-slate-400 text-sm">Loading bid history...</div>
            } @else if (bidsList.length === 0) {
              <div class="py-10 text-center text-slate-500 text-sm">No bids placed yet for this auction.</div>
            } @else {
              <div class="max-h-80 overflow-y-auto divide-y divide-slate-100">
                @for (bid of bidsList; track bid.id) {
                  <div class="py-3 flex justify-between items-center text-sm">
                    <div>
                      <div class="font-semibold text-slate-900">{{ bid.bidderName || 'Registered Bidder #' + bid.bidderId }}</div>
                      <div class="text-xs text-slate-400">{{ bid.bidTime | date:'medium' }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-extrabold text-emerald-600 text-base">₹{{ bid.bidAmount | number }}</div>
                      @if (bid.isWinningBid) {
                        <span class="inline-block text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Winning Bid</span>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <div class="pt-2 text-right">
              <button (click)="historyAuctionId = null" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class OpenAuctionsComponent implements OnInit {
  auctions: OpenAuctionItem[] = [];
  isLoading = true;

  selectedAuction: OpenAuctionItem | null = null;
  bidAmountInput: number | null = null;
  isSubmittingBid = false;

  historyAuctionId: number | null = null;
  bidsList: BidResponse[] = [];
  isLoadingHistory = false;

  actionMessage = '';
  isSuccess = true;

  constructor(
    private sellRequestService: SellRequestService,
    private bidService: BidService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAuctions();
  }

  loadAuctions(): void {
    this.isLoading = true;
    this.sellRequestService.getOpenAuctions(1, 50).subscribe({
      next: (res) => {
        this.auctions = res.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  openBidModal(auction: OpenAuctionItem): void {
    this.selectedAuction = auction;
    const minBid = (auction.currentHighestBid || auction.basePrice) + 100;
    this.bidAmountInput = minBid;
    this.actionMessage = '';
  }

  submitBid(): void {
    if (!this.selectedAuction || !this.bidAmountInput) return;

    this.isSubmittingBid = true;
    this.bidService.placeBid({
      sellRequestId: this.selectedAuction.sellRequestId,
      bidAmount: this.bidAmountInput
    }).subscribe({
      next: () => {
        this.isSubmittingBid = false;
        this.isSuccess = true;
        this.actionMessage = `Bid of ₹${this.bidAmountInput} successfully placed on ${this.selectedAuction?.cropName}!`;
        this.selectedAuction = null;
        this.loadAuctions();
      },
      error: (err) => {
        this.isSubmittingBid = false;
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to place bid. Please ensure your bid is higher than the current highest bid.';
      }
    });
  }

  viewHistory(sellRequestId: number): void {
    this.historyAuctionId = sellRequestId;
    this.isLoadingHistory = true;
    this.bidsList = [];

    this.bidService.getBidHistory(sellRequestId).subscribe({
      next: (res) => {
        this.bidsList = res.data || [];
        this.isLoadingHistory = false;
      },
      error: () => {
        this.isLoadingHistory = false;
      }
    });
  }
}
