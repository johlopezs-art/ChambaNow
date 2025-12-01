import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; // Importamos el Guard

export const routes: Routes = [
  // --- RUTAS PÚBLICAS ---
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },

  // --- RUTAS PROTEGIDAS (Necesitan Login 🔒) ---
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage),
    canActivate: [AuthGuard] // Protegido
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./pages/solicitudes/solicitudes.page').then( m => m.SolicitudesPage),
    canActivate: [AuthGuard] // Protegido
  },
  {
    path: 'bandeja',
    loadComponent: () => import('./pages/bandeja/bandeja.page').then( m => m.BandejaPage),
    canActivate: [AuthGuard] // Protegido
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage),
    canActivate: [AuthGuard] // Protegido
  },
  {
    // Ruta con parámetro (ID) para ver detalle de trabajo
    path: 'link-trabajo/:id',
    loadComponent: () => import('./pages/link-trabajo/link-trabajo.page').then( m => m.LinkTrabajoPage),
    canActivate: [AuthGuard] // Protegido
  },
  {
    path: 'modificar', // Si decides usarla en el futuro
    loadComponent: () => import('./pages/modificar/modificar.page').then( m => m.ModificarPage),
    canActivate: [AuthGuard] // Protegido
  },

  // --- MANEJO DE ERRORES (SIEMPRE AL FINAL) ---
  {
    path: '**', // Ruta comodín para 404
    loadComponent: () => import('./pages/error404/error404.page').then( m => m.Error404Page)
  },
];