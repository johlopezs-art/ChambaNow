import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ViewWillEnter, ToastController } from '@ionic/angular';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { DBTaskService } from '../../services/dbservice';
import { ApiService } from '../../services/api';
import { addIcons } from 'ionicons';
import { checkmarkCircle, closeCircle, timeOutline, mailOutline, personCircleOutline } from 'ionicons/icons';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-bandeja',
  templateUrl: './bandeja.page.html',
  styleUrls: ['./bandeja.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HeaderMenuComponent]
})
export class BandejaPage implements ViewWillEnter {

  segmentoSeleccionado = 'solicitudes'; // 'solicitudes' o 'postulaciones'
  usuarioId: number | null = null;
  
  // Datos
  misSolicitudes: any[] = [];
  misPostulaciones: any[] = [];

  private dbTask = inject(DBTaskService);
  private apiService = inject(ApiService);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ checkmarkCircle, closeCircle, timeOutline, mailOutline, personCircleOutline });
  }

  async ionViewWillEnter() {
    const user = await this.dbTask.getCurrentUser();
    if (user) {
      this.usuarioId = user.id;
      this.cargarDatos();
    }
  }

  async cargarDatos() {
    if (!this.usuarioId) return;

    try {
      // 1. Cargar postulaciones que YO hice
      this.misPostulaciones = await lastValueFrom(this.apiService.obtenerMisPostulaciones(this.usuarioId));

      // 2. Cargar solicitudes que YO creé y sus postulantes
      this.misSolicitudes = await lastValueFrom(this.apiService.obtenerMisSolicitudesConPostulantes(this.usuarioId));
      
    } catch (error) {
      console.error('Error cargando bandeja', error);
    }
  }

  // Lógica para Aceptar/Rechazar postulantes
  async gestionarPostulacion(postulacionId: number, estado: 'aceptada' | 'rechazada') {
    try {
      await lastValueFrom(this.apiService.cambiarEstadoPostulacion(postulacionId, estado));
      
      const mensaje = estado === 'aceptada' ? '✅ Postulante aceptado' : '❌ Postulante rechazado';
      this.mostrarToast(mensaje, estado === 'aceptada' ? 'success' : 'medium');
      
      // Recargar datos para ver cambios
      this.cargarDatos();
    } catch (error) {
      this.mostrarToast('Error al actualizar estado', 'danger');
    }
  }

  cambiarSegmento(event: any) {
    this.segmentoSeleccionado = event.detail.value;
  }

  async mostrarToast(msj: string, color: string) {
    const t = await this.toastCtrl.create({ message: msj, duration: 2000, color: color });
    t.present();
  }
}