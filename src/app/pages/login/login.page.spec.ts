import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { ApiService } from '../../services/api';
import { DBTaskService } from '../../services/dbservice';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  // Variables para los espías
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    // 1. Crear los objetos espía PRIMERO
    const apiSpy = jasmine.createSpyObj('ApiService', ['login']);
    const dbSpy = jasmine.createSpyObj('DBTaskService', ['createSession']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    
    // Configuración especial para Toast (devuelve promesa de objeto con present)
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);
    toastSpy.create.and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve())
    } as any));

    await TestBed.configureTestingModule({
      imports: [ 
        LoginPage, 
        ReactiveFormsModule,
        BrowserAnimationsModule 
      ],
      providers: [
        // 2. Inyectamos los espías creados
        { provide: ApiService, useValue: apiSpy },
        { provide: DBTaskService, useValue: dbSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ToastController, useValue: toastSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    // 3. LA CORRECCIÓN CLAVE:
    // Recuperamos las instancias inyectadas para asegurar que las pruebas usan lo mismo que el componente
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    dbTaskServiceSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
    
    // Mock manual del loader para evitar errores de undefined
    component.loader = {
      showFor: jasmine.createSpy('showFor'),
      hide: jasmine.createSpy('hide')
    } as any;

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería completar el login exitoso: llamar API, guardar en BD y navegar', fakeAsync(() => {
    // 1. Arrange
    const mockUser = { id: 1, nombre: 'Juan', token: 'xyz' };
    component.form.setValue({ email: 'juan@test.com', password: 'password123' });

    // Configuramos qué devuelven los espías
    apiServiceSpy.login.and.returnValue(of(mockUser));
    dbTaskServiceSpy.createSession.and.returnValue(Promise.resolve());

    // 2. Act
    component.onSubmit();
    tick(); // Esperamos promesas

    // 3. Assert
    expect(apiServiceSpy.login).toHaveBeenCalledWith({ email: 'juan@test.com', password: 'password123' });
    expect(dbTaskServiceSpy.createSession).toHaveBeenCalledWith(mockUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/principal'], { state: { usuario: mockUser } });
  }));

  it('debería manejar error si la API falla (credenciales incorrectas)', fakeAsync(() => {
    // 1. Arrange
    component.form.setValue({ email: 'error@test.com', password: 'wrong' });

    // Simulamos error de API
    apiServiceSpy.login.and.returnValue(throwError(() => new Error('401 Unauthorized')));

    // 2. Act
    component.onSubmit();
    tick();

    // 3. Assert
    expect(apiServiceSpy.login).toHaveBeenCalled(); // Verifica que se intentó loguear
    expect(dbTaskServiceSpy.createSession).not.toHaveBeenCalled(); // No debe guardar sesión
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // No debe navegar
    expect(toastControllerSpy.create).toHaveBeenCalled(); // Debe mostrar error
  }));
});