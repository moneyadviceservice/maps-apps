import { ACDLPage } from '@maps-react/utils/e2e/support/acdl-page.po';

import debtAdviceLocatorData from '../fixtures/debt-advice-locator.json';

type ResultBlock = {
  heading: string;
  content?: string;
  address?: string;
  phone?: string;
  website?: string;
  linkText?: string;
};

type Result = {
  heading: string;
  subHeading: string;
  content: string;
  sections: ResultBlock[];
};

export class DebtAdviceLocator extends ACDLPage {
  elements = {
    title: () => cy.get('[data-testid="toolpage-h1-title"]'),
    heading: () => cy.get('#main h1'),
    subHeading: () => cy.get('#main h2'),
    continue: () => cy.get('form button[type="submit"]'),
    content: () => cy.get('p[data-testid="paragraph"]'),

    england: () => cy.get('label[for="id-0"]'),
    scotland: () => cy.get('label[for="id-1"]'),
    wales: () => cy.get('label[for="id-2"]'),
    northernIreland: () => cy.get('label[for="id-3"]'),

    customerSelfEmployedYes: () => cy.get('label[for="id-0"]'),
    customerSelfEmployedNo: () => cy.get('label[for="id-1"]'),

    moneyManagementHelp: () => cy.get('label[for="id-0"]'),
    moneyManagementHelpText: () => cy.get('#hint-0'),
    moneyManagementRadio: () => cy.get('#id-0'),
    debtAdvice: () => cy.get('label[for="id-1"]'),
    debtAdviceText: () => cy.get('#hint-1'),
    debtAdviceRadio: () => cy.get('#id-1'),
    expandableSection: () => cy.get('[data-testid="summary-block-title"]'),
    expandableSectionText: () => cy.get('.my-2'),
    submitForm: () => cy.get('[data-testid="submit-form"]'),
    signOutButton: () => cy.get('[data-cy="sign-out-button"]'),
    makeAnotherReferralButton: () => cy.get('[data-cy="restart-tool-button"]'),

    back: () => cy.get('#main a').first(),

    englandYes: () => cy.get('label[for="id-0"]'),
    englandNo: () => cy.get('label[for="id-1"]'),

    online: () => cy.get('label[for="id-0"]'),
    onlineHint: () => cy.get('[data-testid="hint-0"]'),

    telephone: () => cy.get('label[for="id-1"]'),
    telephoneHint: () => cy.get('[data-testid="hint-1"]'),

    face2Face: () => cy.get('label[for="id-2"]'),
    face2FaceHint: () => cy.get('[data-testid="hint-2"]'),

    locationLabel: () => cy.get('label[for="q-4"]'),
    location: () => cy.get('#q-4'),

    hintLabel: () => cy.get('[data-testid="summary-block-title"]'),

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
    this.elements
      .errorSummaryContainer()
      .should('be.visible')
      .should('not.be.empty');
    this.elements
      .errorSummaryHeading()
      .should(
        'have.text',
        debtAdviceLocatorData.errorMessages.errorSummaryHeading,
      );
    messages.forEach((message, index) => {
      this.elements.errorRecords().eq(index).should('have.text', message);
    });
  }

  checkErrorMessageOnElement(selector: string, message: string) {
    cy.get(selector).should('have.text', message);
  }

