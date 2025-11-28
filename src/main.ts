import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { provideLottieOptions } from "ngx-lottie";
import player from 'lottie-web';// Mantenido por si se usa en otras partes

import { provideHttpClient } from '@angular/common/http';


// La función de fábrica debe estar correctamente definida:
export function playerFactory() {
  return import("lottie-web");
}


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideLottieOptions({ player: playerFactory}),
    provideHttpClient(),
  ],
});
