import { Routes } from '@angular/router';

export const routes: Routes = [
  // Ruta inicial (Home, si aplica)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  // Redirección por defecto
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Rutas de Autenticación
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  // Rutas Principales
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage)
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage)
  },
  // ⬅️ RUTA DE DETALLE DE TRABAJO (CON PARÁMETRO) - CORREGIDA
  // NOTA: Eliminamos la ruta 'link-trabajo' sin ID para evitar ambigüedad.
  { 
    path: 'link-trabajo/:id', 
    loadComponent: () => import('./pages/link-trabajo/link-trabajo.page').then(m => m.LinkTrabajoPage)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/error404/error404.page').then( m => m.Error404Page)
  }
];