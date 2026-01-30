import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

export interface CreateUserDto {
  email: string;
  password: string;
  nombre: string;
  rut: string;
  role: 'admin' | 'vendedor';
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  nombre?: string;
  rut?: string;
  role?: 'admin' | 'vendedor';
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = `${environment.apiUrl}/users`;
  private http = inject(HttpClient);

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  create(user: CreateUserDto): Observable<User> {
    return this.http.post<User>(this.API_URL, user);
  }

  update(id: string, user: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
