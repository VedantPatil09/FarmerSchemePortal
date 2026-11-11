import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ProfileResponse, CreateProfileDto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/Profile`;

  constructor(private http: HttpClient) {}

  getMyProfile(): Observable<ApiResponse<ProfileResponse>> {
    return this.http.get<ApiResponse<ProfileResponse>>(this.apiUrl);
  }

  createProfile(dto: CreateProfileDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, dto);
  }

  updateProfile(dto: Partial<CreateProfileDto>): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(this.apiUrl, dto);
  }

  deleteProfile(): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(this.apiUrl);
  }
}
