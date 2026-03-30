import { loginSuccess } from '../mocks/responseData';

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
      referrerId: Cypress.env('REFERRAL_ID') || '',
    }),
  );
});

// Signin
Cypress.Commands.add('login', () => {
  cy.task('mockApiPostResponse', {
    endpoint: 'ValidateReferrer',
    responseData: JSON.stringify(loginSuccess),
  });

  const referrerId = Cypress.env('REFERRAL_ID');

  if (!referrerId) {
    throw new Error('REFERRAL_ID must be set');
  }

  cy.get('#referrerId').type(referrerId);
  cy.get('[data-testid="sign-in"]').click();
});

// Confirm Login/Referral
Cypress.Commands.add('confirmLogin', () => {
  cy.get('[data-testid="confirmOrganisation-label"]').click();
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
