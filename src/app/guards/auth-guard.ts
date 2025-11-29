import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DBTaskService } from '../services/dbservice'; // Asegúrate que el import coincida con tu archivo

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private router = inject(Router);
  private dbTask = inject(DBTaskService);

  async canActivate(): Promise<boolean> {
    // CORRECCIÓN: El método correcto en dbtask.service.ts es isSessionActive()
    // Antes decía: isAuthenticated() -> Esto causaba el error
    const isAuthenticated = await this.dbTask.isSessionActive();

    if (isAuthenticated) {
      return true;
    } else {
      console.log('⛔ Acceso denegado. Redirigiendo al Login...');
      this.router.navigate(['/login']);
      return false;
    }
  }
}