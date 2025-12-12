import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderMenuComponent } from './header-menu.component';
import { Router } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular/standalone';
import { DBTaskService } from '../../services/dbservice';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HeaderMenuComponent', () => {
  let component: HeaderMenuComponent;
  let fixture: ComponentFixture<HeaderMenuComponent>;

  // Espías
  let routerSpy: jasmine.SpyObj<Router>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let popoverControllerSpy: jasmine.SpyObj<PopoverController>;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(async () => {
    // 1. Crear Mocks
    const rSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['closeSession']);
    
    // Mock Popover (dismiss devuelve promesa)
    const popSpy = jasmine.createSpyObj('PopoverController', ['dismiss']);
    popSpy.dismiss.and.returnValue(Promise.resolve(true));

    // Mock NavController (necesario para navigateRoot y back-button)
    const navSpy = jasmine.createSpyObj('NavController', ['navigateRoot', 'back']);

    await TestBed.configureTestingModule({
      imports: [ HeaderMenuComponent ], // Componente Standalone
      providers: [
        { provide: Router, useValue: rSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: PopoverController, useValue: popSpy },
        { provide: NavController, useValue: navSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] // Para evitar errores con iconos o componentes anidados
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderMenuComponent);
    component = fixture.componentInstance;
    
    // 2. Inyectar instancias
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    popoverControllerSpy = TestBed.inject(PopoverController) as jasmine.SpyObj<PopoverController>;
    navControllerSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA DE TÍTULO ---

  it('debería tener el título por defecto "ChambaNow"', () => {
    expect(component.title).toBe('ChambaNow');
  });

  // --- PRUEBA DE NAVEGACIÓN ---

  it('navegar() debería cerrar el popover y redirigir', fakeAsync(() => {
    const rutaDestino = '/perfil';
    
    // Act
    component.navegar(rutaDestino);
    tick(); // Esperar a que cierre el popover (es async)

    // Assert
    expect(popoverControllerSpy.dismiss).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith([rutaDestino]);
  }));

  // --- PRUEBA DE LOGOUT ---

  it('logout() debería cerrar popover, cerrar sesión en BD y navegar al login', fakeAsync(() => {
    // Arrange: Simulamos que cerrar sesión devuelve una promesa resuelta
    dbTaskServiceSpy.closeSession.and.returnValue(Promise.resolve());

    // Act
    component.logout();
    tick();

    // Assert
    expect(popoverControllerSpy.dismiss).toHaveBeenCalled(); // 1. Cierra menú
    expect(dbTaskServiceSpy.closeSession).toHaveBeenCalled(); // 2. Borra sesión
    
    // 3. Verifica que usa navigateRoot para limpiar historial
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledWith('/login'); 
  }));

});