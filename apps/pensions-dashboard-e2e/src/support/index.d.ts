/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    acceptCookies(): void;
    rejectCookies(): void;
  }
}
