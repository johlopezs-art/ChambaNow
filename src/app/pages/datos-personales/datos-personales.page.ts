import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importaciones explícitas de TODOS los componentes de Ionic usados en el HTML
import { 
  IonContent, 
  IonAvatar, 
  IonIcon, 
  IonItem, 
  IonInput, 
  IonLabel, 
  IonTextarea, 
  IonButton, 
  IonCard,           // Faltaba este
  IonCardHeader,     // Faltaba este
  IonCardSubtitle,   // Faltaba este
  IonCardContent,    // Faltaba este
  IonRow,            // Faltaba este
  IonCol,            // Faltaba este
  IonNote,           // Faltaba este
  IonSpinner,        // Faltaba este
  ToastController, 
  LoadingController 
} from '@ionic/angular/standalone';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  saveOutline, 
  cameraOutline, 
  briefcaseOutline, 
  hammerOutline,
  personOutline 
} from 'ionicons/icons';

import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { lastValueFrom } from 'rxjs';

import * as L from 'leaflet';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  standalone: true,
  // Agregamos todos los componentes importados al array de imports del componente
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    HeaderMenuComponent,
    IonContent,
    IonAvatar,
    IonIcon,
    IonItem,
    IonInput,
    IonLabel,
    IonTextarea,
    IonButton,
    IonCard,           // Agregado
    IonCardHeader,     // Agregado
    IonCardSubtitle,   // Agregado
    IonCardContent,    // Agregado
    IonRow,            // Agregado
    IonCol,            // Agregado
    IonNote,           // Agregado
    IonSpinner         // Agregado
  ]
})
export class DatosPersonalesPage implements OnInit {

  profileForm: FormGroup;
  loadingGeo = false;
  usuarioId: number | null = null;
  imagenPerfil: string = 'https://ionicframework.com/docs/img/demos/avatar.svg'; 

  map: L.Map | undefined;
  marker: L.Marker | undefined;

  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  
  private apiService = inject(ApiService);
  private dbTask = inject(DBTaskService);

  constructor() {
    addIcons({ locationOutline, saveOutline, cameraOutline, briefcaseOutline, hammerOutline, personOutline });

    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      ocupacion: ['', Validators.required],
      profesion: ['', Validators.required],
      habilidades: ['', Validators.required],
      direccion: [''],
      latitud: [0], 
      longitud: [0]
    });
  }

  async ngOnInit() {
    this.fixLeafletMarker(); 

    const usuarioLogueado = await this.dbTask.getCurrentUser();
    
    if (usuarioLogueado) {
      this.usuarioId = usuarioLogueado.id;
      this.cargarDatosDesdeAPI(this.usuarioId!);
    } else {
      this.mostrarToast('No se encontró sesión activa', 'danger');
    }
  }

  fixLeafletMarker() {
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
    const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
    const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';
    
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  async cargarDatosDesdeAPI(id: number) {
    const loading = await this.loadingCtrl.create({ message: 'Cargando perfil...' });
    await loading.present();

    try {
      const usuario = await lastValueFrom(this.apiService.obtenerUsuario(id));
      
      this.profileForm.patchValue({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        ocupacion: usuario.ocupacion || '',
        profesion: usuario.profesion || '',
        habilidades: usuario.habilidades || '',
        latitud: usuario.latitud,
        longitud: usuario.longitud,
        direccion: (usuario.latitud && usuario.longitud) 
          ? `Lat: ${usuario.latitud}, Lng: ${usuario.longitud}` 
          : ''
      });

      if (usuario.latitud && usuario.longitud) {
        setTimeout(() => {
          this.cargarMapa(usuario.latitud, usuario.longitud);
        }, 500);
      } else {
         setTimeout(() => {
          this.cargarMapa(-33.4489, -70.6693);
        }, 500);
      }

    } catch (error) {
      console.error(error);
      this.mostrarToast('Error al cargar datos del servidor', 'danger');
    } finally {
      loading.dismiss();
    }
  }

  cargarMapa(lat: number, lng: number) {
    const mapContainer = document.getElementById('mapId');
    if (!mapContainer) return;

    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }

    this.map = L.map('mapId').setView([lat, lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.actualizarPosicion(e.latlng.lat, e.latlng.lng);
    });

    this.actualizarMarcador(lat, lng);
  }

  actualizarMarcador(lat: number, lng: number) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map!);
      
      this.marker.on('dragend', () => {
        const position = this.marker!.getLatLng();
        this.actualizarFormulario(position.lat, position.lng);
      });
    }
  }

  actualizarPosicion(lat: number, lng: number) {
    this.actualizarMarcador(lat, lng);
    this.actualizarFormulario(lat, lng);
  }

  actualizarFormulario(lat: number, lng: number) {
    this.profileForm.patchValue({
      latitud: lat,
      longitud: lng,
      direccion: `Ubicación manual: ${lat.toFixed(4)}, ${lng.toFixed(4)}`
    });
  }

  async obtenerUbicacion() {
    this.loadingGeo = true;
    try {
      const permissionStatus = await Geolocation.checkPermissions();
      if (permissionStatus.location !== 'granted') {
        const requestStatus = await Geolocation.requestPermissions();
        if (requestStatus.location !== 'granted') {
          this.mostrarToast('Permiso de ubicación denegado', 'warning');
          this.loadingGeo = false;
          return;
        }
      }

      const coordinates = await Geolocation.getCurrentPosition({ 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3000
      });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.actualizarPosicion(lat, lng);
      
      if (this.map) {
        this.map.setView([lat, lng], 15);
      } else {
        this.cargarMapa(lat, lng);
      }
      this.mostrarToast('📍 Ubicación GPS detectada', 'primary');

    } catch (error) {
      console.error('Error GPS:', error);
      this.mostrarToast('Error al obtener GPS. Activa la ubicación.', 'warning');
    } finally {
      this.loadingGeo = false;
    }
  }

  async tomarFoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });
      if (image.dataUrl) this.imagenPerfil = image.dataUrl;
    } catch (error) {
      console.log('Cámara cancelada');
    }
  }

  async guardarDatos() {
    if (this.profileForm.valid && this.usuarioId) {
      const loading = await this.loadingCtrl.create({ message: 'Guardando...' });
      await loading.present();

      try {
        const formValues = this.profileForm.value;
        const datosParaEnviar = {
          ocupacion: formValues.ocupacion,
          profesion: formValues.profesion,
          habilidades: formValues.habilidades,
          latitud: formValues.latitud,
          longitud: formValues.longitud
        };
        
        await lastValueFrom(this.apiService.actualizarPerfil(this.usuarioId, datosParaEnviar));
        this.mostrarToast('✅ Perfil actualizado correctamente', 'success');

      } catch (error) {
        this.mostrarToast('Error al actualizar perfil', 'danger');
      } finally {
        loading.dismiss();
      }
    } else {
      this.profileForm.markAllAsTouched();
      this.mostrarToast('Complete los campos obligatorios', 'warning');
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