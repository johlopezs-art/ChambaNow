describe('Flujo de Registro de Usuario', () => {
  
  beforeEach(() => {
    // Visitamos la página de registro directamente
    cy.visit('/registro');
  });

  it('Debería validar que las contraseñas coincidan', () => {
    // 1. Llenar datos con contraseñas distintas
    cy.get('ion-input[formControlName="nombre"] input').type('Test', { force: true });
    cy.get('ion-input[formControlName="apellido"] input').type('User', { force: true });
    cy.get('ion-input[formControlName="email"] input').type('test@error.com', { force: true });
    
    cy.get('ion-input[formControlName="password"] input').type('123456', { force: true });
    cy.get('ion-input[formControlName="confirmarPassword"] input').type('654321', { force: true }); // Diferente

    // 2. Hacer clic fuera para que Angular detecte el cambio (blur)
    cy.get('ion-input[formControlName="confirmarPassword"] input').blur();

    // 3. Verificar que el botón de registro está deshabilitado
    // (En tu HTML tienes [disabled]="form.invalid")
    cy.get('ion-button[type="submit"]').should('be.disabled');

    // 4. Verificar que aparece el mensaje de error
    cy.contains('Las contraseñas no coinciden').should('be.visible');
  });

  it('Debería registrar un usuario nuevo exitosamente', () => {
    // Generamos un número aleatorio para el email para evitar error de "Usuario duplicado"
    const randomId = Math.floor(Math.random() * 10000);
    const emailUnico = `usuario_e2e_${randomId}@cypress.com`;

    // 1. Llenar el formulario completo correctamente
    cy.get('ion-input[formControlName="nombre"] input').type('Cypress', { force: true });
    cy.get('ion-input[formControlName="apellido"] input').type('Testing', { force: true });
    cy.get('ion-input[formControlName="email"] input').type(emailUnico, { force: true });
    
    cy.get('ion-input[formControlName="password"] input').type('password123', { force: true });
    cy.get('ion-input[formControlName="confirmarPassword"] input').type('password123', { force: true });

    // 2. Click en Registrar
    // Esperamos a que el botón se habilite primero
    cy.get('ion-button[type="submit"]').should('not.be.disabled').click();

    // 3. Verificar éxito
    // Esperamos el Toast de éxito
    cy.get('ion-toast').should('exist');
    cy.get('ion-toast').shadow().find('.toast-message').should('contain', 'exitoso');

    // 4. Verificar redirección al Login
    // Esperamos unos segundos porque el Toast dura 2s
    cy.url().should('include', '/login');
  });

});