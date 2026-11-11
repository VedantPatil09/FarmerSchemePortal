import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CropService } from '../../../core/services/crop.service';
import { SellRequestService } from '../../../core/services/sell-request.service';
import { InsuranceService } from '../../../core/services/insurance.service';
import { ClaimService } from '../../../core/services/claim.service';
import { AIService } from '../../../core/services/ai.service';
import { ProfileService } from '../../../core/services/profile.service';
import { UploadService } from '../../../core/services/upload.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  CropResponse,
  SellRequestResponse,
  InsuranceApplicationResponse,
  ClaimResponse,
  AIQueryLog,
  ProfileResponse,
  SeasonType,
  ZoneType,
  DocumentType
} from '../../../core/models/models';

type FarmerTab = 'crops' | 'auctions' | 'insurance' | 'claims' | 'ai' | 'profile';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Dashboard Header -->
      <div class="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span class="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 uppercase tracking-wider">Farmer Command Center</span>
          <h1 class="text-2xl sm:text-3xl font-extrabold mt-2">Welcome Back, {{ authService.currentUser()?.email }}</h1>
          <p class="text-xs sm:text-sm text-emerald-100/80 mt-1">Manage your produce, live crop auctions, crop insurance, and AI agronomy advice.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="openAddCropModal()" class="px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs rounded-xl shadow-sm transition flex items-center space-x-1.5">
            <span>+ Register New Crop</span>
          </button>
        </div>
      </div>

      <!-- Action Message Alert -->
      @if (actionMessage) {
        <div class="p-4 rounded-xl text-sm" [class.bg-emerald-50]="isSuccess" [class.text-emerald-800]="isSuccess" [class.border]="true" [class.border-emerald-200]="isSuccess" [class.bg-red-50]="!isSuccess" [class.text-red-800]="!isSuccess" [class.border-red-200]="!isSuccess">
          {{ actionMessage }}
        </div>
      }

      <!-- Navigation Tabs -->
      <div class="flex overflow-x-auto space-x-2 border-b border-slate-200 pb-2">
        <button (click)="activeTab = 'crops'" [class.bg-emerald-600]="activeTab === 'crops'" [class.text-white]="activeTab === 'crops'" [class.text-slate-600]="activeTab !== 'crops'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🌾 My Crops ({{ crops.length }})
        </button>
        <button (click)="activeTab = 'auctions'" [class.bg-emerald-600]="activeTab === 'auctions'" [class.text-white]="activeTab === 'auctions'" [class.text-slate-600]="activeTab !== 'auctions'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🏷️ Auctions & Sell Requests ({{ sellRequests.length }})
        </button>
        <button (click)="activeTab = 'insurance'" [class.bg-emerald-600]="activeTab === 'insurance'" [class.text-white]="activeTab === 'insurance'" [class.text-slate-600]="activeTab !== 'insurance'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🛡️ Insurance & Calculator ({{ insuranceApps.length }})
        </button>
        <button (click)="activeTab = 'claims'" [class.bg-emerald-600]="activeTab === 'claims'" [class.text-white]="activeTab === 'claims'" [class.text-slate-600]="activeTab !== 'claims'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          📄 Damage Claims ({{ claims.length }})
        </button>
        <button (click)="activeTab = 'ai'" [class.bg-emerald-600]="activeTab === 'ai'" [class.text-white]="activeTab === 'ai'" [class.text-slate-600]="activeTab !== 'ai'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          🤖 AI Agronomist
        </button>
        <button (click)="activeTab = 'profile'" [class.bg-emerald-600]="activeTab === 'profile'" [class.text-white]="activeTab === 'profile'" [class.text-slate-600]="activeTab !== 'profile'" class="px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition">
          👤 KYC & Bank Profile
        </button>
      </div>

      <!-- ==================== TAB 1: MY CROPS ==================== -->
      @if (activeTab === 'crops') {
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">Registered Produce</h2>
            <button (click)="openAddCropModal()" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition">
              + Add Produce
            </button>
          </div>

          @if (isLoadingCrops) {
            <div class="py-12 text-center text-slate-400">Loading crops...</div>
          } @else if (crops.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-4xl mb-2">🌾</div>
              <h3 class="font-bold text-slate-800">No crops registered yet</h3>
              <p class="text-xs text-slate-500 mt-1 mb-4">Register your harvest to qualify for government insurance and start crop auctions.</p>
              <button (click)="openAddCropModal()" class="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">Register First Crop</button>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              @for (crop of crops; track crop.id) {
                <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start mb-3">
                      <div>
                        <h3 class="font-bold text-slate-900 text-lg">{{ crop.CropName || crop.cropName }}</h3>
                        <span class="text-xs text-slate-400">{{ crop.CropType || crop.cropType }} • {{ crop.Season || crop.season }}</span>
                      </div>
                      <span 
                        class="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        [class.bg-amber-100]="crop.Status === 0 || crop.Status === 'Pending' || crop.status === 'Pending' || crop.status === 0"
                        [class.text-amber-800]="crop.Status === 0 || crop.Status === 'Pending' || crop.status === 'Pending' || crop.status === 0"
                        [class.bg-emerald-100]="crop.Status === 1 || crop.Status === 'Approved' || crop.status === 'Approved' || crop.status === 1"
                        [class.text-emerald-800]="crop.Status === 1 || crop.Status === 'Approved' || crop.status === 'Approved' || crop.status === 1"
                      >
                        {{ crop.Status === 1 || crop.Status === 'Approved' || crop.status === 'Approved' || crop.status === 1 ? 'Approved' : 'Pending Approval' }}
                      </span>
                    </div>

                    <div class="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                      <div class="flex justify-between"><span class="text-slate-500">Soil:</span><span class="font-medium text-slate-800">{{ crop.SoilType || crop.soilType }}</span></div>
                      <div class="flex justify-between"><span class="text-slate-500">Location:</span><span class="font-medium text-slate-800">{{ crop.Location || crop.location }}</span></div>
                      <div class="flex justify-between"><span class="text-slate-500">Quantity:</span><span class="font-semibold text-slate-800">{{ crop.Quantity || crop.quantity }} Quintals</span></div>
                      <div class="flex justify-between"><span class="text-slate-500">Base Price:</span><span class="font-bold text-emerald-600 text-sm">₹{{ crop.BasePrice || crop.basePrice | number }}</span></div>
                    </div>
                  </div>

                  <div class="pt-4 grid grid-cols-2 gap-2">
                    <button 
                      (click)="createAuctionRequest(crop.Id || crop.id)"
                      [disabled]="!(crop.Status === 1 || crop.Status === 'Approved' || crop.status === 'Approved' || crop.status === 1)"
                      class="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                      title="Requires Admin Approval"
                    >
                      Sell in Auction
                    </button>
                    <button 
                      (click)="openInsuranceModal(crop)"
                      [disabled]="!(crop.Status === 1 || crop.Status === 'Approved' || crop.status === 'Approved' || crop.status === 1)"
                      class="py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Insure Crop
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 2: AUCTIONS ==================== -->
      @if (activeTab === 'auctions') {
        <div class="space-y-6">
          <h2 class="text-xl font-bold text-slate-900">Your Auction Listings</h2>

          @if (sellRequests.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-4xl mb-2">🏷️</div>
              <h3 class="font-bold text-slate-800">No active or past sell requests</h3>
              <p class="text-xs text-slate-500 mt-1">Approved crops can be submitted for live public auction from the "My Crops" tab.</p>
            </div>
          } @else {
            <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th class="p-4">Auction ID</th>
                      <th class="p-4">Crop Name</th>
                      <th class="p-4">Quantity</th>
                      <th class="p-4">Base Price</th>
                      <th class="p-4">Current Highest Bid</th>
                      <th class="p-4">Status</th>
                      <th class="p-4">Winner / Result</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    @for (item of sellRequests; track item.id) {
                      <tr class="hover:bg-slate-50 transition">
                        <td class="p-4 font-mono font-medium text-slate-500">#{{ item.id }}</td>
                        <td class="p-4 font-bold text-slate-900">{{ item.cropName || 'Crop #' + item.cropId }}</td>
                        <td class="p-4">{{ item.quantity }} Quintals</td>
                        <td class="p-4">₹{{ item.basePrice | number }}</td>
                        <td class="p-4 font-bold text-emerald-600">
                          {{ item.currentHighestBid ? '₹' + (item.currentHighestBid | number) : 'No bids' }}
                        </td>
                        <td class="p-4">
                          <span 
                            class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            [class.bg-amber-100]="item.status === 'Pending' || item.status === 0"
                            [class.text-amber-800]="item.status === 'Pending' || item.status === 0"
                            [class.bg-emerald-100]="item.status === 'Active' || item.status === 1"
                            [class.text-emerald-800]="item.status === 'Active' || item.status === 1"
                            [class.bg-slate-100]="item.status === 'Closed' || item.status === 2"
                            [class.text-slate-800]="item.status === 'Closed' || item.status === 2"
                          >
                            {{ item.status }}
                          </span>
                        </td>
                        <td class="p-4">
                          @if (item.winningAmount) {
                            <div class="text-emerald-700 font-semibold">Won for ₹{{ item.winningAmount | number }}</div>
                          } @else if (item.status === 'Active' || item.status === 1) {
                            <span class="text-amber-600 font-medium">Bidding in progress</span>
                          } @else {
                            <span class="text-slate-400">Awaiting admin start</span>
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
      }

      <!-- ==================== TAB 3: INSURANCE & CALCULATOR ==================== -->
      @if (activeTab === 'insurance') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Premium Calculator Widget -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">🧮</div>
              <h3 class="font-bold text-slate-900 text-base">PMFBY Premium Calculator</h3>
            </div>
            <p class="text-xs text-slate-500">Calculate government subsidized premium rates based on crop season & land size.</p>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Cultivation Season</label>
                <select [(ngModel)]="calcSeason" class="w-full px-3 py-2 border rounded-xl text-xs bg-white">
                  <option [value]="0">Kharif (2.0% rate)</option>
                  <option [value]="1">Rabi (1.5% rate)</option>
                  <option [value]="2">Summer (1.0% rate)</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Land Area (Acres)</label>
                <input type="number" [(ngModel)]="calcArea" placeholder="e.g. 5" class="w-full px-3 py-2 border rounded-xl text-xs">
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Sum Insured (₹)</label>
                <input type="number" [(ngModel)]="calcSumInsured" placeholder="e.g. 100000" class="w-full px-3 py-2 border rounded-xl text-xs">
              </div>

              <button (click)="calculatePremium()" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition">
                Compute Premium
              </button>

              @if (computedPremium !== null) {
                <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div class="text-xs text-blue-700">Estimated Total Premium</div>
                  <div class="text-xl font-extrabold text-blue-900">₹{{ computedPremium | number }}</div>
                </div>
              }
            </div>
          </div>

          <!-- Insurance Policies List -->
          <div class="lg:col-span-2 space-y-4">
            <h3 class="font-bold text-slate-900 text-lg">My Insurance Policies</h3>

            @if (insuranceApps.length === 0) {
              <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <div class="text-4xl mb-2">🛡️</div>
                <h4 class="font-bold text-slate-800">No active insurance applications</h4>
                <p class="text-xs text-slate-500 mt-1">Select an approved crop from "My Crops" and click "Insure Crop".</p>
              </div>
            } @else {
              <div class="space-y-3">
                @for (app of insuranceApps; track app.id) {
                  <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div class="flex items-center space-x-2">
                        <h4 class="font-bold text-slate-900">{{ app.cropName }}</h4>
                        <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">{{ app.status }}</span>
                      </div>
                      <div class="text-xs text-slate-500 mt-1">
                        Application #{{ app.id }} • Area: {{ app.landArea }} Acres • Season: {{ app.season }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xs text-slate-500">Sum Insured: <strong class="text-slate-900">₹{{ app.sumInsured | number }}</strong></div>
                      <div class="text-xs text-slate-500">Premium: <strong class="text-emerald-700">₹{{ app.premiumAmount | number }}</strong></div>
                    </div>
                  </div>
                }
              </div>
            }
          </div>

        </div>
      }

      <!-- ==================== TAB 4: CLAIMS ==================== -->
      @if (activeTab === 'claims') {
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-slate-900">Crop Damage Claims</h2>
            <button (click)="openClaimModal()" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition">
              + File Damage Claim
            </button>
          </div>

          @if (claims.length === 0) {
            <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <div class="text-4xl mb-2">📄</div>
              <h3 class="font-bold text-slate-800">No claims submitted</h3>
              <p class="text-xs text-slate-500 mt-1">In case of drought, floods, or pests, insured farmers can submit proof of damage for direct compensation.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              @for (claim of claims; track claim.id) {
                <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-xs font-bold text-slate-400">Claim #{{ claim.id }}</span>
                      <h4 class="font-bold text-slate-900 text-base mt-1">{{ claim.cropName }}</h4>
                    </div>
                    <span class="px-2.5 py-1 rounded-full text-xs font-semibold" [class.bg-emerald-100]="claim.status === 'Approved'" [class.text-emerald-800]="claim.status === 'Approved'" [class.bg-amber-100]="claim.status !== 'Approved'" [class.text-amber-800]="claim.status !== 'Approved'">
                      {{ claim.status }}
                    </span>
                  </div>

                  <div class="text-xs space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl">
                    <div><strong>Cause of Loss:</strong> {{ claim.causeOfLoss }}</div>
                    <div><strong>Date of Loss:</strong> {{ claim.dateOfLoss | date:'mediumDate' }}</div>
                  </div>

                  @if (claim.damageProofFiles && claim.damageProofFiles.length > 0) {
                    <div class="text-xs">
                      <span class="text-slate-500">Damage Proof Document:</span>
                      <a [href]="uploadService.getFullUrl(claim.damageProofFiles[0])" target="_blank" class="ml-2 text-emerald-600 font-semibold hover:underline">
                        View Uploaded Proof 📎
                      </a>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- ==================== TAB 5: AI AGRONOMIST ==================== -->
      @if (activeTab === 'ai') {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Query Form -->
          <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">🤖</div>
              <h3 class="font-bold text-slate-900 text-base">Ask AI Agronomist</h3>
            </div>
            <p class="text-xs text-slate-500">Get customized advice on fertilizer schedule, irrigation cycles, and pest protection for your specific crop.</p>

            <div class="space-y-3">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Select Crop</label>
                <select [(ngModel)]="aiSelectedCropId" class="w-full px-3 py-2 border rounded-xl text-xs bg-white">
                  <option [ngValue]="null">-- Choose your crop --</option>
                  @for (c of crops; track c.id) {
                    <option [value]="c.id">{{ c.cropName }} ({{ c.soilType }}, {{ c.season }})</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Your Question or Symptom</label>
                <textarea 
                  [(ngModel)]="aiPrompt" 
                  rows="3" 
                  placeholder="e.g. Leaves turning yellow after heavy rain, what fertilizer should I apply?" 
                  class="w-full px-3 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <button 
                (click)="askAi()" 
                [disabled]="!aiSelectedCropId || isAskingAi" 
                class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                @if (isAskingAi) {
                  <span>Consulting Agronomist...</span>
                } @else {
                  <span>Generate Agricultural Advice</span>
                }
              </button>
            </div>
          </div>

          <!-- Advice History -->
          <div class="lg:col-span-2 space-y-4">
            <h3 class="font-bold text-slate-900 text-lg">Advisory Responses & History</h3>

            @if (aiQueries.length === 0) {
              <div class="bg-white rounded-2xl p-10 text-center border border-slate-200">
                <div class="text-4xl mb-2">🌱</div>
                <h4 class="font-bold text-slate-800">No AI queries yet</h4>
                <p class="text-xs text-slate-500 mt-1">Select one of your registered crops on the left to receive AI recommendations.</p>
              </div>
            } @else {
              <div class="space-y-4">
                @for (query of aiQueries; track query.id) {
                  <div class="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-3">
                    <div class="flex justify-between items-start text-xs text-slate-400">
                      <span class="font-bold text-purple-700">Question: "{{ query.promptUsed }}"</span>
                      <span>{{ query.createdAt | date:'short' }}</span>
                    </div>

                    <div class="p-4 bg-purple-50/60 rounded-xl text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans border border-purple-100">
                      {{ query.aiResponse }}
                    </div>
                  </div>
                }
              </div>
            }
          </div>

        </div>
      }

      <!-- ==================== TAB 6: PROFILE & KYC ==================== -->
      @if (activeTab === 'profile') {
        <div class="max-w-2xl bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 class="text-xl font-bold text-slate-900">Farmer Profile & KYC Information</h2>
            <p class="text-xs text-slate-500 mt-1">Ensure your bank account and land documents are up to date for direct claim payouts.</p>
          </div>

          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4 text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Bank Account Number</label>
                <input type="text" formControlName="bankAccountNumber" class="w-full px-3 py-2 border rounded-xl text-xs font-mono">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">IFSC Code</label>
                <input type="text" formControlName="ifscCode" class="w-full px-3 py-2 border rounded-xl text-xs font-mono uppercase">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Total Land Area (Acres)</label>
                <input type="number" formControlName="landArea" class="w-full px-3 py-2 border rounded-xl text-xs">
              </div>
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Land Village / Address</label>
                <input type="text" formControlName="landAddress" class="w-full px-3 py-2 border rounded-xl text-xs">
              </div>
            </div>

            <!-- KYC Document Upload -->
            <div class="p-4 border border-dashed border-slate-300 rounded-xl space-y-2">
              <label class="block font-semibold text-slate-700">Upload KYC Verification Document (Aadhaar / Passbook)</label>
              <input type="file" (change)="onKycFileSelected($event)" accept=".pdf,.png,.jpg,.jpeg" class="text-xs">
              @if (uploadedKycPath) {
                <div class="text-xs text-emerald-600 font-semibold">✓ Document Uploaded: {{ uploadedKycPath }}</div>
              }
            </div>

            <button type="submit" [disabled]="profileForm.invalid || isSavingProfile" class="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition disabled:opacity-50">
              {{ isSavingProfile ? 'Saving...' : 'Save Profile Details' }}
            </button>
          </form>
        </div>
      }

      <!-- ==================== MODAL: ADD CROP ==================== -->
      @if (showAddCropModal) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Register New Produce</h3>
              <button (click)="showAddCropModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <form [formGroup]="cropForm" (ngSubmit)="submitCrop()" class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Crop Name</label>
                <input type="text" formControlName="cropName" placeholder="e.g. Basmati Rice, Wheat, Cotton" class="w-full px-3 py-2 border rounded-xl">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Crop Type</label>
                  <input type="text" formControlName="cropType" placeholder="e.g. Cereal, Pulses" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Soil Type</label>
                  <input type="text" formControlName="soilType" placeholder="e.g. Alluvial, Black Soil" class="w-full px-3 py-2 border rounded-xl">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Season</label>
                  <input type="text" formControlName="season" placeholder="e.g. Kharif, Rabi" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Location / District</label>
                  <input type="text" formControlName="location" placeholder="e.g. Nashik, Punjab" class="w-full px-3 py-2 border rounded-xl">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Quantity (Quintals)</label>
                  <input type="number" formControlName="quantity" placeholder="50" class="w-full px-3 py-2 border rounded-xl">
                </div>
                <div>
                  <label class="block font-semibold text-slate-600 mb-1">Base Price (₹)</label>
                  <input type="number" formControlName="basePrice" placeholder="2500" class="w-full px-3 py-2 border rounded-xl">
                </div>
              </div>

              <div class="flex space-x-3 pt-3">
                <button type="button" (click)="showAddCropModal = false" class="w-1/2 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">Cancel</button>
                <button type="submit" [disabled]="cropForm.invalid || isSubmittingCrop" class="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold disabled:opacity-50">
                  {{ isSubmittingCrop ? 'Saving...' : 'Register Crop' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- ==================== MODAL: APPLY INSURANCE ==================== -->
      @if (showInsuranceModal && selectedCropForInsurance) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">Apply Insurance for {{ selectedCropForInsurance.cropName }}</h3>
              <button (click)="showInsuranceModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Season</label>
                <select [(ngModel)]="insuranceSeason" class="w-full px-3 py-2 border rounded-xl bg-white">
                  <option [value]="0">Kharif</option>
                  <option [value]="1">Rabi</option>
                  <option [value]="2">Summer</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Zone</label>
                <select [(ngModel)]="insuranceZone" class="w-full px-3 py-2 border rounded-xl bg-white">
                  <option [value]="0">North</option>
                  <option [value]="1">South</option>
                  <option [value]="2">East</option>
                  <option [value]="3">West</option>
                  <option [value]="4">Central</option>
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Insured Land Area (Acres)</label>
                <input type="number" [(ngModel)]="insuranceLandArea" placeholder="5" class="w-full px-3 py-2 border rounded-xl">
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Total Sum Insured (₹)</label>
                <input type="number" [(ngModel)]="insuranceSumInsured" placeholder="100000" class="w-full px-3 py-2 border rounded-xl">
              </div>

              <div class="flex space-x-3 pt-3">
                <button type="button" (click)="showInsuranceModal = false" class="w-1/2 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">Cancel</button>
                <button type="button" (click)="submitInsuranceApplication()" [disabled]="isSubmittingInsurance" class="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold disabled:opacity-50">
                  {{ isSubmittingInsurance ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ==================== MODAL: DAMAGE CLAIM ==================== -->
      @if (showClaimModal) {
        <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div class="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">File Insurance Damage Claim</h3>
              <button (click)="showClaimModal = false" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label class="block font-semibold text-slate-600 mb-1">Select Approved Policy</label>
                <select [(ngModel)]="claimAppId" class="w-full px-3 py-2 border rounded-xl bg-white">
                  <option [ngValue]="null">-- Select an Insurance Policy --</option>
                  @for (app of insuranceApps; track app.id) {
                    <option [value]="app.id">{{ app.cropName }} (Policy #{{ app.id }}, Sum: ₹{{ app.sumInsured | number }})</option>
                  }
                </select>
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Cause of Damage / Loss</label>
                <input type="text" [(ngModel)]="claimCause" placeholder="e.g. Severe Hailstorm / Flash Flooding" class="w-full px-3 py-2 border rounded-xl">
              </div>

              <div>
                <label class="block font-semibold text-slate-600 mb-1">Date of Incident</label>
                <input type="date" [(ngModel)]="claimDate" class="w-full px-3 py-2 border rounded-xl">
              </div>

              <div class="p-3 border border-dashed rounded-xl space-y-1">
                <label class="block font-semibold text-slate-700">Attach Damage Proof (Photo / PDF)</label>
                <input type="file" (change)="onDamageFileSelected($event)" accept=".pdf,.png,.jpg,.jpeg" class="text-xs">
                @if (uploadedClaimProofPath) {
                  <div class="text-[11px] text-emerald-600 font-semibold">✓ Attached: {{ uploadedClaimProofPath }}</div>
                }
              </div>

              <div class="flex space-x-3 pt-3">
                <button type="button" (click)="showClaimModal = false" class="w-1/2 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold">Cancel</button>
                <button type="button" (click)="submitClaim()" [disabled]="!claimAppId || !claimCause || !uploadedClaimProofPath || isSubmittingClaim" class="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold disabled:opacity-50">
                  {{ isSubmittingClaim ? 'Submitting...' : 'File Claim' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class FarmerDashboardComponent implements OnInit {
  activeTab: FarmerTab = 'crops';
  actionMessage = '';
  isSuccess = true;

  // Crops
  crops: any[] = [];
  isLoadingCrops = true;
  showAddCropModal = false;
  isSubmittingCrop = false;
  cropForm: FormGroup;

  // Sell Requests
  sellRequests: SellRequestResponse[] = [];

  // Insurance
  insuranceApps: InsuranceApplicationResponse[] = [];
  calcSeason = 0;
  calcArea = 5;
  calcSumInsured = 100000;
  computedPremium: number | null = null;
  showInsuranceModal = false;
  selectedCropForInsurance: any = null;
  insuranceSeason = 0;
  insuranceZone = 0;
  insuranceLandArea = 5;
  insuranceSumInsured = 100000;
  isSubmittingInsurance = false;

  // Claims
  claims: ClaimResponse[] = [];
  showClaimModal = false;
  claimAppId: number | null = null;
  claimCause = '';
  claimDate = new Date().toISOString().split('T')[0];
  uploadedClaimProofPath = '';
  isSubmittingClaim = false;

  // AI
  aiQueries: AIQueryLog[] = [];
  aiSelectedCropId: number | null = null;
  aiPrompt = '';
  isAskingAi = false;

  // Profile
  profileForm: FormGroup;
  uploadedKycPath = '';
  isSavingProfile = false;

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private sellRequestService: SellRequestService,
    private insuranceService: InsuranceService,
    private claimService: ClaimService,
    private aiService: AIService,
    private profileService: ProfileService,
    public uploadService: UploadService,
    public authService: AuthService
  ) {
    this.cropForm = this.fb.group({
      cropName: ['', Validators.required],
      cropType: ['', Validators.required],
      soilType: ['', Validators.required],
      season: ['', Validators.required],
      location: ['', Validators.required],
      quantity: [10, [Validators.required, Validators.min(1)]],
      basePrice: [1000, [Validators.required, Validators.min(100)]]
    });

    this.profileForm = this.fb.group({
      bankAccountNumber: ['', Validators.required],
      ifscCode: ['', Validators.required],
      landArea: [0],
      landAddress: ['']
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loadCrops();
    this.loadSellRequests();
    this.loadInsurance();
    this.loadClaims();
    this.loadAiQueries();
    this.loadProfile();
  }

  loadCrops(): void {
    this.isLoadingCrops = true;
    this.cropService.getMyCrops(1, 50).subscribe({
      next: (res) => {
        this.crops = res.data || [];
        this.isLoadingCrops = false;
      },
      error: () => this.isLoadingCrops = false
    });
  }

  loadSellRequests(): void {
    this.sellRequestService.getAllSellRequests(1, 50).subscribe({
      next: (res) => this.sellRequests = res.data || [],
      error: () => {}
    });
  }

  loadInsurance(): void {
    this.insuranceService.getMyApplications(1, 50).subscribe({
      next: (res) => this.insuranceApps = res.data || [],
      error: () => {}
    });
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (res) => this.claims = res.data || [],
      error: () => {}
    });
  }

  loadAiQueries(): void {
    this.aiService.getMyQueries().subscribe({
      next: (res) => this.aiQueries = res.data || [],
      error: () => {}
    });
  }

  loadProfile(): void {
    this.profileService.getMyProfile().subscribe({
      next: (res) => {
        if (res.data) {
          this.profileForm.patchValue({
            bankAccountNumber: res.data.bankAccountNumber,
            ifscCode: res.data.ifscCode,
            landArea: res.data.landArea,
            landAddress: res.data.landAddress
          });
        }
      },
      error: () => {}
    });
  }

  // Crop Actions
  openAddCropModal(): void {
    this.showAddCropModal = true;
    this.actionMessage = '';
  }

  submitCrop(): void {
    if (this.cropForm.invalid) return;

    this.isSubmittingCrop = true;
    this.cropService.createCrop(this.cropForm.value).subscribe({
      next: (res) => {
        this.isSubmittingCrop = false;
        this.showAddCropModal = false;
        this.cropForm.reset({ quantity: 10, basePrice: 1000 });
        this.isSuccess = true;
        this.actionMessage = 'Produce registered successfully! Awaiting admin approval before auctioning.';
        this.loadCrops();
      },
      error: (err) => {
        this.isSubmittingCrop = false;
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to register crop.';
      }
    });
  }

  createAuctionRequest(cropId: number): void {
    this.sellRequestService.createSellRequest(cropId).subscribe({
      next: () => {
        this.isSuccess = true;
        this.actionMessage = 'Sell request submitted for auction approval!';
        this.loadSellRequests();
      },
      error: (err) => {
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to submit sell request.';
      }
    });
  }

  // Insurance Actions
  calculatePremium(): void {
    this.insuranceService.calculatePremium({
      sumInsured: this.calcSumInsured,
      landArea: this.calcArea,
      season: Number(this.calcSeason) as SeasonType
    }).subscribe({
      next: (res) => this.computedPremium = res.data?.premiumAmount || 0,
      error: () => {}
    });
  }

  openInsuranceModal(crop: any): void {
    this.selectedCropForInsurance = crop;
    this.showInsuranceModal = true;
  }

  submitInsuranceApplication(): void {
    if (!this.selectedCropForInsurance) return;

    this.isSubmittingInsurance = true;
    this.insuranceService.applyInsurance({
      cropId: this.selectedCropForInsurance.id || this.selectedCropForInsurance.Id,
      cropName: this.selectedCropForInsurance.cropName || this.selectedCropForInsurance.CropName,
      season: Number(this.insuranceSeason),
      zone: Number(this.insuranceZone),
      landArea: this.insuranceLandArea,
      sumInsured: this.insuranceSumInsured
    }).subscribe({
      next: () => {
        this.isSubmittingInsurance = false;
        this.showInsuranceModal = false;
        this.isSuccess = true;
        this.actionMessage = 'Insurance application submitted successfully!';
        this.loadInsurance();
      },
      error: (err) => {
        this.isSubmittingInsurance = false;
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to apply for insurance.';
      }
    });
  }

  // Claim Actions
  openClaimModal(): void {
    this.showClaimModal = true;
  }

  onDamageFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res) => this.uploadedClaimProofPath = res.filePath,
        error: () => alert('Failed to upload damage proof file.')
      });
    }
  }

  submitClaim(): void {
    if (!this.claimAppId || !this.claimCause || !this.uploadedClaimProofPath) return;

    this.isSubmittingClaim = true;
    this.claimService.createClaim({
      insuranceApplicationId: Number(this.claimAppId),
      causeOfLoss: this.claimCause,
      dateOfLoss: this.claimDate,
      damageProofFilePath: this.uploadedClaimProofPath
    }).subscribe({
      next: () => {
        this.isSubmittingClaim = false;
        this.showClaimModal = false;
        this.isSuccess = true;
        this.actionMessage = 'Disaster damage claim submitted with proof document!';
        this.loadClaims();
      },
      error: (err) => {
        this.isSubmittingClaim = false;
        this.isSuccess = false;
        this.actionMessage = err.error?.message || 'Failed to file claim.';
      }
    });
  }

  // AI Actions
  askAi(): void {
    if (!this.aiSelectedCropId) return;

    this.isAskingAi = true;
    this.aiService.askAi({
      cropId: Number(this.aiSelectedCropId),
      prompt: this.aiPrompt
    }).subscribe({
      next: () => {
        this.isAskingAi = false;
        this.aiPrompt = '';
        this.loadAiQueries();
      },
      error: () => this.isAskingAi = false
    });
  }

  // Profile Actions
  onKycFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadService.uploadFile(file).subscribe({
        next: (res) => this.uploadedKycPath = res.filePath,
        error: () => alert('Failed to upload KYC document.')
      });
    }
  }

  saveProfile(): void {
    this.isSavingProfile = true;
    const val = this.profileForm.value;
    const docs = this.uploadedKycPath ? [{ documentType: 0, filePath: this.uploadedKycPath }] : [];

    this.profileService.createProfile({
      profileType: 0,
      bankAccountNumber: val.bankAccountNumber,
      ifscCode: val.ifscCode,
      landArea: val.landArea,
      landAddress: val.landAddress,
      documents: docs
    }).subscribe({
      next: () => {
        this.isSavingProfile = false;
        this.isSuccess = true;
        this.actionMessage = 'Profile updated successfully!';
      },
      error: () => {
        // Fallback update
        this.profileService.updateProfile({
          bankAccountNumber: val.bankAccountNumber,
          ifscCode: val.ifscCode,
          landArea: val.landArea,
          landAddress: val.landAddress,
          documents: docs
        }).subscribe({
          next: () => {
            this.isSavingProfile = false;
            this.isSuccess = true;
            this.actionMessage = 'Profile updated successfully!';
          },
          error: (err) => {
            this.isSavingProfile = false;
            this.isSuccess = false;
            this.actionMessage = err.error?.message || 'Error updating profile.';
          }
        });
      }
    });
  }
}
