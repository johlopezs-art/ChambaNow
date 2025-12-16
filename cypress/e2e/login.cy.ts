describe('Flujo de Login en ChambaNow', () => {
  
  beforeEach(() => {
    // 1. Visitar la página de inicio (ajusta la URL si usas otro puerto)
    cy.visit('/login');
  });

  it('Debería mostrar error con credenciales inválidas', () => {
    // Ionic usa Shadow DOM, a veces es truculento seleccionar inputs.
    // Usamos selectores robustos basados en tu HTML.
    
    // 1. Escribir email incorrecto
    cy.get('ion-input[formControlName="email"] input').type('correo@falso.com', { force: true });
    
    // 2. Escribir password incorrecto
    cy.get('ion-input[formControlName="password"] input').type('claveerronea', { force: true });
    
    // 3. Hacer clic en Ingresar (buscamos el botón type="submit")
    cy.get('ion-button[type="submit"]').click();

    // 4. Verificar que aparece el Toast de error (Ionic Toast)
    // Cypress espera automáticamente a que aparezca
    cy.get('ion-toast').should('exist');
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'Error'); 
  });

  it('Debería loguearse correctamente y redirigir al Principal', () => {
    // 1. Llenar con datos reales (Asegúrate de que este usuario exista en tu BD o API local)
    cy.get('ion-input[formControlName="email"] input').type('juan@test.com', { force: true });
    cy.get('ion-input[formControlName="password"] input').type('password123', { force: true });

    // 2. Click Login
    cy.get('ion-button[type="submit"]').click();

    // 3. Verificar redirección
    // Esperamos que la URL cambie a '/principal'
    cy.url().should('include', '/principal');

    // 4. Verificar que estamos en el home (ej: buscando el título)
    cy.contains('Bienvenido').should('be.visible');
  });

});