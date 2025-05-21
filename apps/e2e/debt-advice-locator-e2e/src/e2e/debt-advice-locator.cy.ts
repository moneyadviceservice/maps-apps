import { ACDLEventTypes } from '@maps-react/utils/e2e/support/acdl-page.po';

import data from '../fixtures/debt-advice-locator.json';
import { DebtAdviceLocator } from '../pages/debt-advice-locator.po';

describe('Debt Advice Locator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.visit('/en/question-1');
    page.resetACDLRetries();
  });

  const page = new DebtAdviceLocator();

  it('Debt advice - England', () => {
    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.livingCountry.title);
    page.elements.heading().should('have.text', data.livingCountry.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_START],
      data.acdlEntries,
    );

    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.selectCountry]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements
      .hintLabel()
      .should('be.visible')
      .should('have.text', data.livingCountry.expandableSection)
      .click();
    page.elements
      .content()
      .should('be.visible')
      .should('have.text', data.livingCountry.ExpandableSectionText);

    page.elements.england().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.selfEmployedDetails.title);
    page.elements
      .heading()
      .should('contain.text', data.selfEmployedDetails.heading);
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.selfEmployed]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements.customerSelfEmployedYes().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.england.selfEmployed.title);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );
    page.validateResults(data.results.england.selfEmployed);

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.customerSelfEmployedNo().should('be.visible').click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.employeeDetails.title);
    page.elements.heading().should('have.text', data.employeeDetails.heading);
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.checkEmployeeOptions();

    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.employeeAdvice]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.online().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.england.employed.title);
    page.validateResults(data.results.england.employed.online);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.telephone().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.england.employed.title);
    page.validateResults(data.results.england.employed.telephone);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.face2Face().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.face2FaceLocation.title);
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.location]);
    page.checkErrorMessageOnElement(
      '[data-testid="errorMessage-4"]',
      data.errorMessages.location,
    );
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.location().type('Vijgunt');
    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickChangeLocation();
    page.waitOnBackJourney();
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickGoBackToOptions();
    page.waitOnBackJourney();
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements.location().clear().type('Oxford');
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.england.employed.title);
    page.validateF2FResults(data.results.england.employed.faceToFace);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );
  });

  it('Debt advice - Scotland', () => {
    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.livingCountry.title);
    page.elements.heading().should('have.text', data.livingCountry.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_START],
      data.acdlEntries,
    );
    page.elements.scotland().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.selfEmployedDetails.title);
    page.elements
      .heading()
      .should('contain.text', data.selfEmployedDetails.heading);

    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.customerSelfEmployedYes().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.scotland.selfEmployed.title);
    page.validateResults(data.results.scotland.selfEmployed);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.customerSelfEmployedNo().should('be.visible').click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.employeeDetails.title);
    page.elements.heading().should('have.text', data.employeeDetails.heading);
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.employeeAdvice]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements.online().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.scotland.employed.title);
    page.validateResults(data.results.scotland.employed.online);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.telephone().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.scotland.employed.title);
    page.validateResults(data.results.scotland.employed.telephone);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.face2Face().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.face2FaceLocation.title);
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.location]);
    page.checkErrorMessageOnElement(
      '[data-testid="errorMessage-4"]',
      data.errorMessages.location,
    );
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.location().type('Vijgunt');
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickChangeLocation();
    page.waitOnBackJourney();
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );
    page.validateNoResults();

    page.clickGoBackToOptions();
    page.waitOnBackJourney();
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
  });

  it('Debt advice - Wales', () => {
    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.livingCountry.title);
    page.elements.heading().should('have.text', data.livingCountry.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_START],
      data.acdlEntries,
    );
    page.elements.wales().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.selfEmployedDetails.title);
    page.elements
      .heading()
      .should('contain.text', data.selfEmployedDetails.heading);
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.customerSelfEmployedYes().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.wales.selfEmployed.title);
    page.validateResults(data.results.wales.selfEmployed);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.customerSelfEmployedNo().should('be.visible').click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.employeeDetails.title);
    page.elements.heading().should('have.text', data.employeeDetails.heading);
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.employeeAdvice]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements.online().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.wales.employed.title);
    page.validateResults(data.results.wales.employed.online);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.telephone().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.wales.employed.title);
    page.validateResults(data.results.wales.employed.telephone);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.face2Face().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.face2FaceLocation.title);
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.location]);
    page.checkErrorMessageOnElement(
      '[data-testid="errorMessage-4"]',
      data.errorMessages.location,
    );
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.location().type('Vijgunt');
    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickChangeLocation();
    page.waitOnBackJourney();
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickGoBackToOptions();
    page.waitOnBackJourney();
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
  });

  it('Debt advice - Northern Ireland', () => {
    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.livingCountry.title);
    page.elements.heading().should('have.text', data.livingCountry.heading);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_START],
      data.acdlEntries,
    );
    page.elements.northernIreland().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.selfEmployedDetails.title);
    page.elements
      .heading()
      .should('contain.text', data.selfEmployedDetails.heading);
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.selfEmployed]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements.customerSelfEmployedYes().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.northernIreland.selfEmployed.title);
    page.validateResults(data.results.northernIreland.selfEmployed);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.customerSelfEmployedNo().should('be.visible').click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.employeeDetails.title);
    page.elements.heading().should('have.text', data.employeeDetails.heading);
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });

    page.checkErrorMessages([data.errorMessages.employeeAdvice]);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );
    page.elements.online().click();
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.northernIreland.employed.title);
    page.validateResults(data.results.northernIreland.employed.online);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.telephone().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.results.northernIreland.employed.title);
    page.validateResults(data.results.northernIreland.employed.telephone);
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.elements.back().click();
    page.waitOnBackJourney();
    page.elements.face2Face().click();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });

    page.elements
      .title()
      .should('be.visible')
      .should('have.text', data.face2FaceLocation.title);
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
    page.elements.continue().click({ force: true });
    page.checkErrorMessages([data.errorMessages.location]);
    page.checkErrorMessageOnElement(
      '[data-testid="errorMessage-4"]',
      data.errorMessages.location,
    );
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.ERROR_MESSAGE],
      data.acdlEntries,
    );

    page.elements.location().type('Vijgunt');
    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickChangeLocation();
    page.waitOnBackJourney();
    page.checkLocationField();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);

    page.elements.continue().click({ force: true });
    page.validateNoResults();
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION],
      data.acdlEntries,
    );

    page.clickGoBackToOptions();
    page.waitOnBackJourney();
    page.checkEmployeeOptions();
    page.validateAdobeDataLayer([ACDLEventTypes.PAGE_LOAD], data.acdlEntries);
  });
});
