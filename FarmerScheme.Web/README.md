# KisanSetu - Farmer Scheme Portal Web Frontend

A modern, responsive Angular 20 web application for the **Farmer Scheme Portal** (`FarmerScheme.API`).

## 🌾 Features

- **Authentication & Security:**
  - Role-based access control for **Farmer**, **Bidder**, and **Admin**.
  - Encrypted JWT Bearer authentication interceptor with auto-redirect on session expiry.
  - Forgot password request & token-based password reset workflow.
- **Farmer Portal:**
  - **Produce Management:** Register new harvest lots with crop type, soil type, season, location, quantity, and base price.
  - **Auction Initiation:** Put certified produce up for live public bidding with real-time status.
  - **PMFBY Crop Insurance:** Integrated premium calculation for Kharif (2%), Rabi (1.5%), and Summer (1%) crops, and instant policy submission.
  - **Disaster Claims:** File damage claims with PDF/image proof uploads during weather/pest calamities.
  - **AI Agronomist:** Personalized agricultural recommendations for soil nutrients, irrigation schedules, and pest mitigation.
  - **Farmer KYC:** Profile management with banking (account number, IFSC) and land ownership document uploads.
- **Bidder Marketplace:**
  - Real-time marketplace of active auctions with crop details, quantities, and current highest bids.
  - Instant competitive bidding with validation against current highest bid.
  - Complete bidding audit history per auction lot.
  - Corporate trading profile and bank account management.
- **Admin Command Center:**
  - Review and approve pending farmer and bidder registrations.
  - Verify and approve submitted crops before they can be auctioned.
  - Approve sell requests to start public bidding, and close auctions to award winning bids.
  - Adjudicate crop insurance applications and approve damage claim compensation.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+)
- .NET 8 SDK (for backend API)

### 2. Run the Backend API
```powershell
cd D:\Projects\FarmerScheme\FarmerScheme.API
dotnet run
```
API runs on `http://localhost:5003` (Swagger: `http://localhost:5003/swagger`).

### 3. Run the Angular Frontend
```powershell
cd D:\Projects\FarmerScheme\FarmerScheme.Web
npm start
```
Navigate to `http://localhost:4200/` in your browser.
