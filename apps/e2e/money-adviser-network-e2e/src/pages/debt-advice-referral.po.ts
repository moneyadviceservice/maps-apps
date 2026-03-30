import { ACDLPage } from '@maps-react/utils/e2e/support/acdl-page.po';

import debtAdviceReferralData from '../fixtures/debt-advice-referral.json';

export class DebtAdviceReferral extends ACDLPage {
  elements = {
    title: () => cy.get('[data-testid="toolpage-span-title"]'),
    heading: () => cy.get('#main h1'),
    content: () => cy.get('p[data-testid="paragraph"]'),
    moneyManagementHelp: () => cy.get('label[for="id-0"]'),
    moneyManagementHelpText: () => cy.get('#hint-0'),
    moneyManagementRadio: () => cy.get('#id-0'),
    debtAdvice: () => cy.get('label[for="id-1"]'),
    debtAdviceText: () => cy.get('#hint-1'),
    debtAdviceRadio: () => cy.get('#id-1'),
    expandableSection: () => cy.get('[data-testid="summary-block-title"]'),
    expandableSectionText: () => cy.get('.my-2'),
    continue: () => cy.get('[data-testid="step-container-submit-button"]'),
    submitForm: () => cy.get('[data-testid="submit-form"]'),
    signOutButton: () => cy.get('[data-cy="sign-out-button"]'),
    makeAnotherReferralButton: () => cy.get('[data-cy="restart-tool-button"]'),

    back: () => cy.get('#main a').first(),

    englandYes: () => cy.get('label[for="id-0"]'),
    englandNo: () => cy.get('label[for="id-1"]'),

    customerSelfEmployedYes: () => cy.get('label[for="id-0"]'),
    customerSelfEmployedNo: () => cy.get('label[for="id-1"]'),

    online: () => cy.get(`[data-testid='radio-input-0']`),
    onlineHint: () => cy.get('[data-testid="hint-0"]'),

    telephone: () => cy.get(`[data-testid='radio-input-1']`),
    telephoneHint: () => cy.get('[data-testid="hint-1"]'),

    face2Face: () => cy.get(`[data-testid='radio-input-2']`),
    face2FaceHint: () => cy.get('[data-testid="hint-2"]'),

    customerConsentYes: () => cy.get('label[for="id-0"]'),
    customerConsentNo: () => cy.get('label[for="id-1"]'),
    nonConsentContent: () => cy.get('#main h1 ~ ul li'),
    consentDetails: () => cy.get('label[for="id-0"]'),
    consentReferral: () => cy.get('label[for="id-0"]'),

    immediateCallback: () => cy.get('[data-testid="radio-input-0"]'),
    scheduleForLater: () => cy.get('[data-testid="radio-input-1"]'),

    selectFirstSlot: () => cy.get('[data-testid="radio-input-0"]'),

    errorSummaryContainer: () =>
      cy.get('[data-testid="error-summary-container"]'),
    errorSummaryHeading: () => cy.get('#error-summary-heading'),
    errorRecords: () => cy.get('[data-testid="error-records"] li'),
  };

  checkErrorMessages(messages: string[]) {
    this.elements.errorSummaryContainer().should('not.be.empty');
    this.elements
      .errorSummaryHeading()
      .should(
        'have.text',
        debtAdviceReferralData.errorMessages.errorSummaryHeading,
      );
    for (const [index, message] of messages.entries()) {
      this.elements.errorRecords().eq(index).should('have.text', message);
    }
  }

  checkErrorMessageOnElement(selector: string, message: string) {
    cy.get(selector).should('have.text', message);
  }

  checkEmployeeOptions() {
    this.elements
      .online()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.online.label,
      );
    this.elements
      .onlineHint()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.online.hint,
      );

    this.elements
      .telephone()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.telephone.label,
      );
    this.elements
      .telephoneHint()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.telephone.hint,
      );

    this.elements
      .face2Face()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.faceToFace.label,
      );
    this.elements
      .face2FaceHint()
      .should(
        'have.text',
        debtAdviceReferralData.customerEmployedDetails.fields.faceToFace.hint,
      );
  }
}
