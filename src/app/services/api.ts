import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Inyectamos el cliente HTTP
  private http = inject(HttpClient);

  // URL base de tu API (Cámbiala por la real cuando la tengas)
  private apiUrl = 'https://jsonplaceholder.typicode.com'; 

  constructor() { }

  // Ejemplo: Obtener lista de usuarios
  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // Ejemplo: Obtener un solo dato por ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  // Ejemplo: Crear algo (POST)
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data);
  }
}