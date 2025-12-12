import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DBTaskService } from './services/dbservice';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
// IMPORTANTE: Importamos ActivatedRoute
import { ActivatedRoute } from '@angular/router';

describe('AppComponent', () => {
  let dbTaskSpy: jasmine.SpyObj<DBTaskService>;

  beforeEach(async () => {
    // 1. Mock de DBTaskService
    const spy = jasmine.createSpyObj('DBTaskService', ['dbState']);
    spy.dbState.and.returnValue(of(true)); 

    await TestBed.configureTestingModule({
      imports: [AppComponent], 
      providers: [
        { provide: DBTaskService, useValue: spy },
        // 2. SOLUCIÓN AL ERROR: Proveemos un objeto vacío para ActivatedRoute
        // Esto engaña al ion-router-outlet para que crea que hay rutas configuradas
        { provide: ActivatedRoute, useValue: {} } 
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA] 
    }).compileComponents();

    dbTaskSpy = TestBed.inject(DBTaskService) as jasmine.SpyObj<DBTaskService>;
  });

  it('debería crear la aplicación (AppComponent)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('debería inicializar DBTaskService y suscribirse al estado de la BD', () => {
    const fixture = TestBed.createComponent(AppComponent);
    // El constructor se ejecuta automáticamente al crear el componente
    expect(dbTaskSpy.dbState).toHaveBeenCalled();
  });

});