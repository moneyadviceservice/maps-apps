/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    setCookieControl(): void;
    confirmPage(url: string, timeout?: number): void;
    logout(): void;
  }
}
