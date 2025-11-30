import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { ellipsisVertical, personOutline, homeOutline, logOutOutline } from 'ionicons/icons';
// IMPORTANTE: Importar el servicio de Base de Datos para cerrar sesión correctamente
import { DBTaskService } from '../../services/dbservice';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <!-- Botón de "Atrás" -->
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/principal"></ion-back-button>
        </ion-buttons>

        <ion-title>{{ title }}</ion-title>

        <!-- Botón del Menú -->
        <ion-buttons slot="end">
          <!-- CORRECCIÓN: Usamos [id] dinámico para evitar conflictos entre páginas -->
          <ion-button [id]="triggerId">
            <ion-icon [icon]="menuIcon"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- Menú Desplegable -->
        <!-- CORRECCIÓN: El trigger debe coincidir con el ID dinámico -->
        <ion-popover [trigger]="triggerId" dismissOnSelect="true" side="bottom" alignment="end">
          <ng-template>
            <ion-content class="ion-no-padding">
              <ion-list lines="none">
                
                <ion-list-header>
                  <ion-label>Navegación</ion-label>
                </ion-list-header>

                <ion-item button routerLink="/principal" detail="false">
                  <ion-icon name="home-outline" slot="start"></ion-icon>
                  <ion-label>Principal</ion-label>
                </ion-item>

                <ion-item button routerLink="/datos-personales" detail="false">
                  <ion-icon name="person-outline" slot="start"></ion-icon>
                  <ion-label>Mi Cuenta</ion-label>
                </ion-item>

                <div class="separator"></div>

                <!-- Evento Click para Logout -->
                <ion-item button (click)="logout()" detail="false" lines="none" class="logout-item">
                  <ion-icon name="log-out-outline" slot="start" color="danger"></ion-icon>
                  <ion-label color="danger">Cerrar Sesión</ion-label>
                </ion-item>

              </ion-list>
            </ion-content>
          </ng-template>
        </ion-popover>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [`
    .separator {
      border-top: 1px solid var(--ion-color-light-shade);
      margin: 5px 0;
    }
    ion-popover {
      --width: 200px;
    }
  `]
})
export class HeaderMenuComponent {
  @Input() title: string = 'ChambaNow';

  menuIcon = ellipsisVertical;
  
  // SOLUCIÓN AL PROBLEMA:
  // Generamos un ID único aleatorio cada vez que se usa el componente.
  // Si usas un ID fijo como "menu-trigger", al tener el componente en 2 páginas a la vez (historial),
  // Ionic no sabe cuál abrir y deja de funcionar.
  triggerId = 'menu-trigger-' + Math.random().toString(36).substring(2);

  private router = inject(Router);
  // Inyectamos el servicio de BD que configuramos antes
  private dbTask = inject(DBTaskService);

  constructor() {
    addIcons({ ellipsisVertical, personOutline, homeOutline, logOutOutline });
  }

  async logout() {
    // Usamos el método correcto para limpiar SQLite y Storage
    await this.dbTask.closeSession();
    
    // Redirigimos al login
    this.router.navigate(['/login']);
  }
}