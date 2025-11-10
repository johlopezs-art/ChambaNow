import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { LoaderOverlayComponent } from 'src/app/shared/loader-overlay/loader-overlay.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, LoaderOverlayComponent]
})
export class LoginPage {
  @ViewChild('loader')
  loader?: LoaderOverlayComponent;

  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private toastCtrl: ToastController = inject(ToastController);

  // La propiedad 'visible' ya no es necesaria si solo usas el LoaderOverlayComponent
  // public visible: boolean = false; 

  form: FormGroup = this.fb.group({
    usuario: ["", [Validators.required, Validators.minLength(4)]],
    password: ["", [Validators.required, Validators.minLength(5)]]
  });

  async onSubmit(): Promise<void> {

    if (this.form.invalid) {
      const t: HTMLIonToastElement = await this.toastCtrl.create({
        message: "Por favor, rellene todos los campos",
        duration: 2000,
        color: "danger"
      });

      await t.present();
      return;
    }

    // APLICAMOS EL EFECTO DE CARGA AQUÍ (ej. 3 segundos)
    // El método showFor es más adecuado para simular el tiempo de la llamada API.
    this.loader?.showFor(3000); // Muestra el loader por 3 segundos

    const { usuario, password } = this.form.value;

    // --- Simular la llamada API y navegación ---
    // En lugar de hacer un timeout manual, navegaremos después de la simulación
    // El efecto visual del loader lo hace el componente LoaderOverlayComponent.

    // Simular el tiempo de la llamada API (si el LoaderOverlayComponent no lo hace)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Después de que la simulación de la API termine, navegamos.
    this.router.navigate(['/principal'], {
      state: {
        usuario,
        password
      },
    });
  }

  // ELIMINAR ESTA FUNCIÓN:
  /*
  inicarCarga5s(): void {
    this.loader?.showFor(5000); 
  }
  */

  irARegistro() {
    this.router.navigate(['/registro']);
  }
}