import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, BidResponse, PlaceBidDto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  private apiUrl = `${environment.apiUrl}/Bid`;

  constructor(private http: HttpClient) {}

  placeBid(dto: PlaceBidDto): Observable<ApiResponse<BidResponse>> {
    return this.http.post<ApiResponse<BidResponse>>(this.apiUrl, dto);
  }

  getBidsForAuction(sellRequestId: number): Observable<ApiResponse<BidResponse[]>> {
    return this.http.get<ApiResponse<BidResponse[]>>(`${this.apiUrl}/${sellRequestId}`);
  }

  getBidHistory(sellRequestId: number): Observable<ApiResponse<BidResponse[]>> {
    return this.http.get<ApiResponse<BidResponse[]>>(`${this.apiUrl}/history/${sellRequestId}`);
  }
}
