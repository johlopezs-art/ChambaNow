import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { ApiService } from '../../services/api';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular/standalone'; // IMPORTANTE: Agregar NavController
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

// Usamos fdescribe para probar SOLO este archivo por ahora
describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  // Variables para los Mocks
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let navControllerSpy: jasmine.SpyObj<NavController>; // Nuevo espía

  beforeEach(async () => {
    // 1. Crear los objetos espía
    const apiSpy = jasmine.createSpyObj('ApiService', ['registrarUsuario']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock para NavController (Soluciona el error del ion-back-button)
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'back']);

    // Mock para Toast
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    } as any));

    await TestBed.configureTestingModule({
      imports: [ 
        RegistroPage, 
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastController, useValue: toastSpy },
        // AGREGAMOS ESTA LÍNEA CLAVE:
        { provide: NavController, useValue: navSpy } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;

    // Recuperamos las instancias
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DEL FORMULARIO ---

  it('el formulario debería ser inválido al inicio', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('debería detectar si las contraseñas no coinciden', () => {
    component.form.patchValue({
      nombre: 'Test',
      apellido: 'User',
      email: 'test@test.com',
      password: '123456',
      confirmarPassword: 'OTRA' 
    });
    expect(component.form.hasError('mismatch')).toBeTrue();
  });

  it('debería ser válido si todo está correcto', () => {
    component.form.patchValue({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456',
      confirmarPassword: '123456' 
    });
    expect(component.form.valid).toBeTrue();
  });

  // --- PRUEBAS DE REGISTRO (onSubmit) ---

  it('debería registrar exitosamente', fakeAsync(() => {
    // Arrange
    const mockData = {
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456',
      confirmarPassword: '123456'
    };
    component.form.setValue(mockData);

    apiServiceSpy.registrarUsuario.and.returnValue(of({ id: 1 }));

    // Act
    component.onSubmit();
    tick();

    // Assert
    expect(apiServiceSpy.registrarUsuario).toHaveBeenCalledWith({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'juan@test.com',
      password: '123456'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('debería manejar error de API', fakeAsync(() => {
    component.form.patchValue({
      nombre: 'Juan',
      apellido: 'Perez',
      email: 'error@test.com',
      password: '123456',
      confirmarPassword: '123456'
    });

    apiServiceSpy.registrarUsuario.and.returnValue(throwError(() => ({ error: { detail: 'Error' } })));

    component.onSubmit();
    tick();

    expect(apiServiceSpy.registrarUsuario).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled();
  }));

  // --- PRUEBA DE NAVEGACIÓN MANUAL ---

  it('debería navegar al login al pulsar irALogin', () => {
    component.irALogin();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

});