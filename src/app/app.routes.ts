import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; // 1. Importamos tu Guard

export const routes: Routes = [
  // --- RUTAS PÚBLICAS (Cualquiera puede entrar) ---
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
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard] // 🔒
  },
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage),
    canActivate: [AuthGuard] // 🔒
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage),
    canActivate: [AuthGuard] // 🔒
  },
  {
    // Ruta con parámetro (ID)
    path: 'link-trabajo/:id',
    loadComponent: () => import('./pages/link-trabajo/link-trabajo.page').then(m => m.LinkTrabajoPage),
    canActivate: [AuthGuard] // 🔒
  },
  {
    path: 'agregar',
    loadComponent: () => import('./pages/agregar/agregar.page').then( m => m.AgregarPage),
    canActivate: [AuthGuard] // 🔒
  },
  {
    path: 'modificar',
    loadComponent: () => import('./pages/modificar/modificar.page').then( m => m.ModificarPage),
    canActivate: [AuthGuard] // 🔒
  },

  // --- MANEJO DE ERRORES (Pública) ---
  {
    path: '**',
    loadComponent: () => import('./pages/error404/error404.page').then( m => m.Error404Page)
  }
];