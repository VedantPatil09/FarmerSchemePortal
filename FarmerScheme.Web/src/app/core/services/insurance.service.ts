import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  InsuranceApplicationResponse,
  CreateInsuranceApplicationDto,
  SeasonType
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private apiUrl = `${environment.apiUrl}/Insurance`;

  constructor(private http: HttpClient) {}

  applyInsurance(dto: CreateInsuranceApplicationDto): Observable<ApiResponse<InsuranceApplicationResponse>> {
    return this.http.post<ApiResponse<InsuranceApplicationResponse>>(`${this.apiUrl}/apply`, dto);
  }

  getMyApplications(page = 1, pageSize = 20): Observable<ApiResponse<InsuranceApplicationResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<InsuranceApplicationResponse[]>>(this.apiUrl, { params });
  }

  getAllApplications(page = 1, pageSize = 20): Observable<ApiResponse<InsuranceApplicationResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<InsuranceApplicationResponse[]>>(`${this.apiUrl}/all`, { params });
  }

  approveInsurance(applicationId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/approve/${applicationId}`, {});
  }

  calculatePremium(data: { sumInsured: number; landArea: number; season: SeasonType }): Observable<ApiResponse<{ premiumAmount: number }>> {
    return this.http.post<ApiResponse<{ premiumAmount: number }>>(`${this.apiUrl}/calculate`, data);
  }
}
