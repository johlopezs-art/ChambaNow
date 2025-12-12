import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LinkTrabajoPage } from './link-trabajo.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, PopoverController, NavController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LinkTrabajoPage', () => {
  let component: LinkTrabajoPage;
  let fixture: ComponentFixture<LinkTrabajoPage>;

  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let loadingControllerSpy: jasmine.SpyObj<LoadingController>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // 1. Mocks
    const apiSpy = jasmine.createSpyObj('ApiService', ['obtenerSolicitudPorId', 'postular']);
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['getCurrentUser']);
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
    const navSpy = jasmine.createSpyObj('NavController', ['navigateForward']);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => '123'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ LinkTrabajoPage ],
      providers: [
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastController, useValue: toastSpy },
        { provide: LoadingController, useValue: loadingSpy },
        { provide: PopoverController, useValue: popoverSpy },
        { provide: NavController, useValue: navSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock } 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkTrabajoPage);
    component = fixture.componentInstance;

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    loadingControllerSpy = TestBed.inject(LoadingController) as jasmine.SpyObj<LoadingController>;

    // Configuración Inicial
    dbTaskServiceSpy.getCurrentUser.and.returnValue(Promise.resolve({ id: 10, nombre: 'Pepe' }));
    apiServiceSpy.obtenerSolicitudPorId.and.returnValue(of({ id: 123, titulo: 'Trabajo Demo', usuario_id: 5 }));
    
    // --- CAMBIO IMPORTANTE ---
    // Quitamos fixture.detectChanges() de aquí.
    // Lo llamaremos manualmente dentro de cada test que lo necesite.
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBAS DE INICIALIZACIÓN (ngOnInit) ---

  it('debería cargar el trabajo usando el ID de la URL', fakeAsync(() => {
    // 1. Iniciamos el ciclo de vida manualmente DENTRO del fakeAsync
    fixture.detectChanges(); 
    
    // 2. Avanzamos el reloj para que se resuelvan los 'await' del ngOnInit
    tick(); 

    // 3. Ahora sí verificamos
    expect(apiServiceSpy.obtenerSolicitudPorId).toHaveBeenCalledWith(123);
    expect(component.trabajo).toBeDefined();
    expect(component.trabajo.titulo).toBe('Trabajo Demo');
    expect(component.usuarioId).toBe(10);
  }));

  // --- PRUEBAS DE POSTULACIÓN ---

  it('debería realizar la postulación exitosamente', fakeAsync(() => {
    // Arrange
    component.usuarioId = 10;
    component.trabajo = { id: 123 };
    
    apiServiceSpy.postular.and.returnValue(of({ success: true }));

    // Act
    component.postular();
    tick(); 

    // Assert
    expect(loadingControllerSpy.create).toHaveBeenCalled();
    expect(apiServiceSpy.postular).toHaveBeenCalledWith({ solicitud_id: 123, usuario_id: 10 });
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
    expect(component.yaPostulado).toBeTrue();

    tick(1500); 
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/bandeja']);
  }));

  it('NO debería postular si no hay usuario logueado', fakeAsync(() => {
    component.usuarioId = null; 

    component.postular();
    tick();

    expect(apiServiceSpy.postular).not.toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
  }));

  it('debería manejar error si ya postuló (Error 400)', fakeAsync(() => {
    component.usuarioId = 10;
    component.trabajo = { id: 123 };

    apiServiceSpy.postular.and.returnValue(throwError(() => ({ status: 400 })));

    component.postular();
    tick();

    expect(apiServiceSpy.postular).toHaveBeenCalled();
    expect(toastControllerSpy.create).toHaveBeenCalled(); 
    expect(component.yaPostulado).toBeTrue(); 
  }));

  it('debería manejar otros errores al postular', fakeAsync(() => {
    component.usuarioId = 10;
    component.trabajo = { id: 123 };
    
    apiServiceSpy.postular.and.returnValue(throwError(() => ({ status: 500 })));

    component.postular();
    tick();

    expect(toastControllerSpy.create).toHaveBeenCalled(); 
  }));

});