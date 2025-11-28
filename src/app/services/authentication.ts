import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <--- 1. Importamos la herramienta API

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Variable para simular si el usuario está logueado
  private isAuthenticated = false;

  // 2. Inyectamos el HttpClient en el constructor
  constructor(private http: HttpClient) { }

  // Método que consultará el Guard
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Métodos para usar en tu Login Page
  login() {
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }

  // --- EJEMPLO DE USO (Puedes probarlo después) ---
  // Cuando quieras traer datos reales, crearías funciones así:
  // obtenerUsuarios() {
  //   return this.http.get('https://jsonplaceholder.typicode.com/users');
  // }
}