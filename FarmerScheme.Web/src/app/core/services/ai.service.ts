import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AIQueryLog, AskAiDto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = `${environment.apiUrl}/AI`;

  constructor(private http: HttpClient) {}

  askAi(dto: AskAiDto): Observable<ApiResponse<AIQueryLog>> {
    return this.http.post<ApiResponse<AIQueryLog>>(`${this.apiUrl}/ask`, dto);
  }

  getMyQueries(): Observable<ApiResponse<AIQueryLog[]>> {
    return this.http.get<ApiResponse<AIQueryLog[]>>(`${this.apiUrl}/history`);
  }
}
