import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importaciones explícitas de componentes Ionic Standalone
import { 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonIcon, 
  IonTextarea, 
  IonNote, 
  IonButton, 
  ToastController, 
  LoadingController 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { addIcons } from 'ionicons';
import { briefcaseOutline, cashOutline, documentTextOutline, hammerOutline, saveOutline } from 'ionicons/icons';

import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.page.html',
  styleUrls: ['./solicitudes.page.scss'],
  standalone: true,
  // IMPORTANTE: Agregamos todos los componentes importados
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HeaderMenuComponent,
    IonContent,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonTextarea,
    IonNote,
    IonButton
  ]
})
export class SolicitudesPage implements OnInit {

  form: FormGroup;
  usuarioId: number | null = null;

  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private dbTask = inject(DBTaskService);
  private toastCtrl = inject(ToastController);
  private router = inject(Router);
  private loadingCtrl = inject(LoadingController);

  constructor() {
    addIcons({ briefcaseOutline, hammerOutline, documentTextOutline, cashOutline, saveOutline });

    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      profesion: ['', Validators.required],
      especificacion: ['', [Validators.required, Validators.minLength(10)]],
      sueldo: ['', Validators.required]
    });
  }

  async ngOnInit() {
    // Obtenemos el usuario actual para asignarle la autoría de la solicitud
    const usuario = await this.dbTask.getCurrentUser();
    if (usuario) {
      this.usuarioId = usuario.id;
    } else {
      this.mostrarToast('Debes iniciar sesión para publicar', 'warning');
      this.router.navigate(['/login']);
    }
  }

  async crearSolicitud() {
    if (this.form.invalid || !this.usuarioId) {
      this.form.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Publicando solicitud...' });
    await loading.present();

    try {
      const data = {
        ...this.form.value,
        usuario_id: this.usuarioId
      };

      await lastValueFrom(this.apiService.crearSolicitud(data));
      
      this.mostrarToast('✅ Solicitud creada exitosamente', 'success');
      this.form.reset();
      
      // Redirigir a la principal para ver la oferta creada
      this.router.navigate(['/principal']);

    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al crear la solicitud', 'danger');
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