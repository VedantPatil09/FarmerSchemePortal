import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, CropResponse, CreateCropDto } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CropService {
  private apiUrl = `${environment.apiUrl}/Crop`;

  constructor(private http: HttpClient) {}

  getMyCrops(page = 1, pageSize = 20): Observable<ApiResponse<CropResponse[]>> {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);
    return this.http.get<ApiResponse<CropResponse[]>>(this.apiUrl, { params });
  }

  getCropById(cropId: number): Observable<ApiResponse<CropResponse>> {
    return this.http.get<ApiResponse<CropResponse>>(`${this.apiUrl}/${cropId}`);
  }

  createCrop(dto: CreateCropDto): Observable<ApiResponse<CropResponse>> {
    return this.http.post<ApiResponse<CropResponse>>(this.apiUrl, dto);
  }

  updateCrop(cropId: number, dto: Partial<CreateCropDto>): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/${cropId}`, dto);
  }

  deleteCrop(cropId: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${cropId}`);
  }
}
