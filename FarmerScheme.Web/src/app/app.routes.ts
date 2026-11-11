import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { OpenAuctionsComponent } from './pages/auctions/open-auctions.component';
import { FarmerDashboardComponent } from './pages/farmer/farmer-dashboard/farmer-dashboard.component';
import { BidderDashboardComponent } from './pages/bidder/bidder-dashboard/bidder-dashboard.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'open-auctions', component: OpenAuctionsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'farmer',
    component: FarmerDashboardComponent,
    canActivate: [authGuard, roleGuard(['Farmer'])]
  },
  {
    path: 'bidder',
    component: BidderDashboardComponent,
    canActivate: [authGuard, roleGuard(['Bidder'])]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['Admin'])]
  },
  { path: '**', redirectTo: '' }
];
