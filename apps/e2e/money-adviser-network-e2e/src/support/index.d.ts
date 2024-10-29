/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    setBreakPoint(
      viewport: 'desktop' | 'tablet' | 'mobile',
    ): Chainable<Element>;
    setCookieControl(): Chainable;
    elementContainsText(element: string, text: string): Chainable<Element>;
    elementHasAttribute(
      selector: string,
      attribute: string,
    ): Chainable<Element>;
    elementHasAttributeValue(
      selector: string,
      attribute: string,
      value: string,
    ): Chainable<Element>;
    skipExceptions(): Chainable;
  }
}
