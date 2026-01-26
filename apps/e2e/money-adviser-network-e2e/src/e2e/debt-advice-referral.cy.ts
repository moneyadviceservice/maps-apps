import { ACDLEventTypes } from '@maps-react/utils/e2e/support/acdl-page.po';

import data from '../fixtures/debt-advice-referral.json';
import { slots } from '../mocks/responseData';
import { DebtAdviceReferral } from '../pages/debt-advice-referral.po';

describe('Debt Advice Referral', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/en');
    cy.login();
    cy.confirmLogin();
    cy.url().should('include', '/start/q-1');
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.task('resetApiMocks');
  });

  const page = new DebtAdviceReferral();

  it('Money management help', () => {
    page.elements.title().should('have.text', data.customerNeed.title);
    page.elements.heading().should('have.text', data.customerNeed.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.TOOL_START, ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements
      .moneyManagementHelp()
      .should('have.text', data.customerNeed.moneyManagementHelp);
    page.elements
      .moneyManagementHelpText()
      .should('have.text', data.customerNeed.moneyManagementHelpText);
    page.elements
      .debtAdvice()
      .should('have.text', data.customerNeed.debtAdvice);
    page.elements
      .debtAdviceText()
      .should('have.text', data.customerNeed.debtAdviceText);

    page.elements
      .expandableSection()
      .should('have.text', data.customerNeed.expandableSection);

    page.elements.expandableSection().click({ force: true });
    page.elements
      .expandableSectionText()
      .click()
      .should('have.text', data.customerNeed.ExpandableSectionText);

    page.elements.moneyManagementRadio().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.title().should('have.text', data.customerLinks.title);
    page.elements.heading().should('have.text', data.customerLinks.heading);
    page.elements.content().should('have.text', data.customerLinks.content);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.back().click();

    cy.url().should('include', '/start/q-1');
    page.elements.moneyManagementRadio().should('be.checked');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.continue().click({ force: true });

    page.elements.title().should('have.text', data.customerLinks.title);
    page.elements.heading().should('have.text', data.customerLinks.heading);

    page.elements.makeAnotherReferralButton().click();
    cy.url().should('include', '/start/q-1');
    page.elements.moneyManagementRadio().should('not.be.checked');
    page.elements.debtAdviceRadio().should('not.be.checked');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.TOOL_START, ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.moneyManagementRadio().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.heading().should('have.text', data.customerLinks.heading);
    page.elements.signOutButton().click();
    cy.url().should('not.include', '/start/q-1');
    cy.url().should('include', '/en');
  });

  it('Debt advice - customer not living in england', () => {
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.newReferral]);
    page.checkErrorMessageOnElement(
      '#q-1  div[data-testid="errorMessage-1"]',
      data.errorMessages.newReferral,
    );

    page.elements.debtAdviceRadio().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.heading().should('have.text', data.customerLive.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.livingPlace]);
    page.checkErrorMessageOnElement(
      '#q-2  div[data-testid="errorMessage-2"]',
      data.errorMessages.livingPlace,
    );

    page.elements.englandNo().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('have.text', data.customerOutsideEngland.title);
    page.elements
      .heading()
      .should('have.text', data.customerOutsideEngland.heading);
    page.elements
      .content()
      .should('have.text', data.customerOutsideEngland.content);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
  });

  it('Debt advice - customer living in england', () => {
    page.elements.debtAdviceRadio().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.heading().should('have.text', data.customerLive.heading);
    page.elements.englandYes().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('have.text', data.customerSelfEmployedDetails.title);
    page.elements
      .heading()
      .should('have.text', data.customerSelfEmployedDetails.heading);
    page.elements.customerSelfEmployedYes().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('have.text', data.customerSelfEmployedReferral.title);
    page.elements
      .heading()
      .should('have.text', data.customerSelfEmployedReferral.heading);
    page.elements
      .content()
      .should('have.text', data.customerSelfEmployedReferral.content);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.back().click({ force: true });

    page.elements
      .heading()
      .should('have.text', data.customerSelfEmployedDetails.heading);
    page.elements.customerSelfEmployedNo().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('have.text', data.customerEmployedDetails.title);
    page.elements
      .heading()
      .should('have.text', data.customerEmployedDetails.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.employeeHelp]);
    page.checkErrorMessageOnElement(
      '#q-4  div[data-testid="errorMessage-4"]',
      data.errorMessages.employeeHelp,
    );
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.face2Face().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.title().should('have.text', data.face2FaceReferral.title);
    page.elements.heading().should('have.text', data.face2FaceReferral.heading);
    page.elements.content().should('have.text', data.face2FaceReferral.content);
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.back().click({ force: true });
    page.elements
      .heading()
      .should('be.visible')
      .should('have.text', data.customerEmployedDetails.heading);

    page.elements.online().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.title().should('have.text', data.customerConsent.title);
    page.elements.heading().should('have.text', data.customerConsent.heading);
    page.elements.content().should('have.text', data.customerConsent.content);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.customerConsent]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.customerConsentNo().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.title().should('have.text', data.noConsentReferral.title);
    page.elements.heading().should('have.text', data.noConsentReferral.heading);
    page.elements
      .nonConsentContent()
      .should('have.text', data.noConsentReferral.content);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );

    page.elements.back().click({ force: true });
    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.customerConsent.title);

    page.elements.customerConsentYes().click({ force: true });
    page.elements.continue().click({ force: true });

    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    cy.get('#firstName').type('firstname');
    cy.get('#lastName').type('lastname');
    cy.get('#email').type('test@email.com');
    page.elements.continue().click({ force: true });

    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    cy.task('mockApiPostResponse', {
      endpoint: 'BookAppointment',
    });
    page.elements.submitForm().click({ force: true });

    cy.url().should('include', '/online/details-sent');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION_NO_INPUT],
      data.acdlEntries,
      true,
    );
  });
});
