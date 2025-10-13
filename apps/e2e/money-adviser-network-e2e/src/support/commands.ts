// Breakpoints
Cypress.Commands.add('setBreakPoint', (viewport) => {
  if (viewport == 'desktop') {
    cy.viewport(1534, 900);
  } else if (viewport == 'tablet') {
    cy.viewport(1180, 820);
  } else if (viewport == 'mobile') {
    cy.viewport(639, 1080);
  }
});

// set cookie control cookie
Cypress.Commands.add('setCookieControl', () => {
  cy.setCookie(
    'CookieControl',
    JSON.stringify({
      necessaryCookies: [],
      optionalCookies: { analytics: 'revoked', marketing: 'revoked' },
      statement: {},
      consentDate: 0,
      consentExpiry: 0,
      interactedWith: true,
      user: 'anonymous',
    }),
  );
});

// Signin
Cypress.Commands.add('login', () => {
  const username = Cypress.env('ENTRA_E2E_USERNAME');
  const password = Cypress.env('ENTRA_E2E_PASSWORD');

  if (!username || !password) {
    throw new Error('ENTRA_E2E_USERNAME and ENTRA_E2E_PASSWORD must be set');
  }

  cy.get('#username').type(username);
  cy.get('#password').type(password);
  cy.get('[data-testid="sign-in"]').click();
});

// Element should contain text
Cypress.Commands.add('elementContainsText', (element, text) => {
  cy.get(element).should('contain.text', text);
});

// Check if an element has an attribute
Cypress.Commands.add('elementHasAttribute', (selector, attribute) => {
  cy.get(selector).should('have.attr', attribute);
});

// Check if an element has an attribute and expected value
Cypress.Commands.add(
  'elementHasAttributeValue',
  (selector, attribute, value) => {
    cy.get(selector).invoke('attr', attribute).should('equal', value);
  },
);

// Skip exceptions
Cypress.Commands.add('skipExceptions', () => {
  Cypress.on('uncaught:exception', () => {
    return false;
  });
});
