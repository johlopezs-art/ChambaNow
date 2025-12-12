import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard'; // IMPORTACIÓN CORRECTA (CLASE)
import { Router } from '@angular/router';
import { DBTaskService } from '../services/dbservice';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let dbTaskServiceSpy: jasmine.SpyObj<DBTaskService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // 1. Mock de DBTaskService (Solo necesitamos isSessionActive)
    dbTaskServiceSpy = jasmine.createSpyObj('DBTaskService', ['isSessionActive']);

    // 2. Mock de Router (Solo necesitamos navigate)
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard, // Proveemos el Guard como servicio
        { provide: DBTaskService, useValue: dbTaskServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('debería crearse el guard', () => {
    expect(guard).toBeTruthy();
  });

  it('debería PERMITIR el acceso (return true) si la sesión está activa', async () => {
    // Arrange: Simulamos que hay sesión activa
    dbTaskServiceSpy.isSessionActive.and.returnValue(Promise.resolve(true));

    // Act
    const canActivate = await guard.canActivate();

    // Assert
    expect(canActivate).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled(); // No debe redirigir
  });

  it('debería DENEGAR el acceso (return false) y redirigir al Login si no hay sesión', async () => {
    // Arrange: Simulamos que NO hay sesión
    dbTaskServiceSpy.isSessionActive.and.returnValue(Promise.resolve(false));

    // Act
    const canActivate = await guard.canActivate();

    // Assert
    expect(canActivate).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']); // Debe redirigir
  });
});