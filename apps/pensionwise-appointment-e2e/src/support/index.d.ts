/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    acceptCookies(): void;
    rejectCookies(): void;
    verifyTaskCompletion(taskNumber: number): Chainable<Element>;
    checkLinkHref(selector: string): Chainable<Element>;
    interceptResponse(response: string): void;
    viewSummaryDocument(
      selectedHomePageOption: string,
      selectedDataTestId: string,
    ): void;
    viewPensionGuidance(selectedHomePageOption: string): void;
  }
}
