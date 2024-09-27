/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    setCookieControl(): void;
  }
}
