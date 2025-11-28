import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // 1. Preguntamos al servicio si está logueado
    if (this.authService.isLoggedIn()) {
      return true; // ✅ Pasa
    } else {
      // 2. Si NO está logueado, lo mandamos al Login
      console.log('⛔ Acceso denegado, redirigiendo al Login...');
      this.router.navigate(['/login']);
      return false; // 🚫 Bloqueado
    }
  }
}