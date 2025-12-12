import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Error404Page } from './error404.page';
import { ActivatedRoute } from '@angular/router'; // Necesario para routerLink
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Necesario para lottie-player

describe('Error404Page', () => {
  let component: Error404Page;
  let fixture: ComponentFixture<Error404Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error404Page], // Componente Standalone
      providers: [
        // MOCK ACTIVATED ROUTE
        // Aunque no leas parámetros, routerLink lo necesita internamente
        { provide: ActivatedRoute, useValue: {} }
      ],
      // IMPORTANTE: Para ignorar errores de <lottie-player>
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(Error404Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});