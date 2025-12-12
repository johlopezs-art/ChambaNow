import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DatosPersonalesPage } from './datos-personales.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
// Importamos TODOS los controladores necesarios para evitar errores de inyección
import { ToastController, LoadingController, PopoverController, NavController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Usamos fdescribe para probar solo este archivo
describe('DatosPersonalesPage', () => {
  let component: DatosPersonalesPage;
  let fixture: ComponentFixture<DatosPersonalesPage>;

  // Espías
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  
  // Estos dos son necesarios porque el componente importa HeaderMenuComponent
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // 1. Mocks de Servicios
    const apiSpy = jasmine.createSpyObj('ApiService', ['obtenerUsuario', 'actualizarPerfil']);
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['getCurrentUser']);

    // 2. Mocks de UI Controllers
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
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    await TestBed.configureTestingModule({
      imports: [ 
        DatosPersonalesPage, 
        ReactiveFormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: PopoverController, useValue: popoverSpy },
        { provide: NavController, useValue: navSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DatosPersonalesPage);
    component = fixture.componentInstance;

    // 3. Inyectar instancias
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;

    // Configuración inicial por defecto (Usuario logueado)
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve({ id: 99, nombre: 'Tester' }));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE CARGA DE DATOS (ngOnInit) ---

  it('debería cargar datos del perfil desde la API al iniciar', fakeAsync(() => {
    // Arrange: Datos que vienen de la API
    const mockUsuarioAPI = {
      nombre: 'Juan',
      apellido: 'Perez',
      ocupacion: 'Desarrollador',
      profesion: 'Ingeniero',
      habilidades: 'Angular, Ionic',
      latitud: -33.123,
      longitud: -70.123
    };
    apiServiceSpy.obtenerUsuario.and.returnValue(of(mockUsuarioAPI));

    // Act: Ejecutamos ngOnInit
    component.ngOnInit();
    tick(); // Esperar promesas iniciales
    tick(600); // Esperar el setTimeout del mapa (500ms + margen)

    // Assert
    expect(component.usuarioId).toBe(99);
    expect(apiServiceSpy.obtenerUsuario).toHaveBeenCalledWith(99);
    
    // Verificamos que el formulario se llenó
    expect(component.profileForm.value.nombre).toBe('Juan');
    expect(component.profileForm.value.ocupacion).toBe('Desarrollador');
  }));

  it('debería manejar error si falla la carga de datos', fakeAsync(() => {
    // Arrange: API falla
    apiServiceSpy.obtenerUsuario.and.returnValue(throwError(() => new Error('Error API')));
    spyOn(console, 'error'); // Silenciar consola

    // Act
    component.ngOnInit();
    tick();
    tick(600);

    // Assert
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Muestra mensaje de error
  }));

  // --- PRUEBAS DEL FORMULARIO ---

  it('formulario debería ser inválido si faltan campos requeridos', () => {
    component.profileForm.patchValue({
      nombre: '', // Requerido
      ocupacion: '',
      profesion: ''
    });
    expect(component.profileForm.valid).toBeFalse();
  });

  // --- PRUEBAS DE GUARDAR DATOS ---

  it('debería guardar cambios exitosamente', fakeAsync(() => {
    // Arrange
    component.usuarioId = 99;
    component.profileForm.patchValue({
      nombre: 'Juan',
      apellido: 'Perez',
      ocupacion: 'Dev',
      profesion: 'Ing',
      habilidades: 'Code',
      latitud: 0,
      longitud: 0
    });

    apiServiceSpy.actualizarPerfil.and.returnValue(of({ success: true }));

    // Act
    component.guardarDatos();
    tick();

    // Assert
    expect(loadingControllerSpy.create).toHaveBeenCalled();
    expect(apiServiceSpy.actualizarPerfil).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Éxito
  }));

  it('no debería guardar si el formulario es inválido', fakeAsync(() => {
    component.usuarioId = 99;
    component.profileForm.patchValue({ ocupacion: '' }); // Inválido

    component.guardarDatos();
    tick();

    expect(apiServiceSpy.actualizarPerfil).not.toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Warning de campos incompletos
  }));

  // --- PRUEBA DE MAPA (Leaflet) ---
  
  it('no debería fallar al intentar cargar mapa si el DIV no existe (entorno test)', () => {
    // En las pruebas unitarias, el DOM a veces no renderiza el <div id="mapId">
    // La función cargarMapa tiene un chequeo de seguridad (if !mapContainer return).
    // Probamos que esa seguridad funcione y no explote el test.
    
    spyOn(document, 'getElementById').and.returnValue(null); // Simulamos que no hay mapa
    
    expect(() => {
      component.cargarMapa(-33, -70);
    }).not.toThrow();
  });

});