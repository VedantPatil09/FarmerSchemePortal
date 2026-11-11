import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SellRequestService } from '../../../core/services/sell-request.service';
import { BidService } from '../../../core/services/bid.service';
import { ProfileService } from '../../../core/services/profile.service';
import { AuthService } from '../../../core/services/auth.service';
import { OpenAuctionItem, BidResponse } from '../../../core/models/models';

@Component({
  selector: 'app-bidder-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white uppercase tracking-wider">Trading & Marketplace Hub</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">Bidder Portal: {{ authService.currentUser()?.email }}</h1>
          <p class="text-xs sm:text-sm text-amber-100 mt-1">Discover verified agricultural crops, place competitive live bids, and secure harvests.</p>
        </div>
      </div>

      <!-- Action Message Alert -->
      @if (actionMessage) {
        <div class="p-4 rounded-xl text-sm" [class.bg-emerald-50]="isSuccess" [class.text-emerald-800]="isSuccess" [class.border]="true" [class.border-emerald-200]="isSuccess" [class.bg-red-50]="!isSuccess" [class.text-red-800]="!isSuccess" [class.border-red-200]="!isSuccess">
          {{ actionMessage }}
        </div>
      }

      <!-- Tabs -->
      <div class="flex space-x-2 border-b border-slate-200 pb-2">
        <button (click)="activeTab = 'auctions'" [class.bg-amber-600]="activeTab === 'auctions'" [class.text-white]="activeTab === 'auctions'" [class.text-slate-600]="activeTab !== 'auctions'" class="px-4 py-2 rounded-xl text-xs font-semibold transition">
          🌾 Live Crop Auctions ({{ openAuctions.length }})
        </button>
        <button (click)="activeTab = 'profile'" [class.bg-amber-600]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'" [class.text-slate-600]="activeTab !== 'profile'" class="px-4 py-2 rounded-xl text-xs font-semibold transition">
          💼 Company & Banking Profile
        </button>
      </div>

      <!-- ==================== TAB 1: AUCTIONS ==================== -->
      @if (activeTab === 'auctions') {
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">Current Open Produce Lots</h2>
            <button (click)="loadAuctions()" class="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition">
              Refresh Bids 🔄
            </button>
          </div>

          @if (isLoading) {
            <div class="py-12 text-center text-slate-400">Loading live auctions...</div>
          } @else if (openAuctions.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-4xl mb-2">🚜</div>
              <h3 class="font-bold text-slate-800">No active auctions at the moment</h3>
              <p class="text-xs text-slate-500 mt-1">Please check back soon or click refresh.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (item of openAuctions; track item.sellRequestId) {
                <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                  <div>
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">Open for Bidding</span>
                        <h3 class="font-bold text-slate-900 text-lg mt-2">{{ item.cropName }}</h3>
                      </div>
                      <span class="text-xs text-slate-400 font-mono">#{{ item.sellRequestId }}</span>
                    </div>

                    <div class="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                      <div class="flex justify-between"><span class="text-slate-500">Lot Quantity:</span><span class="font-semibold text-slate-800">{{ item.quantity }} Quintals</span></div>
                      <div class="flex justify-between"><span class="text-slate-500">Base Price:</span><span class="font-semibold text-slate-800">₹{{ item.basePrice | number }}</span></div>
                      <div class="flex justify-between items-center pt-2 text-sm">
                        <span class="text-slate-600 font-medium">Top Bid:</span>
                        <span class="font-extrabold text-amber-600 text-base">
                          {{ item.currentHighestBid ? '₹' + (item.currentHighestBid | number) : 'No bids yet' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="pt-4 grid grid-cols-2 gap-2">
                    <button (click)="openBidModal(item)" class="py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition shadow-sm">
                      Place Higher Bid
                    </button>
                    <button (click)="viewHistory(item.sellRequestId)" class="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
                      Bids History
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 2: PROFILE ==================== -->
      @if (activeTab === 'profile') {
        <div class="max-w-2xl bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Bidder & Corporate Trading Profile</h2>
            <p class="text-xs text-slate-500 mt-1">Keep your corporate credentials up to date for smooth settlement of auction victories.</p>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4 text-xs">
            <div>
              <label class="block font-semibold text-slate-600 mb-1">Company / Trading Entity Name</label>
              <input type="text" formControlName="companyName" placeholder="e.g. AgroCorp Commodities Ltd" class="w-full px-3 py-2 border rounded-xl">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Corporate Bank Account</label>
                <input type="text" formControlName="bankAccountNumber" class="w-full px-3 py-2 border rounded-xl font-mono">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Bank IFSC Code</label>
                <input type="text" formControlName="ifscCode" class="w-full px-3 py-2 border rounded-xl font-mono uppercase">
              </div>
            </div>

            <button type="submit" [disabled]="profileForm.invalid || isSavingProfile" class="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition disabled:opacity-50">
              {{ isSavingProfile ? 'Saving...' : 'Update Corporate Profile' }}
            </button>
          </form>
        </div>
      }

      <!-- ==================== MODAL: PLACE BID ==================== -->
      @if (selectedAuction) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Place Bid for {{ selectedAuction.cropName }}</h3>
              <button (click)="selectedAuction = null" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            <div class="bg-amber-50 rounded-xl p-3 text-xs text-amber-900 space-y-1 border border-amber-200">
              <div>Base Price: <strong>₹{{ selectedAuction.basePrice | number }}</strong></div>
              <div>Current Top Bid: <strong class="text-amber-700">₹{{ selectedAuction.currentHighestBid || selectedAuction.basePrice | number }}</strong></div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase text-slate-600 mb-1">Your Bid Amount (₹)</label>
              <input 
                type="number" 
                [(ngModel)]="bidAmountInput" 
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-bold"
              />
            </div>

            <div class="flex space-x-3 pt-2">
              <button (click)="selectedAuction = null" class="w-1/2 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">Cancel</button>
              <button (click)="submitBid()" [disabled]="isSubmittingBid" class="w-1/2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold disabled:opacity-50">
                {{ isSubmittingBid ? 'Placing Bid...' : 'Confirm Bid' }}
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ==================== MODAL: BID HISTORY ==================== -->
      @if (historyAuctionId) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Auction #{{ historyAuctionId }} Bidding Log</h3>
              <button (click)="historyAuctionId = null" class="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>

            @if (isLoadingHistory) {
              <div class="py-8 text-center text-slate-400 text-xs">Loading bid history...</div>
            } @else if (bidsList.length === 0) {
              <div class="py-8 text-center text-slate-500 text-xs">No bids placed yet. You can be the first bidder!</div>
            } @else {
              <div class="max-h-72 overflow-y-auto divide-y divide-slate-100">
                @for (bid of bidsList; track bid.id) {
                  <div class="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <div class="font-semibold text-slate-800">{{ bid.bidderName || 'Bidder #' + bid.bidderId }}</div>
                      <div class="text-[10px] text-slate-400">{{ bid.bidTime | date:'medium' }}</div>
                    </div>
                    <div class="text-right">
                      <div class="font-extrabold text-amber-600 text-sm">₹{{ bid.bidAmount | number }}</div>
                      @if (bid.isWinningBid) {
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Winning Bid</span>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <div class="pt-2 text-right">
              <button (click)="historyAuctionId = null" class="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold">Close</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class BidderDashboardComponent implements OnInit {
  activeTab: 'auctions' | 'profile' = 'auctions';
  openAuctions: OpenAuctionItem[] = [];
  isLoading = true;

  selectedAuction: OpenAuctionItem | null = null;
  bidAmountInput: number | null = null;
  isSubmittingBid = false;

  historyAuctionId: number | null = null;
  bidsList: BidResponse[] = [];
  isLoadingHistory = false;

  actionMessage = '';
  isSuccess = true;

  profileForm: FormGroup;
  isSavingProfile = false;

  constructor(
    private fb: FormBuilder,
    private sellRequestService: SellRequestService,
    private bidService: BidService,
    private profileService: ProfileService,
    public authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      companyName: ['', Validators.required],
      bankAccountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAuctions();
    this.loadProfile();
  }

  loadAuctions(): void {
    this.isLoading = true;
    this.sellRequestService.getOpenAuctions(1, 50).subscribe({
      next: (res) => {
        this.openAuctions = res.data || [];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.profileForm.patchValue({
            companyName: res.data.companyName,
            bankAccountNumber: res.data.bankAccountNumber,
            ifscCode: res.data.ifscCode
          });
        }
      },
      error: () => {}
    });
  }

  openBidModal(auction: OpenAuctionItem): void {
    this.selectedAuction = auction;
    this.bidAmountInput = (auction.currentHighestBid || auction.basePrice) + 100;
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
        this.actionMessage = `Bid of ₹${this.bidAmountInput} placed successfully!`;
        this.selectedAuction = null;
        this.loadAuctions();
      },
      error: (err) => {
        this.isSubmittingBid = false;
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to place bid.';
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
      error: () => this.isLoadingHistory = false
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSavingProfile = true;
    const val = this.profileForm.value;

    this.profileService.createProfile({
      profileType: 1, // Bidder
      companyName: val.companyName,
      bankAccountNumber: val.bankAccountNumber,
      ifscCode: val.ifscCode,
      documents: []
    }).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.isSuccess = true;
        this.actionMessage = 'Company profile updated!';
      },
      error: () => {
        this.profileService.updateProfile({
          companyName: val.companyName,
          bankAccountNumber: val.bankAccountNumber,
          ifscCode: val.ifscCode
        }).subscribe({
          next: () => {
            this.isSavingProfile = false;
            this.isSuccess = true;
            this.actionMessage = 'Company profile updated!';
          },
          error: (err) => {
            this.isSavingProfile = false;
            this.isSuccess = false;
            this.actionMessage = err.error?.message || 'Failed to update profile.';
          }
        });
      }
    });
  }
}
