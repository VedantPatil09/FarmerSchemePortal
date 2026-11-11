import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, RoleType, UserAuthInfo } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'farmer_scheme_token';
  private readonly USER_KEY = 'farmer_scheme_user';
  private apiUrl = `${environment.apiUrl}/auth`;

  // Reactive user state using Angular Signals
  currentUser = signal<UserAuthInfo | null>(this.getStoredUser());
  isAuthenticated = computed(() => !!this.currentUser());
  userRole = computed(() => this.currentUser()?.role || null);
  isFarmer = computed(() => this.currentUser()?.role === RoleType.Farmer);
  isBidder = computed(() => this.currentUser()?.role === RoleType.Bidder);
  isAdmin = computed(() => this.currentUser()?.role === RoleType.Admin);

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<ApiResponse<{ token: string }>> {
    return this.http.post<ApiResponse<{ token: string }>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.data?.token) {
          this.setSession(res.data.token);
        }
      })
    );
  }

  register(userData: {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: number;
    password: string;
  }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/register`, userData);
  }

  forgotPassword(email: string): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: { token: string; newPassword: string }): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.apiUrl}/reset-password`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setSession(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    const decoded = this.decodeToken(token);
    if (decoded) {
      const userInfo: UserAuthInfo = {
        id: Number(decoded.nameid || decoded.sub || 0),
        email: decoded.email || '',
        role: decoded.role as RoleType,
        token
      };
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
      this.currentUser.set(userInfo);
    }
  }

  private getStoredUser(): UserAuthInfo | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decodedJson = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decodedJson);
    } catch {
      return null;
    }
  }
}
