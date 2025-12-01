import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
// Importaciones explícitas de componentes Ionic Standalone
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonButton, 
  IonIcon, 
  IonPopover, 
  IonContent, 
  IonList, 
  IonListHeader, 
  IonLabel, 
  IonItem,
  PopoverController,
  NavController
} from '@ionic/angular/standalone'; 
import { addIcons } from 'ionicons';
import { 
  ellipsisVertical, 
  personOutline, 
  homeOutline, 
  logOutOutline, 
  briefcaseOutline, 
  mailUnreadOutline 
} from 'ionicons/icons';
import { DBTaskService } from '../../services/dbservice';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  // Importamos explícitamente todos los componentes usados en el HTML
  imports: [
    CommonModule, 
    RouterModule, // Importamos RouterModule por si acaso, aunque usamos navegación programática
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonButton, 
    IonIcon, 
    IonPopover, 
    IonContent, 
    IonList, 
    IonListHeader, 
    IonLabel, 
    IonItem
  ],
  // Referenciamos a los archivos externos HTML y SCSS
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent {
  @Input() title: string = 'ChambaNow';

  menuIcon = ellipsisVertical;
  // ID único para el trigger, evita conflictos si hay múltiples instancias
  triggerId = 'menu-trigger-' + Math.random().toString(36).substring(2);

  private router = inject(Router);
  private dbTask = inject(DBTaskService);
  private popoverCtrl = inject(PopoverController);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({ 
      ellipsisVertical, 
      personOutline, 
      homeOutline, 
      logOutOutline, 
      briefcaseOutline,
      mailUnreadOutline 
    });
  }

  // Navega a una ruta y cierra el menú
  async navegar(ruta: string) {
    await this.popoverCtrl.dismiss();
    this.router.navigate([ruta]);
  }

  // Cierra sesión, cierra el menú y navega al login limpiando el historial
  async logout() {
    await this.popoverCtrl.dismiss();
    await this.dbTask.closeSession();
    this.navCtrl.navigateRoot('/login');
  }
}