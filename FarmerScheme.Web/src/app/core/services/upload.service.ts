import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UploadResponse {
  success: boolean;
  filePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<UploadResponse>(this.apiUrl, formData);
  }

  getFullUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    return `${environment.baseUrl}${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
  }
}
