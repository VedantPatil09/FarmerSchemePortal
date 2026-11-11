import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, UserResponse, CropResponse, SellRequestResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getPendingUsers(page = 1, pageSize = 20): Observable<ApiResponse<UserResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/pending-users`, { params });
  }

  approveUser(userId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/approve-user/${userId}`, {});
  }

  getPendingCrops(page = 1, pageSize = 20): Observable<ApiResponse<CropResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<CropResponse[]>>(`${this.apiUrl}/pending-crops`, { params });
  }

  approveCrop(cropId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/approve-crop/${cropId}`, {});
  }

  getPendingSellRequests(page = 1, pageSize = 20): Observable<ApiResponse<SellRequestResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<SellRequestResponse[]>>(`${this.apiUrl}/pending-sellrequests`, { params });
  }
}