  checkEmployeeOptions() {
    this.elements
      .online()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.online.label,
      );
    this.elements
      .onlineHint()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.online.hint,
      );

    this.elements
      .telephone()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.telephone.label,
      );
    this.elements
      .telephoneHint()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.telephone.hint,
      );

    this.elements
      .face2Face()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.faceToFace.label,
      );
    this.elements
      .face2FaceHint()
      .should(
        'have.text',
        debtAdviceLocatorData.employeeDetails.fields.faceToFace.hint,
      );
  }

  checkLocationField() {
    this.elements
      .locationLabel()
      .should('have.text', debtAdviceLocatorData.face2FaceLocation.fieldLabel);
    this.elements
      .hintLabel()
      .should('have.text', debtAdviceLocatorData.face2FaceLocation.hint)
      .click();
    this.elements
      .content()
      .should('be.visible')
      .should('have.text', debtAdviceLocatorData.face2FaceLocation.hintDetail);
  }

  validateNoResults() {
    this.elements
      .title()
      .should('be.visible')
      .should('have.text', debtAdviceLocatorData.face2FaceNoResults.title);
    this.elements
      .heading()
      .should('have.text', debtAdviceLocatorData.face2FaceNoResults.heading);
    this.elements
      .subHeading()
      .should('have.text', debtAdviceLocatorData.face2FaceNoResults.subHeading);
    this.elements
      .content()
      .should('have.text', debtAdviceLocatorData.face2FaceNoResults.content);
  }

  clickChangeLocation() {
    cy.contains(debtAdviceLocatorData.face2FaceNoResults.locationLink).click();
  }

  clickGoBackToOptions() {
    cy.contains(debtAdviceLocatorData.face2FaceNoResults.goBackLink).click();
  }

  validateResultsInfo(heading, subHeading, content) {
    this.elements.heading().should('have.text', heading);
    this.elements.subHeading().should('have.text', subHeading);

    this.elements
      .subHeading()
      .parent()
      .parent()
      .within(() => {
        this.elements.content().should('have.text', content);
      });
  }

  validateResultContent(content, address, phone, website, linkText) {
    if (content) {
      this.elements
        .content()
        .invoke('text')
        .then((actualText) => {
          const normalizedActual = actualText.replace(/\s+/g, ' ').trim();
          const normalizedExpected = content.replace(/\s+/g, ' ').trim();

          expect(normalizedActual).to.include(normalizedExpected);
        });
    }

    if (address) {
      cy.get('dt').first().should('have.text', 'Address');
      cy.get('dd').first().should('contain.text', address);
    }
    if (phone) {
      cy.get('dt')
        .eq(address ? 1 : 0)
        .should('have.text', 'Telephone number');
      cy.get('dd')
        .eq(address ? 1 : 0)
        .should('have.text', phone);
    }
    if (website) {
      cy.get('dt').last().should('have.text', 'Website');
      cy.get('dd').last().should('have.text', linkText);
      cy.get('dd a').last().should('have.attr', 'href', website);
    }
  }

  validateResults(result: Result) {
    this.validateResultsInfo(result.heading, result.subHeading, result.content);
    result.sections.forEach((block) => {
      const { heading, content, address, phone, website, linkText } = block;
      cy.get('h1, h2, h3, h4, h5, h6, [role="heading"]').each(($el) => {
        if ($el.text().trim() === heading) {
          cy.wrap($el)
            .parent()
            .within(() => {
              this.validateResultContent(
                content,
                address,
                phone,
                website,
                linkText,
              );
            });
          return false;
        }
      });
    });
  }

  validateF2FResults(result: Result) {
    this.validateResultsInfo(result.heading, result.subHeading, result.content);

    // Wait for all accordion elements to be present and the first one to be initialized
    cy.get('summary:contains("Contact information")').should(
      'have.length.at.least',
      result.sections.length,
    );

    // Wait for the first accordion to be in its expected open state
    cy.get('summary:contains("Contact information")')
      .first()
      .parent()
      .should('have.attr', 'open');

    result.sections.forEach((block, index) => {
      const { heading, content, address, phone, website, linkText } = block;
      cy.get('h1, h2, h3, h4, h5, h6, [role="heading"]').each(($el) => {
        if ($el.text().trim() === heading) {
          cy.wrap($el).scrollIntoView();
          cy.wrap($el)
            .parent()
            .parent()
            .parent()
            .within(() => {
              cy.get('summary').should('have.text', 'Contact information');
              if (index === 0) {
                cy.get('summary').parent().should('have.attr', 'open');
              } else {
                cy.get('summary').parent().should('not.have.attr', 'open');
                cy.get('summary').click();
                cy.get('summary').parent().should('have.attr', 'open');
              }
              this.validateResultContent(
                content,
                address,
                phone,
                website,
                linkText,
              );
            });
          return false;
        }
      });
    });
  }
}
