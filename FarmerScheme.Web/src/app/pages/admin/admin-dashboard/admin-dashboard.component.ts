import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { SellRequestService } from '../../../core/services/sell-request.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { ClaimService } from '../../../core/services/claim.service';
import { UploadService } from '../../../core/services/upload.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  UserResponse,
  CropResponse,
  SellRequestResponse,
  InsuranceApplicationResponse,
  ClaimResponse
} from '../../../core/models/models';

type AdminTab = 'users' | 'crops' | 'auctions' | 'insurance' | 'claims';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Header -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-950/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-800">
        <div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 uppercase tracking-wider">Super Administrator Authority</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">Government Scheme Administration</h1>
          <p class="text-xs sm:text-sm text-slate-300 mt-1">Review registrations, approve produce for auctions, finalize winning bids, and adjudicate damage claims.</p>
        </div>
        <button (click)="refreshAll()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition">
          Refresh Master Data 🔄
        </button>
      </div>

      <!-- Action Feedback -->
      @if (actionMessage) {
        <div class="p-4 rounded-xl text-sm" [class.bg-emerald-50]="isSuccess" [class.text-emerald-800]="isSuccess" [class.border]="true" [class.border-emerald-200]="isSuccess" [class.bg-red-50]="!isSuccess" [class.text-red-800]="!isSuccess" [class.border-red-200]="!isSuccess">
          {{ actionMessage }}
        </div>
      }

      <!-- Admin Tabs -->
      <div class="flex overflow-x-auto space-x-2 border-b border-slate-200 pb-2">
        <button (click)="activeTab = 'users'" [class.bg-indigo-600]="activeTab === 'users'" [class.text-white]="activeTab === 'users'" [class.text-slate-600]="activeTab !== 'users'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          👥 Pending Users ({{ pendingUsers.length }})
        </button>
        <button (click)="activeTab = 'crops'" [class.bg-indigo-600]="activeTab === 'crops'" [class.text-white]="activeTab === 'crops'" [class.text-slate-600]="activeTab !== 'crops'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🌾 Pending Produce ({{ pendingCrops.length }})
        </button>
        <button (click)="activeTab = 'auctions'" [class.bg-indigo-600]="activeTab === 'auctions'" [class.text-white]="activeTab === 'auctions'" [class.text-slate-600]="activeTab !== 'auctions'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🏷️ Auctions & Closures ({{ allSellRequests.length }})
        </button>
        <button (click)="activeTab = 'insurance'" [class.bg-indigo-600]="activeTab === 'insurance'" [class.text-white]="activeTab === 'insurance'" [class.text-slate-600]="activeTab !== 'insurance'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🛡️ Insurance Applications ({{ allInsuranceApps.length }})
        </button>
        <button (click)="activeTab = 'claims'" [class.bg-indigo-600]="activeTab === 'claims'" [class.text-white]="activeTab === 'claims'" [class.text-slate-600]="activeTab !== 'claims'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          📄 Disaster Claims ({{ allClaims.length }})
        </button>
      </div>

      <!-- ==================== TAB 1: PENDING USERS ==================== -->
      @if (activeTab === 'users') {
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">User Registrations Pending Verification</h2>
          </div>

          @if (pendingUsers.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-3xl mb-2">✅</div>
              <h3 class="font-bold text-slate-800">All registered users are approved</h3>
              <p class="text-xs text-slate-500 mt-1">Newly registered farmers and bidders requiring approval will appear here.</p>
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th class="p-4">User ID</th>
                    <th class="p-4">Full Name</th>
                    <th class="p-4">Email</th>
                    <th class="p-4">Phone</th>
                    <th class="p-4">Role</th>
                    <th class="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (user of pendingUsers; track user.id) {
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4 font-mono">#{{ user.id }}</td>
                      <td class="p-4 font-bold text-slate-900">{{ user.fullName }}</td>
                      <td class="p-4">{{ user.email }}</td>
                      <td class="p-4 font-mono">{{ user.phoneNumber }}</td>
                      <td class="p-4 font-semibold text-indigo-700 capitalize">{{ user.role }}</td>
                      <td class="p-4 text-right">
                        <button (click)="approveUser(user.id)" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                          Approve Account
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 2: PENDING CROPS ==================== -->
      @if (activeTab === 'crops') {
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-slate-900">Farmer Produce Pending Certification</h2>

          @if (pendingCrops.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-3xl mb-2">✅</div>
              <h3 class="font-bold text-slate-800">No pending crops to review</h3>
              <p class="text-xs text-slate-500 mt-1">All registered crops are verified and eligible for auctions.</p>
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th class="p-4">Crop ID</th>
                    <th class="p-4">Produce Name</th>
                    <th class="p-4">Farmer ID</th>
                    <th class="p-4">Soil & Season</th>
                    <th class="p-4">Quantity</th>
                    <th class="p-4">Base Price</th>
                    <th class="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (c of pendingCrops; track c.id) {
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4 font-mono">#{{ c.id }}</td>
                      <td class="p-4 font-bold text-slate-900">{{ c.cropName }}</td>
                      <td class="p-4">Farmer #{{ c.farmerId }}</td>
                      <td class="p-4">{{ c.soilType }} • {{ c.season }}</td>
                      <td class="p-4">{{ c.quantity }} Qtl</td>
                      <td class="p-4 font-bold text-emerald-600">₹{{ c.basePrice | number }}</td>
                      <td class="p-4 text-right">
                        <button (click)="approveCrop(c.id)" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                          Approve Produce
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 3: AUCTIONS & CLOSURES ==================== -->
      @if (activeTab === 'auctions') {
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-slate-900">Crop Sell Requests & Active Auctions</h2>

          @if (allSellRequests.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-3xl mb-2">🏷️</div>
              <h3 class="font-bold text-slate-800">No auctions or requests</h3>
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                  <tr>
                    <th class="p-4">ID</th>
                    <th class="p-4">Crop</th>
                    <th class="p-4">Quantity</th>
                    <th class="p-4">Base Price</th>
                    <th class="p-4">Highest Bid</th>
                    <th class="p-4">Status</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (s of allSellRequests; track s.id) {
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-4 font-mono">#{{ s.id }}</td>
                      <td class="p-4 font-bold text-slate-900">{{ s.cropName }}</td>
                      <td class="p-4">{{ s.quantity }} Qtl</td>
                      <td class="p-4">₹{{ s.basePrice | number }}</td>
                      <td class="p-4 font-bold text-emerald-600">
                        {{ s.currentHighestBid ? '₹' + (s.currentHighestBid | number) : 'No bids' }}
                      </td>
                      <td class="p-4 font-semibold">
                        <span class="px-2 py-0.5 rounded-full text-[10px]" [class.bg-amber-100]="s.status === 'Pending' || s.status === 0" [class.text-amber-800]="s.status === 'Pending' || s.status === 0" [class.bg-emerald-100]="s.status === 'Active' || s.status === 1" [class.text-emerald-800]="s.status === 'Active' || s.status === 1" [class.bg-slate-100]="s.status === 'Closed' || s.status === 2">
                          {{ s.status }}
                        </span>
                      </td>
                      <td class="p-4 text-right space-x-2">
                        @if (s.status === 'Pending' || s.status === 0) {
                          <button (click)="approveSellRequest(s.id)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                            Start Auction
                          </button>
                        } @else if (s.status === 'Active' || s.status === 1) {
                          <button (click)="closeAuction(s.id)" class="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition" title="Awards crop to highest bidder">
                            Close & Award
                          </button>
                        } @else {
                          <span class="text-slate-400 font-medium">Finalized</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 4: INSURANCE APPLICATIONS ==================== -->
      @if (activeTab === 'insurance') {
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-slate-900">Crop Insurance Applications</h2>

          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th class="p-4">App ID</th>
                  <th class="p-4">Farmer</th>
                  <th class="p-4">Crop Name</th>
                  <th class="p-4">Area & Season</th>
                  <th class="p-4">Sum Insured</th>
                  <th class="p-4">Premium</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (app of allInsuranceApps; track app.id) {
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono">#{{ app.id }}</td>
                    <td class="p-4 font-bold">{{ app.farmerName || 'Farmer #' + app.farmerId }}</td>
                    <td class="p-4">{{ app.cropName }}</td>
                    <td class="p-4">{{ app.landArea }} Acres • Season {{ app.season }}</td>
                    <td class="p-4">₹{{ app.sumInsured | number }}</td>
                    <td class="p-4 font-bold text-blue-700">₹{{ app.premiumAmount | number }}</td>
                    <td class="p-4 font-semibold">{{ app.status }}</td>
                    <td class="p-4 text-right">
                      @if (app.status === 'Pending' || app.status === 0) {
                        <button (click)="approveInsurance(app.id)" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                          Approve Policy
                        </button>
                      } @else {
                        <span class="text-emerald-600 font-bold">Approved ✓</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- ==================== TAB 5: CLAIMS APPROVAL ==================== -->
      @if (activeTab === 'claims') {
        <div class="space-y-4">
          <h2 class="text-xl font-bold text-slate-900">Crop Damage Disaster Claims</h2>

          <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table class="w-full text-left text-xs">
              <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <tr>
                  <th class="p-4">Claim ID</th>
                  <th class="p-4">Farmer</th>
                  <th class="p-4">Insured Crop</th>
                  <th class="p-4">Cause of Loss</th>
                  <th class="p-4">Damage Proof</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (claim of allClaims; track claim.id) {
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-4 font-mono">#{{ claim.id }}</td>
                    <td class="p-4 font-bold">{{ claim.farmerName }}</td>
                    <td class="p-4">{{ claim.cropName }}</td>
                    <td class="p-4 max-w-xs truncate">{{ claim.causeOfLoss }}</td>
                    <td class="p-4">
                      @if (claim.damageProofFiles && claim.damageProofFiles.length > 0) {
                        <a [href]="uploadService.getFullUrl(claim.damageProofFiles[0])" target="_blank" class="text-indigo-600 hover:underline font-semibold flex items-center space-x-1">
                          <span>View Proof 📎</span>
                        </a>
                      } @else {
                        <span class="text-slate-400">None</span>
                      }
                    </td>
                    <td class="p-4 font-semibold">{{ claim.status }}</td>
                    <td class="p-4 text-right">
                      @if (claim.status !== 'Approved') {
                        <button (click)="approveClaim(claim.id)" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition">
                          Approve Payout
                        </button>
                      } @else {
                        <span class="text-emerald-600 font-bold">Approved ✓</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab: AdminTab = 'users';
  actionMessage = '';
  isSuccess = true;

  pendingUsers: UserResponse[] = [];
  pendingCrops: CropResponse[] = [];
  allSellRequests: SellRequestResponse[] = [];
  allInsuranceApps: InsuranceApplicationResponse[] = [];
  allClaims: ClaimResponse[] = [];

  constructor(
    private adminService: AdminService,
    private sellRequestService: SellRequestService,
    private insuranceService: InsuranceService,
    private claimService: ClaimService,
    public uploadService: UploadService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadPendingUsers();
    this.loadPendingCrops();
    this.loadSellRequests();
    this.loadInsurance();
    this.loadClaims();
  }

  loadPendingUsers(): void {
    this.adminService.getPendingUsers(1, 50).subscribe({
      next: (res) => this.pendingUsers = res.data || [],
      error: () => {}
    });
  }

  loadPendingCrops(): void {
    this.adminService.getPendingCrops(1, 50).subscribe({
      next: (res) => this.pendingCrops = res.data || [],
      error: () => {}
    });
  }

  loadSellRequests(): void {
    this.sellRequestService.getAllSellRequests(1, 50).subscribe({
      next: (res) => this.allSellRequests = res.data || [],
      error: () => {}
    });
  }

  loadInsurance(): void {
    this.insuranceService.getAllApplications(1, 50).subscribe({
      next: (res) => this.allInsuranceApps = res.data || [],
      error: () => {}
    });
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (res) => this.allClaims = res.data || [],
      error: () => {}
    });
  }

  approveUser(userId: number): void {
    this.adminService.approveUser(userId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `User #${userId} successfully approved!`;
        this.loadPendingUsers();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error approving user.';
      }
    });
  }

  approveCrop(cropId: number): void {
    this.adminService.approveCrop(cropId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `Produce #${cropId} successfully approved for auction listing!`;
        this.loadPendingCrops();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error approving crop.';
      }
    });
  }

  approveSellRequest(sellRequestId: number): void {
    this.sellRequestService.approveSellRequest(sellRequestId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `Sell request #${sellRequestId} approved and is now live for public bidding!`;
        this.loadSellRequests();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error starting auction.';
      }
    });
  }

  closeAuction(sellRequestId: number): void {
    if (!confirm('Are you sure you want to close this auction and award the produce to the highest bidder?')) return;

    this.sellRequestService.closeAuction(sellRequestId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `Auction #${sellRequestId} successfully closed and awarded!`;
        this.loadSellRequests();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error closing auction.';
      }
    });
  }

  approveInsurance(applicationId: number): void {
    this.insuranceService.approveInsurance(applicationId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `Insurance policy #${applicationId} approved!`;
        this.loadInsurance();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error approving insurance.';
      }
    });
  }

  approveClaim(claimId: number): void {
    this.claimService.approveClaim(claimId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = `Disaster claim #${claimId} approved for disbursement!`;
        this.loadClaims();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Error approving claim.';
      }
    });
  }
}
