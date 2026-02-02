import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Prescription, CreatePrescriptionDto, UpdatePrescriptionDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  private readonly API_URL = `${environment.apiUrl}/prescriptions`;
  private http = inject(HttpClient);

  getAll(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(this.API_URL);
  }

  getById(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.API_URL}/${id}`);
  }

  getByClientRut(rut: string): Observable<Prescription[]> {
    const params = new HttpParams().set('rut', rut);
    return this.http.get<Prescription[]>(`${this.API_URL}/by-rut`, { params });
  }

  getLatestByClientRut(rut: string): Observable<Prescription | null> {
    const params = new HttpParams().set('rut', rut);
    return this.http.get<Prescription | null>(`${this.API_URL}/latest-by-rut`, { params });
  }

  search(filters: {
    rut?: string;
    nombre?: string;
    fechaDesde?: string;
    fechaHasta?: string;
  }): Observable<Prescription[]> {
    let params = new HttpParams();
    if (filters.rut) params = params.set('rut', filters.rut);
    if (filters.nombre) params = params.set('nombre', filters.nombre);
    if (filters.fechaDesde) params = params.set('fechaDesde', filters.fechaDesde);
    if (filters.fechaHasta) params = params.set('fechaHasta', filters.fechaHasta);
    return this.http.get<Prescription[]>(`${this.API_URL}/search`, { params });
  }

  create(prescription: CreatePrescriptionDto): Observable<Prescription> {
    return this.http.post<Prescription>(this.API_URL, prescription);
  }

  update(id: string, prescription: UpdatePrescriptionDto): Observable<Prescription> {
    return this.http.patch<Prescription>(`${this.API_URL}/${id}`, prescription);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
