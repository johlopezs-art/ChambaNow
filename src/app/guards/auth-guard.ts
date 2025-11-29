import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  // Usamos inject() para modernizar la inyección de dependencias
  private router = inject(Router);

  canActivate(): boolean {
    // 1. Verificamos directamente en localStorage si existe la sesión
    // Asumimos que guardaste algo bajo la llave 'usuario' o 'token' al hacer login
    const usuarioLogueado = localStorage.getItem('usuario'); 

    if (usuarioLogueado) {
      return true; // ✅ Pasa, hay datos guardados
    } else {
      // 2. Si NO hay datos en localStorage, lo mandamos al Login
      console.log('⛔ Acceso denegado (No hay sesión), redirigiendo al Login...');
      this.router.navigate(['/login']);
      return false; // 🚫 Bloqueado
    }
  }
}