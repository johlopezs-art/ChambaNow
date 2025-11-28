import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { HeaderMenuComponent } from '../../components/header-menu/header-menu.component';
import { addIcons } from 'ionicons';
import { locationOutline, saveOutline, cameraOutline, briefcaseOutline, hammerOutline } from 'ionicons/icons';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.page.html',
  styleUrls: ['./datos-personales.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, HeaderMenuComponent]
})
export class DatosPersonalesPage implements OnInit {

  profileForm: FormGroup;
  loadingGeo = false; // Para mostrar spinner en el botón de ubicación

  private fb = inject(FormBuilder);
  private toastCtrl = inject(ToastController);

  constructor() {
    // Registramos iconos
    addIcons({ locationOutline, saveOutline, cameraOutline, briefcaseOutline, hammerOutline });

    // Inicializamos el formulario con validaciones
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      ocupacion: ['', Validators.required],     // Ej: Estudiante, Freelancer
      profesion: ['', Validators.required],     // Ej: Ingeniero, Diseñador
      habilidades: ['', Validators.required],   // Ej: Angular, SQL, Python
      direccion: [''],
      latitud: [''], // Campos ocultos para cuando conectes la API
      longitud: ['']
    });
  }

  ngOnInit() {
    this.cargarDatosExistentes();
  }

  // Simula cargar datos del usuario (aquí conectarás tu API GET después)
  cargarDatosExistentes() {
    this.profileForm.patchValue({
      nombre: 'Johan',
      apellido: 'López',
      ocupacion: 'Desarrollador Fullstack',
      profesion: 'Ingeniero de Software',
      habilidades: 'Angular, Ionic, TypeScript, Node.js',
      direccion: 'Valparaíso, Chile'
    });
  }

  // Lógica de Geolocalización (Inactiva/Simulada por ahora)
  async obtenerUbicacion() {
    this.loadingGeo = true;
    
    // SIMULACIÓN: Aquí irá tu código de Geolocation.getCurrentPosition()
    setTimeout(async () => {
      this.loadingGeo = false;
      this.profileForm.patchValue({
        direccion: 'Ubicación detectada (Simulada)',
        latitud: '-33.4489',
        longitud: '-70.6693'
      });

      const toast = await this.toastCtrl.create({
        message: '📍 Ubicación actualizada (Modo Demo)',
        duration: 2000,
        color: 'primary',
        position: 'bottom'
      });
      await toast.present();
    }, 2000);
  }

  async guardarDatos() {
    if (this.profileForm.valid) {
      console.log('Datos a enviar:', this.profileForm.value);
      
      const toast = await this.toastCtrl.create({
        message: '✅ Perfil actualizado correctamente',
        duration: 2000,
        color: 'success'
      });
      await toast.present();
    } else {
      this.profileForm.markAllAsTouched(); // Marca los errores en rojo
    }
  }
}