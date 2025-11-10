import { Component, ViewChild, inject } from '@angular/core';
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
  imports: [CommonModule, IonicModule, ReactiveFormsModule, LoaderOverlayComponent],
})
export class LoginPage {
  @ViewChild('loader') loader?: LoaderOverlayComponent;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  form: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, rellene todos los campos correctamente.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      this.form.markAllAsTouched();
      return;
    }

    // Mostrar loader (3 segundos)
    this.loader?.showFor(3000);

    const { usuario, password } = this.form.value;

    // Simular tiempo de espera (API fake)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Navegar a la página principal
    this.router.navigate(['/principal'], {
      state: { usuario, password },
    });
  }

  irARegistro() {
    // Navegación programática segura
    this.router.navigate(['/registro']).then(
      (ok) => {
        if (!ok) {
          console.error('No se pudo navegar a /registro');
        }
      },
      (err) => console.error('Error de navegación:', err)
    );
  }
}
