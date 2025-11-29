import { Component, inject } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  Validators, 
  ReactiveFormsModule,
  AbstractControl, 
  ValidationErrors, 
  ValidatorFn 
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// Importamos el servicio de API y RXJS
import { ApiService } from '../../services/api';
import { lastValueFrom } from 'rxjs';

// Importamos Iconos para usarlos en la vista (opcional pero recomendado)
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, lockClosedOutline, createOutline } from 'ionicons/icons';

// Validador de contraseñas
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmarPassword');

  if (!password || !confirmPassword || !confirmPassword.value) {
    return null; 
  }

  return password.value !== confirmPassword.value
    ? { mismatch: true } 
    : null;
};

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegistroPage {

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private toastCtrl: ToastController = inject(ToastController);
  
  // Inyectamos el servicio
  private apiService = inject(ApiService);

  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    // AGREGADO: El backend requiere Apellido
    apellido: ['', [Validators.required, Validators.minLength(3)]], 
    // CAMBIO: 'correo' a 'email' para coincidir con backend
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', [Validators.required]],
  }, {
    validators: passwordMatchValidator 
  });

  constructor() {
    addIcons({ personOutline, mailOutline, lockClosedOutline, createOutline });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      const t = await this.toastCtrl.create({
        message: "Por favor, revise todos los campos requeridos.",
        duration: 2000,
        color: "danger"
      });
      await t.present();
      this.form.markAllAsTouched();
      return;
    }

    // Preparamos los datos
    const { nombre, apellido, email, password } = this.form.value;
    
    // Objeto que coincide con 'UsuarioCreate' en Python
    const datosRegistro = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password
    };

    try {
      // Llamada a la API
      await lastValueFrom(this.apiService.registrarUsuario(datosRegistro));

      // Éxito
      const t = await this.toastCtrl.create({
        message: "¡Registro exitoso! Por favor, inicie sesión.",
        duration: 2000,
        color: "success"
      });
      await t.present();

      this.router.navigate(['/login']);

    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Manejo de error (ej: Email duplicado)
      let mensaje = "Ocurrió un error al registrarse.";
      if (error.error && error.error.detail) {
        mensaje = error.error.detail; // Mensaje que viene desde FastAPI
      }

      const t = await this.toastCtrl.create({
        message: mensaje,
        duration: 3000,
        color: "danger"
      });
      await t.present();
    }
  }
}