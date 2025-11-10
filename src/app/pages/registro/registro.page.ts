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

  
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', [Validators.required]],
  }, {
    
    validators: passwordMatchValidator 
  });

 
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      
      const t = await this.toastCtrl.create({
        message: "Por favor, revise todos los campos requeridos y la coincidencia de contraseñas.",
        duration: 2000,
        color: "danger"
      });
      await t.present();
      return;
    }

   
    const datosRegistro = this.form.value; 
    

    const t = await this.toastCtrl.create({
      message: "¡Registro exitoso! Por favor, inicie sesión.",
      duration: 2000,
      color: "success"
    });
    await t.present();

    
    this.router.navigate(['/login']);
  }
}