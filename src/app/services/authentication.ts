import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Variable para simular si el usuario está logueado
  private isAuthenticated = false;

  constructor() { }

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
}