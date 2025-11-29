import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';
import { addIcons } from 'ionicons';
import { logInOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { lastValueFrom } from 'rxjs';
import { DBTaskService } from '../../services/dbservice';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, LoaderOverlayComponent],
})
export class LoginPage {
  @ViewChild('loader') loader?: LoaderOverlayComponent;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private apiService = inject(ApiService);
  
  // 2. INYECTAR EL SERVICIO DE BASE DE DATOS
  private dbTask = inject(DBTaskService);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  constructor() {
    addIcons({ logInOutline, mailOutline, lockClosedOutline });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, introduce un correo válido y tu contraseña.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      this.form.markAllAsTouched();
      return;
    }

    // Mostramos el loader (tiempo de seguridad 10s por si la red es lenta)
    this.loader?.showFor(10000); 

    const { email, password } = this.form.value;

    try {
      const credentials = { email: email, password: password };
      
      // A. Llamada a la API (FastAPI)
      // Usamos lastValueFrom para convertir el Observable en Promesa
      const response = await lastValueFrom(this.apiService.login(credentials));
      
      // B. GUARDAR SESIÓN EN SQLITE Y STORAGE
      // Llamamos al método que definimos en dbtask.service.ts
      await this.dbTask.createSession(response);

      // C. Navegar a la página principal
      this.router.navigate(['/principal'], {
        state: { usuario: response },
      });

    } catch (error) {
      console.error('Error login:', error);
      const toast = await this.toastCtrl.create({
        message: 'Correo o contraseña incorrectos',
        duration: 3000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    } 
    // Nota: El loader se ocultará automáticamente si usaste showFor,
    // o puedes llamar a this.loader?.hide() en un bloque finally si tu componente lo soporta.
  }

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}