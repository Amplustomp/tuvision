import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkOrder, CreateWorkOrderDto, UpdateWorkOrderDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private readonly API_URL = `${environment.apiUrl}/work-orders`;
  private http = inject(HttpClient);

  getAll(): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(this.API_URL);
  }

  getById(id: string): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.API_URL}/${id}`);
  }

  getByOrderNumber(numeroOrden: number): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.API_URL}/by-number/${numeroOrden}`);
  }

  getByCustomerRut(rut: string): Observable<WorkOrder[]> {
    const params = new HttpParams().set('rut', rut);
    return this.http.get<WorkOrder[]>(`${this.API_URL}/by-rut`, { params });
  }

  create(workOrder: CreateWorkOrderDto): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(this.API_URL, workOrder);
  }

  update(id: string, workOrder: UpdateWorkOrderDto): Observable<WorkOrder> {
    return this.http.patch<WorkOrder>(`${this.API_URL}/${id}`, workOrder);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
