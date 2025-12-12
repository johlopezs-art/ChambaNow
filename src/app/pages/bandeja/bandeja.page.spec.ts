import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BandejaPage } from './bandeja.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { ToastController, PopoverController, NavController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BandejaPage', () => {
  let component: BandejaPage;
  let fixture: ComponentFixture<BandejaPage>;

  // Espías
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // 1. Crear Espías
    const apiSpy = jasmine.createSpyObj('ApiService', [
      'obtenerMisPostulaciones', 
      'obtenerMisSolicitudesConPostulantes', 
      'cambiarEstadoPostulacion'
    ]);
    
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['getCurrentUser']);
    
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    } as any));

    const popoverSpy = jasmine.createSpyObj('PopoverController', ['create']);
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    await TestBed.configureTestingModule({
      imports: [ BandejaPage ], // Standalone
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: ToastController, useValue: toastSpy },
        { provide: PopoverController, useValue: popoverSpy }, // Necesario para HeaderMenu
        { provide: NavController, useValue: navSpy }          // Necesario para Ionic
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Ignora errores de UI externos
    }).compileComponents();

    fixture = TestBed.createComponent(BandejaPage);
    component = fixture.componentInstance;

    // 2. Inyectar
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;

    // Configuración por defecto (Usuario logueado)
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve({ id: 100, nombre: 'Juan' }));
    
    // Configuración por defecto API (Arrays vacíos para no romper la carga inicial)
    apiServiceSpy.obtenerMisPostulaciones.and.returnValue(of([]));
    apiServiceSpy.obtenerMisSolicitudesConPostulantes.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE CARGA DE DATOS ---

  it('debería cargar usuario y datos al entrar (ionViewWillEnter)', fakeAsync(() => {
    // Arrange: Preparamos datos simulados
    const mockPostulaciones = [{ id: 1, estado: 'pendiente' }];
    const mockSolicitudes = [{ id: 5, titulo: 'Trabajo Test', postulantes: [] }];

    apiServiceSpy.obtenerMisPostulaciones.and.returnValue(of(mockPostulaciones));
    apiServiceSpy.obtenerMisSolicitudesConPostulantes.and.returnValue(of(mockSolicitudes));

    // Act: Ejecutamos el ciclo de vida manualmente
    component.ionViewWillEnter();
    tick(); // Esperamos promesas

    // Assert
    expect(component.usuarioId).toBe(100); // ID del usuario mockeado en beforeEach
    expect(apiServiceSpy.obtenerMisPostulaciones).toHaveBeenCalledWith(100);
    expect(apiServiceSpy.obtenerMisSolicitudesConPostulantes).toHaveBeenCalledWith(100);
    
    // Verificamos que las variables locales se llenaron
    expect(component.misPostulaciones).toEqual(mockPostulaciones);
    expect(component.misSolicitudes).toEqual(mockSolicitudes);
  }));

  it('debería manejar error al cargar datos', fakeAsync(() => {
    // Arrange: API falla
    apiServiceSpy.obtenerMisPostulaciones.and.returnValue(throwError(() => new Error('Error API')));
    spyOn(console, 'error'); // Silenciamos consola

    // Act
    component.ionViewWillEnter();
    tick();

    // Assert
    expect(console.error).toHaveBeenCalled();
    // Las listas deberían seguir vacías (o como estaban por defecto)
    expect(component.misPostulaciones).toEqual([]);
  }));

  // --- PRUEBAS DE GESTIÓN (Aceptar/Rechazar) ---

  it('debería aceptar una postulación correctamente', fakeAsync(() => {
    // Arrange
    const postulacionId = 50;
    const nuevoEstado = 'aceptada';
    component.usuarioId = 100; // Aseguramos usuario

    // Simulamos éxito en la actualización
    apiServiceSpy.cambiarEstadoPostulacion.and.returnValue(of({ success: true }));

    // Act
    component.gestionarPostulacion(postulacionId, nuevoEstado);
    tick();

    // Assert
    expect(apiServiceSpy.cambiarEstadoPostulacion).toHaveBeenCalledWith(postulacionId, nuevoEstado);
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Muestra mensaje éxito
    
    // IMPORTANTE: Debe recargar los datos para refrescar la vista
    expect(apiServiceSpy.obtenerMisPostulaciones).toHaveBeenCalled(); 
  }));

  it('debería manejar error al gestionar postulación', fakeAsync(() => {
    // Arrange
    apiServiceSpy.cambiarEstadoPostulacion.and.returnValue(throwError(() => new Error('Error')));

    // Act
    component.gestionarPostulacion(1, 'rechazada');
    tick();

    // Assert
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Muestra mensaje error (danger)
  }));

  // --- PRUEBAS DE UI (Segmentos) ---

  it('debería cambiar el segmento seleccionado', () => {
    // Valor inicial
    expect(component.segmentoSeleccionado).toBe('solicitudes');

    // Simulamos evento de cambio
    const event = { detail: { value: 'postulaciones' } };
    component.cambiarSegmento(event);

    expect(component.segmentoSeleccionado).toBe('postulaciones');
  });

});