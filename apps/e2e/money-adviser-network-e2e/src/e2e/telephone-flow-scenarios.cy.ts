import { ACDLEventTypes } from '@maps-react/utils/e2e/support/acdl-page.po';

import data from '../fixtures/debt-advice-referral.json';
import {
  limitedSlotAvailability,
  noSlotAvailability,
  noSlots,
  slots,
} from '../mocks/responseData';
import { DebtAdviceReferral } from '../pages/debt-advice-referral.po';

const page = new DebtAdviceReferral();

const completeStartFlowSteps = () => {
  page.elements.debtAdviceRadio().click({ force: true });
  page.elements.continue().click({ force: true });

  page.elements.englandYes().click({ force: true });
  page.elements.continue().click({ force: true });

  page.elements.customerSelfEmployedNo().click({ force: true });

  page.elements.continue().click({ force: true });
};

const isInOfficeHours = () => {
  const now = new Date();

  const day = now.getDay();
  if (day === 0 || day === 6) {
    return false;
  }

  const start = new Date(now);
  start.setHours(9, 0, 0, 0);

  const end = new Date(now);
  end.setHours(15, 30, 0, 0);

  return now >= start && now <= end;
};

describe('Debt Advice Referral', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/en');
    cy.login();
    cy.url().should('include', '/start/q-1');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.task('resetApiMocks');
  });

  it('Schedule a call for later: Happy path ending with call scheduled success screen.', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    page.elements.scheduleForLater().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    page.elements.selectFirstSlot().click({ force: true });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    cy.get('#firstName').type('firstname');
    cy.get('#lastName').type('lastname');
    cy.get('#telephone').type('07722113355');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    cy.get('#postcode').type('dd21qq');
    cy.get('#securityQuestion').select('city');
    cy.get('#securityAnswer').type('London');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.continue().click({ force: true });

    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: noSlotAvailability,
    });
    cy.task('mockApiPostResponse', {
      endpoint: 'BookAppointment',
    });
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD],
      data.acdlEntries,
      true,
    );
    page.elements.submitForm().click({ force: true });

    cy.url().should('include', '/telephone/call-scheduled');
    page.validateAdobeDataLayer(
      [ACDLEventTypes.PAGE_LOAD, ACDLEventTypes.TOOL_COMPLETION_NO_INPUT],
      data.acdlEntries,
      true,
    );
  });

  it('Telephone option enabled/disabled when no slots available, based on being in/out of office hours', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: noSlots,
    });

    completeStartFlowSteps();

    if (isInOfficeHours()) {
      page.elements.telephone().should('be.enabled');
    } else {
      page.elements.telephone().should('be.disabled');
    }
  });

  it('Get an immediate call back option enabled/disabled, based on in/out of office hours and test flag', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    if (isInOfficeHours()) {
      page.elements.immediateCallback().should('be.enabled');
    } else {
      page.elements.immediateCallback().should('be.disabled');

      // check testing override query param works
      cy.visit('/en/telephone/t-4?q-1=1&q-2=0&q-3=1&q-4=1&test=immediate');
      page.elements.immediateCallback().should('be.enabled');
    }
  });

  it('Schedule a call for later option disabled when no slots available', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: noSlots,
    });
    page.elements.continue().click({ force: true });

    page.elements.scheduleForLater().should('be.disabled');
  });

  it('Get an immediate call: Trying to submit at 3:30pm and should take to schedule a call for later options', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    if (isInOfficeHours()) {
      page.elements.immediateCallback().should('be.enabled');
      page.elements.immediateCallback().click({ force: true });
      page.elements.continue().click({ force: true });

      cy.get('#firstName').type('firstname');
      cy.get('#lastName').type('lastname');
      cy.get('#telephone').type('07722113355');
      page.elements.continue().click({ force: true });

      cy.get('#postcode').type('dd21qq');
      cy.get('#securityQuestion').select('city');
      cy.get('#securityAnswer').type('London');
      page.elements.continue().click({ force: true });

      cy.task('mockApiPostErrorResponse', {
        endpoint: 'BookAppointment',
        responseError: 'Out of office hours',
      });
      page.elements.submitForm().click({ force: true });

      cy.url().should('include', '/telephone/t-9');
    } else {
      page.elements.immediateCallback().should('be.disabled');
    }
  });

  it('Schedule a call for later: Last available slot gets taken before form is submitted: User gets taken to call could not be scheduled page', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    page.elements.scheduleForLater().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.selectFirstSlot().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#firstName').type('firstname');
    cy.get('#lastName').type('lastname');
    cy.get('#telephone').type('07722113355');
    page.elements.continue().click({ force: true });

    cy.get('#postcode').type('dd21qq');
    cy.get('#securityQuestion').select('city');
    cy.get('#securityAnswer').type('London');
    page.elements.continue().click({ force: true });

    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: noSlotAvailability,
    });
    cy.task('mockApiPostErrorResponse', {
      endpoint: 'BookAppointment',
      responseError:
        'There are no telephone slots available. Please try again tomorrow. Alternatively, you can select the online advice tool.',
    });
    page.elements.submitForm().click({ force: true });

    cy.url().should('include', '/telephone/call-could-not-be-scheduled');
  });

  it('Schedule a call for later: Selected slot gets taken: User gets taken to call could not be scheduled page to select other available slots', () => {
    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: slots,
    });

    completeStartFlowSteps();

    page.elements.telephone().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentDetails().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.consentReferral().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#customerReference').type('test reference');
    cy.get('#departmentName').type('test department name');
    page.elements.continue().click({ force: true });

    page.elements.scheduleForLater().click({ force: true });
    page.elements.continue().click({ force: true });

    page.elements.selectFirstSlot().click({ force: true });
    page.elements.continue().click({ force: true });

    cy.get('#firstName').type('firstname');
    cy.get('#lastName').type('lastname');
    cy.get('#telephone').type('07722113355');
    page.elements.continue().click({ force: true });

    cy.get('#postcode').type('dd21qq');
    cy.get('#securityQuestion').select('city');
    cy.get('#securityAnswer').type('London');
    page.elements.continue().click({ force: true });

    cy.task('mockApiGetResponse', {
      endpoint: 'GetBookingSlots',
      responseData: limitedSlotAvailability,
    });
    cy.task('mockApiPostErrorResponse', {
      endpoint: 'BookAppointment',
      responseError: 'Error - Booking slot capacity is full.',
    });
    page.elements.submitForm().click({ force: true });

    cy.url().should('include', '/telephone/t-8');
  });
});
