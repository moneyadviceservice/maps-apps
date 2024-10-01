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
