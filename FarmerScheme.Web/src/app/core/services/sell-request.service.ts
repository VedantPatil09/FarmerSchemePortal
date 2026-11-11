import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, SellRequestResponse, OpenAuctionItem } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class SellRequestService {
  private apiUrl = `${environment.apiUrl}/SellRequest`;

  constructor(private http: HttpClient) {}

  createSellRequest(cropId: number): Observable<ApiResponse<SellRequestResponse>> {
    return this.http.post<ApiResponse<SellRequestResponse>>(this.apiUrl, { cropId });
  }

  getAllSellRequests(page = 1, pageSize = 20): Observable<ApiResponse<SellRequestResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<SellRequestResponse[]>>(this.apiUrl, { params });
  }

  getOpenAuctions(page = 1, pageSize = 20): Observable<ApiResponse<OpenAuctionItem[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<OpenAuctionItem[]>>(`${this.apiUrl}/open-auctions`, { params });
  }

  approveSellRequest(sellRequestId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/approve/${sellRequestId}`, {});
  }

  closeAuction(sellRequestId: number): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/close/${sellRequestId}`, {});
  }

  getAuctionResult(sellRequestId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/result/${sellRequestId}`);
  }
}
