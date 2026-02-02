import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client, CreateClientDto, UpdateClientDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private apiUrl = `${environment.apiUrl}/clients`;
  private http = inject(HttpClient);

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  getByRut(rut: string): Observable<Client | null> {
    return this.http.get<Client | null>(`${this.apiUrl}/by-rut/${encodeURIComponent(rut)}`);
  }

  search(params: { rut?: string; nombre?: string; email?: string }): Observable<Client[]> {
    let httpParams = new HttpParams();
    if (params.rut) httpParams = httpParams.set('rut', params.rut);
    if (params.nombre) httpParams = httpParams.set('nombre', params.nombre);
    if (params.email) httpParams = httpParams.set('email', params.email);
    return this.http.get<Client[]>(`${this.apiUrl}/search`, { params: httpParams });
  }

  create(client: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  update(id: string, client: UpdateClientDto): Observable<Client> {
    return this.http.patch<Client>(`${this.apiUrl}/${id}`, client);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findOrCreate(client: CreateClientDto): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/find-or-create`, client);
  }
}
