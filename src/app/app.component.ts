import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DBTaskService } from './services/dbservice'; // Importar servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Inyectamos el servicio para que se ejecute el constructor y el init()
  private dbTask = inject(DBTaskService); 

  constructor() {
    // Podemos suscribirnos para saber cuando esté lista
    this.dbTask.dbState().subscribe(isReady => {
      if (isReady) {
        console.log('¡Base de Datos Local Cargada y Lista!');
      }
    });
  }
}