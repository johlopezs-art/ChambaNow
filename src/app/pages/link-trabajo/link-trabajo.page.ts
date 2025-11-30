import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { lastValueFrom } from 'rxjs';
import { addIcons } from 'ionicons';
import { briefcaseOutline, cashOutline, locationOutline, personCircleOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-link-trabajo',
  templateUrl: './link-trabajo.page.html',
  styleUrls: ['./link-trabajo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderMenuComponent]
})
export class LinkTrabajoPage implements OnInit {

  // Objeto para guardar la info del trabajo (inicialmente null o vacío)
  trabajo: any = null;
  usuarioId: number | null = null;
  yaPostulado = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private dbTask = inject(DBTaskService);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);

  constructor() {
    addIcons({ briefcaseOutline, cashOutline, locationOutline, personCircleOutline, checkmarkCircleOutline });
  }

  async ngOnInit() {
    // 1. Obtener ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    
    // 2. Obtener Usuario Actual
    const user = await this.dbTask.getCurrentUser();
    if (user) this.usuarioId = user.id;

    if (id) {
      this.cargarTrabajo(parseInt(id, 10));
    } else {
      this.mostrarToast('Error: Trabajo no especificado', 'danger');
      this.router.navigate(['/principal']);
    }
  }

  async cargarTrabajo(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando detalle...' });
    await loading.present();

    try {
      // 3. Llamada a la API Real
      this.trabajo = await lastValueFrom(this.apiService.obtenerSolicitudPorId(id));
      
      // Ajuste visual si la API no trae foto
      if (!this.trabajo.foto_usuario) {
        this.trabajo.foto_usuario = '';
      }

    } catch (error) {
      console.error('Error cargando trabajo', error);
      this.mostrarToast('No se pudo cargar la información', 'danger');
      this.router.navigate(['/principal']);
    } finally {
      loading.dismiss();
    }
  }

  async postular() {
    if (!this.usuarioId) {
      this.mostrarToast('Debes iniciar sesión para postular', 'warning');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Enviando postulación...' });
    await loading.present();

    try {
      const data = {
        solicitud_id: this.trabajo.id,
        usuario_id: this.usuarioId
      };

      await lastValueFrom(this.apiService.postular(data));
      
      this.mostrarToast('✅ ¡Postulación enviada con éxito!', 'success');
      this.yaPostulado = true;
      
      // Opcional: Redirigir a la bandeja
      setTimeout(() => this.router.navigate(['/bandeja']), 1500);

    } catch (error: any) {
      // Manejo de error si ya postuló
      if (error.status === 400) {
        this.mostrarToast('⚠ Ya has postulado a este trabajo.', 'warning');
        this.yaPostulado = true;
      } else {
        this.mostrarToast('Error al postular. Intenta nuevamente.', 'danger');
      }
    } finally {
      loading.dismiss();
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}