import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  templateUrl: './header-menu.component.html', // Recomendado: mover el HTML a su propio archivo también, pero si prefieres inline, quita esta línea y deja el template: `...`
  // CAMBIO AQUÍ: Usamos styleUrls en lugar de styles inline
  styleUrls: ['./header-menu.component.scss'] 
})
export class HeaderMenuComponent {
  @Input() title: string = 'ChambaNow';

  menuIcon = ellipsisVertical;
  // ID único para el trigger
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

  async navegar(ruta: string) {
    await this.popoverCtrl.dismiss();
    this.router.navigate([ruta]);
  }

  async logout() {
    await this.popoverCtrl.dismiss();
    await this.dbTask.closeSession();
    this.navCtrl.navigateRoot('/login');
  }
}