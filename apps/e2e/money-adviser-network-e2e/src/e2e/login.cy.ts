import { ACDLEventTypes } from '@maps-react/utils/e2e/support/acdl-page.po';

import data from '../fixtures/debt-advice-referral.json';
import { Login } from '../pages/login.po';

describe('Login', () => {
  const page = new Login();

  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/en');
    cy.url().should('include', '/login');
  });

  it('Validate text on login page', () => {
    page.elements.heading().should('have.text', 'Debt advice referral');
    page.elements.subHeading1().should('have.text', 'Money Adviser Network');

    page.elements
      .subHeading2()
      .first()
      .should('have.text', 'Help customers get debt advice');
    page.elements
      .info()
      .should(
        'have.text',
        'Use this service to refer customers for free personalised debt advice.To be eligible, the customer must:Have missed payments or struggling to make paymentsNot be currently receiving free debt adviceLive in EnglandNot be self-employed or a company directorIf you need access to refer customers, contact:moneyadvisernetwork@maps.org.ukBusiness debt?If the customer has business debt, direct them to Business Debtline.Tel: 0800 197 6026Monday to Friday: 9am - 8pmwww.businessdebtline.org (opens in a new tab)Referral Partner IDPlease enter your referral partner ID provided by MaPSContinueProblems accessing your account?Please contact moneyadvisernetwork@maps.org.uk',
      );

    page.elements
      .subHeading2()
      .eq(1)
      .should('have.text', 'Access your partner account');
    page.elements.referrerIdLabel().should('have.text', 'Referral Partner ID');
    page.elements
      .referrerIdInfo()
      .should(
        'have.text',
        'Please enter your referral partner ID provided by MaPS',
      );
    page.elements.referrerIdInput().should('be.visible');

    page.elements.signinButton().should('be.visible');

    page.elements
      .subHeading2()
      .last()
      .should('have.text', 'Problems accessing your account?');
    page.elements
      .problemInfo()
      .should('have.text', 'Please contact moneyadvisernetwork@maps.org.uk');

    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
  });

  it('Validate error messages', () => {
    page.elements.signinButton().should('be.visible').click();

    page.checkErrorMessages(['Referral Partner ID is required.']);

    page.checkErrorOnInput('referrerId', 'Referral Partner ID is required.');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.referrerIdInput().type('abc12negative');
    page.elements.signinButton().click();

    page.checkErrorMessages(['Referral ID is not recognised.']);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
  });
});
