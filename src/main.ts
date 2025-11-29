import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideHttpClient } from '@angular/common/http';

// 1. IMPORTAR MÓDULOS DE STORAGE Y SQLITE
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),
    // 2. PROVEEDOR DE SQLITE
    SQLite,
    // 3. INICIALIZAR IONIC STORAGE
    importProvidersFrom(
      IonicStorageModule.forRoot({
        name: 'chambanow_db',
        driverOrder: [SQLite, Drivers.IndexedDB, Drivers.LocalStorage],
      })
    ),
  ],
});