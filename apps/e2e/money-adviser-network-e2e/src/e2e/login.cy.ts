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
        'Use this service to refer customers for free personalised debt advice.To be eligible, the customer must:Have missed payments or struggling to make paymentsNot be currently receiving free debt adviceLive in EnglandNot be self-employed or a company directorIf you need access to refer customers, contact:moneyadvisernetwork@maps.org.ukBusiness debt?If the customer has business debt, direct them to Business Debtline.Tel: 0800 197 6026Monday to Friday: 9am - 8pmwww.businessdebtline.org (opens in a new tab)UsernamePlease enter username provided by MaPSPasswordSHOWSign inProblem signing in?Please contact moneyadvisernetwork@maps.org.uk',
      );

    page.elements
      .subHeading2()
      .eq(1)
      .should('have.text', 'Sign in to your partner account');
    page.elements.usernameLabel().should('have.text', 'Username');
    page.elements
      .usernameInfo()
      .should('have.text', 'Please enter username provided by MaPS');
    page.elements.usernameInput().should('be.visible');

    page.elements.passwordLabel().should('have.text', 'Password');
    page.elements.passwordInput().should('be.visible');
    page.elements.signinButton().should('be.visible');

    page.elements
      .subHeading2()
      .last()
      .should('have.text', 'Problem signing in?');
    page.elements
      .problemInfo()
      .should('have.text', 'Please contact moneyadvisernetwork@maps.org.uk');

    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
  });

  it('Validate error messages', () => {
    page.elements.errorSummaryContainer().should('be.empty');
    page.elements.signinButton().should('be.visible').click();

    page.checkErrorMessages(['Username is required.', 'Password is required.']);

    page.checkErrorOnInput('username', 'Username is required.');
    page.checkErrorOnInput('password', 'Password is required.');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.usernameInput().type('abc12negative');
    page.elements.passwordInput().type('test123');
    page.elements.signinButton().click();

    page.checkErrorMessages(['Invalid username or password.']);
    page.checkErrorOnInput('password', 'Invalid username or password.');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements
      .usernameInput()
      .clear()
      .type('testing@morhys432.onmicrosoft.com');
    page.elements.passwordInput().type('abc12');
    page.elements.signinButton().click();

    page.checkErrorMessages(['Invalid username or password.']);
    page.checkErrorOnInput('password', 'Invalid username or password.');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
  });
});
