import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SolicitudesPage } from './solicitudes.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { Router } from '@angular/router';
import { ToastController, LoadingController, PopoverController, NavController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SolicitudesPage', () => {
  let component: SolicitudesPage;
  let fixture: ComponentFixture<SolicitudesPage>;

  // Espías
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['crearSolicitud']);
    
    // --- CORRECCIÓN AQUÍ ---
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['getCurrentUser']);
    // Configuramos que POR DEFECTO devuelva un usuario. 
    // Así ngOnInit NO navegará al login automáticamente al iniciar la prueba.
    dbSpy.getCurrentUser.and.returnValue(Promise.resolve({ id: 1, nombre: 'Test User' }));

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    } as any));

    const loadingSpy = jasmine.createSpyObj('LoadingController', ['create']);
    loadingSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
    } as any));

    const popoverSpy = jasmine.createSpyObj('PopoverController', ['create']);
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'back']);

    await TestBed.configureTestingModule({
      imports: [ 
        SolicitudesPage, 
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastController, useValue: toastSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: PopoverController, useValue: popoverSpy },
        { provide: NavController, useValue: navSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudesPage);
    component = fixture.componentInstance;

    // Inyectar
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    fixture.detectChanges(); // Aquí corre ngOnInit. Como ya hay usuario simulado, no navega.
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE INICIALIZACIÓN ---

  it('debería obtener el ID del usuario al iniciar', fakeAsync(() => {
    // Ya viene configurado del beforeEach, pero confirmamos
    expect(component.usuarioId).toBe(1);
  }));

  it('debería redirigir al login si no hay usuario', fakeAsync(() => {
    // Arrange: Forzamos que NO haya usuario y ejecutamos ngOnInit de nuevo manual
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve(null));

    component.ngOnInit();
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
  }));

  // --- PRUEBAS DEL FORMULARIO ---

  it('el formulario debería ser inválido si faltan campos', () => {
    component.form.patchValue({
      titulo: 'Corto',
      profesion: '',   
      sueldo: ''
    });
    expect(component.form.valid).toBeFalse();
  });

  it('el formulario debería ser válido con datos correctos', () => {
    component.form.patchValue({
      titulo: 'Trabajo de Pintura',
      profesion: 'Pintor',
      especificacion: 'Se necesita pintar fachada completa de 2 pisos',
      sueldo: '500000'
    });
    expect(component.form.valid).toBeTrue();
  });

  // --- PRUEBAS DE CREAR SOLICITUD ---

  it('debería crear solicitud exitosamente', fakeAsync(() => {
    component.usuarioId = 10; 
    const datosFormulario = {
      titulo: 'Gasfiter Urgente',
      profesion: 'Gasfiter',
      especificacion: 'Arreglar cañeria de baño principal',
      sueldo: '30000'
    };
    component.form.setValue(datosFormulario);

    apiServiceSpy.crearSolicitud.and.returnValue(of({ success: true }));

    component.crearSolicitud();
    tick(); 

    expect(loadingControllerSpy.create).toHaveBeenCalled(); 
    expect(apiServiceSpy.crearSolicitud).toHaveBeenCalledWith({
      ...datosFormulario,
      usuario_id: 10
    });
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/principal']);
  }));

  it('debería manejar error al crear solicitud', fakeAsync(() => {
    // Aseguramos que el espía de router esté limpio antes de empezar esta prueba específica
    routerSpy.navigate.calls.reset();

    component.usuarioId = 10;
    component.form.patchValue({
      titulo: 'Test Error',
      profesion: 'Test',
      especificacion: 'Descripcion larga valida',
      sueldo: '100'
    });

    apiServiceSpy.crearSolicitud.and.returnValue(throwError(() => new Error('Error DB')));
    spyOn(console, 'error'); 

    component.crearSolicitud();
    tick();

    expect(apiServiceSpy.crearSolicitud).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
    
    // AHORA SÍ DEBERÍA PASAR: No se navegó porque el ngOnInit no molestó y el error se capturó
    expect(routerSpy.navigate).not.toHaveBeenCalled(); 
  }));

  it('NO debería llamar a la API si el formulario es inválido', fakeAsync(() => {
    component.usuarioId = 10;
    component.form.patchValue({ titulo: '' }); 

    component.crearSolicitud();
    tick();

    expect(apiServiceSpy.crearSolicitud).not.toHaveBeenCalled();
  }));
});