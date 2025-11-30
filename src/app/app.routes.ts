import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; // Asegúrate de que el nombre del archivo sea correcto

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
    path: 'home', 
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'principal',
    loadComponent: () => import('./pages/principal/principal.page').then( m => m.PrincipalPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./pages/datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage),
    canActivate: [AuthGuard]
  },
  {
    // Ruta con parámetro (ID) para ver detalle de trabajo
    path: 'link-trabajo/:id',
    loadComponent: () => import('./pages/link-trabajo/link-trabajo.page').then(m => m.LinkTrabajoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitudes', 
    loadComponent: () => import('./pages/solicitudes/solicitudes.page').then( m => m.SolicitudesPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'bandeja', // Nueva ruta para ver postulaciones y ofertas
    loadComponent: () => import('./pages/bandeja/bandeja.page').then( m => m.BandejaPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'agregar',
    loadComponent: () => import('./pages/agregar/agregar.page').then( m => m.AgregarPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'modificar',
    loadComponent: () => import('./pages/modificar/modificar.page').then( m => m.ModificarPage),
    canActivate: [AuthGuard]
  },

  // --- MANEJO DE ERRORES (SIEMPRE AL FINAL) ---
  {
    path: '**',
    loadComponent: () => import('./pages/error404/error404.page').then( m => m.Error404Page)
  }
];