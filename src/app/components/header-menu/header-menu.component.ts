import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
// 1. ELIMINAMOS EL IMPORT DE AuthenticationService
import { addIcons } from 'ionicons';
import { ellipsisVertical, personOutline, homeOutline, logOutOutline } from 'ionicons/icons';

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
          <ion-button id="menu-trigger">
            <ion-icon [icon]="menuIcon"></ion-icon>
          </ion-button>
        </ion-buttons>

        <!-- Menú Desplegable -->
        <ion-popover trigger="menu-trigger" dismissOnSelect="true" side="bottom" alignment="end">
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

  // 2. ELIMINAMOS LA INYECCIÓN DEL SERVICIO DE AUTENTICACIÓN
  // private authService = inject(AuthenticationService);
  
  private router = inject(Router);

  constructor() {
    addIcons({ ellipsisVertical, personOutline, homeOutline, logOutOutline });
  }

  logout() {
    // 3. LÓGICA MANUAL DE LOGOUT
    // Limpiamos cualquier rastro de usuario o token guardado
    localStorage.clear(); 
    // O si usas claves especificas: localStorage.removeItem('usuario');

    // Redirigimos al login
    this.router.navigate(['/login']);
  }
}