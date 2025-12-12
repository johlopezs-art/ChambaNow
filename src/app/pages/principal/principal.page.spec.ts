import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PrincipalPage } from './principal.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; 
// IMPORTANTE: Agregamos NavController para solucionar el error actual
import { PopoverController, NavController } from '@ionic/angular/standalone';

describe('PrincipalPage', () => {
  let component: PrincipalPage;
  let fixture: ComponentFixture<PrincipalPage>;

  // Spies
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let navControllerSpy: jasmine.SpyObj<NavController>; // Nuevo espía

  beforeEach(async () => {
    // 1. Crear Espías básicos
    const apiSpy = jasmine.createSpyObj('ApiService', ['obtenerSolicitudes']);
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);

    // 2. MOCK POPOVER (Para el HeaderMenu)
    const popoverSpy = jasmine.createSpyObj('PopoverController', ['create', 'dismiss']);
    popoverSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
      dismiss: jasmine.createSpy('dismiss').and.returnValue(Promise.resolve())
    } as any));

    // 3. MOCK NAVCONTROLLER (Para solucionar el error 'Cannot read properties of undefined (reading subscribe)')
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward', 'navigateBack', 'back']);

    await TestBed.configureTestingModule({
      imports: [ PrincipalPage ], 
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: PopoverController, useValue: popoverSpy },
        // AGREGAMOS EL PROVIDER DE NAVCONTROLLER
        { provide: NavController, useValue: navSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    fixture = TestBed.createComponent(PrincipalPage);
    component = fixture.componentInstance;

    // 4. Inyectar Espías
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    // Configuración por defecto
    routerSpy.getCurrentNavigation.and.returnValue(null);
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve({ nombre: 'Usuario Test' }));
    apiServiceSpy.obtenerSolicitudes.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE CARGA DE DATOS ---

  it('debería cargar usuario desde DBTaskService si no viene por router', fakeAsync(() => {
    const mockUser = { id: 1, nombre: 'Pepe', email: 'pepe@test.com' };
    routerSpy.getCurrentNavigation.and.returnValue(null);
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve(mockUser));

    component.ionViewWillEnter(); 
    tick();

    expect(dbTaskServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(component.usuario).toEqual(mockUser);
  }));

  it('debería cargar las ofertas correctamente desde la API', fakeAsync(() => {
    const mockResponseApi = [
      { id: 10, titulo: 'Pintor', profesion: 'Maestro', especificacion: 'Pintar casa', sueldo: '$50000' }
    ];
    apiServiceSpy.obtenerSolicitudes.and.returnValue(of(mockResponseApi));

    component.ionViewWillEnter(); 
    tick(); 

    expect(apiServiceSpy.obtenerSolicitudes).toHaveBeenCalled();
    expect(component.ofertas.length).toBe(1);
    expect(component.ofertas[0].titulo).toBe('Pintor');
  }));

  it('debería manejar error al cargar ofertas', fakeAsync(() => {
    apiServiceSpy.obtenerSolicitudes.and.returnValue(throwError(() => new Error('Error server')));
    spyOn(console, 'error'); 

    component.ionViewWillEnter();
    tick();

    expect(component.ofertas).toEqual([]); 
    expect(console.error).toHaveBeenCalled(); 
  }));

  // --- PRUEBAS DE NAVEGACIÓN ---

  it('debería navegar al detalle de la oferta al hacer click', () => {
    const idOferta = 99;
    component.verDetalle(idOferta);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/link-trabajo', idOferta]);
  });

  it('debería navegar a crear solicitud', () => {
    component.irCrearSolicitud();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/solicitudes']);
  });

  // --- PRUEBA DE SCROLL ---

  it('debería ocultar el header al hacer scroll hacia abajo (> 50px)', () => {
    component.headerHidden = false;
    const eventoScrollAbajo = { detail: { scrollTop: 100 } };
    component.onScroll(eventoScrollAbajo);
    expect(component.headerHidden).toBeTrue();

    const eventoScrollArriba = { detail: { scrollTop: 50 } };
    component.onScroll(eventoScrollArriba);
    expect(component.headerHidden).toBeFalse();
  });
});