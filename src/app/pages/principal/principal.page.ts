import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonList, 
  IonItem, 
  IonAvatar, 
  IonLabel, 
  IonNote, 
  IonIcon, 
  IonButton, 
  IonRippleEffect, 
  IonFab, 
  IonFabButton,
  ViewWillEnter // Importamos la interfaz desde standalone para consistencia
} from '@ionic/angular/standalone'; 
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { DBTaskService } from '../../services/dbservice';
import { addIcons } from 'ionicons';
import { locationOutline, arrowForwardOutline, addCircleOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api';
import { lastValueFrom } from 'rxjs';

interface OfertaTrabajo {
  id: number;
  titulo: string;
  profesion: string;
  especificacion: string;
  sueldo: string;
  ubicacion?: string; 
  imagenUrl?: string;
}

@Component({
  selector: 'app-principal',
  templateUrl: './principal.page.html',
  styleUrls: ['./principal.page.scss'],
  standalone: true,
  // IMPORTANTE: Añadimos aquí todos los componentes de UI que usas en el HTML
  imports: [
    CommonModule, 
    HeaderMenuComponent,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonIcon,
    IonButton,
    IonRippleEffect,
    IonFab,
    IonFabButton
  ]
})
export class PrincipalPage implements OnInit, ViewWillEnter {

  usuario: any = null; 
  headerHidden = false;
  private lastScrollTop = 0;
  ofertas: OfertaTrabajo[] = [];

  private router = inject(Router);
  private dbTask = inject(DBTaskService);
  private apiService = inject(ApiService);

  constructor() {
    addIcons({ locationOutline, arrowForwardOutline, addCircleOutline });
  }

  ngOnInit() {
    // Se deja vacío, usamos ionViewWillEnter
  }

  async ionViewWillEnter() {
    await this.cargarUsuario();
    await this.cargarOfertas(); 
  }

  async cargarUsuario() {
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    
    if (navigationState && navigationState['usuario']) {
      this.usuario = navigationState['usuario'];
    } else {
      // Si recargamos la página, recuperamos desde la BD local
      this.usuario = await this.dbTask.getCurrentUser();
    }
  }

  async cargarOfertas() {
    try {
      const data = await lastValueFrom(this.apiService.obtenerSolicitudes());
      // Mapeamos los datos de la API a nuestra interfaz local
      this.ofertas = data.map((item: any) => ({
        id: item.id,
        titulo: item.titulo,
        profesion: item.profesion,
        especificacion: item.especificacion,
        sueldo: item.sueldo,
        ubicacion: 'Chile', // Valor por defecto
        imagenUrl: '' // Imagen por defecto
      }));
    } catch (error) {
      console.error('Error cargando ofertas', error);
    }
  }

  verDetalle(trabajoId: number) {
    this.router.navigate(['/link-trabajo', trabajoId]);
  }

  irCrearSolicitud() {
    this.router.navigate(['/solicitudes']);
  }

  onScroll(event: any) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      this.headerHidden = true;
    } else if (scrollTop < this.lastScrollTop) {
      this.headerHidden = false;
    }
    this.lastScrollTop = scrollTop;
  }
}