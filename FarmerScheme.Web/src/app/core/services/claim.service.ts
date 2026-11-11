import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, ClaimResponse, CreateClaimDto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiUrl = `${environment.apiUrl}/Claim`;

  constructor(private http: HttpClient) {}

  createClaim(dto: CreateClaimDto): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(this.apiUrl, dto);
  }

  approveClaim(claimId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/process/${claimId}`, {});
  }

  getClaims(): Observable<ApiResponse<ClaimResponse[]>> {
    return this.http.get<ApiResponse<ClaimResponse[]>>(this.apiUrl);
  }
}
