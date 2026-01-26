import { adobeDatalayer } from '../fixtures/mortgageAffordabilityCalc-adobeDatalayer';

import '@maps-react/utils/e2e/support/commands';

describe('MortgageAffordabilityCalculator-Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.skipExceptions();
  });

  const visitPage = (
    url: string,
    options: Partial<Cypress.VisitOptions> = {},
  ) => {
    cy.visit(url, options);
  };

  it('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'results?q-annual-income=35000&q-take-home=2400.00&q-second-applicant=no&q-card-and-loan=25&q-child-spousal=12&q-care-school=22&q-travel=15&q-bills-insurance=35&q-rent-mortgage=650&q-leisure=28&q-holidays=25&q-groceries=41',
      'results?q-annual-income=35000&q-take-home=2400.00&q-other-income=1200&q-second-applicant=yes&q-sec-app-annual-income=14000&q-sec-app-take-home=1000&q-sec-app-other-income=600&q-card-and-loan=45.00&q-child-spousal=12.00&q-care-school=22.00&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=650.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        verifyDatalayer('pageLoadReact', locale, values);
      });
    });
  });

  it('DataLayer - toolStart', () => {
    const locales = ['en', 'cy'];
    const urls = ['annual-income'];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries && dataLayerEntries[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
          visitPage(expectedUrl);
          verifyDatalayer('toolStart', locale, values);
        } else {
          console.warn(
            `URL template "${urlTemplate}" not found in adobeDatalayer for locale "${locale}"`,
          );
        }
      });
    });
  });

  it('DataLayer - toolCompletion', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'results?q-annual-income=35000&q-take-home=2400.00&q-second-applicant=no&q-card-and-loan=25.00&q-child-spousal=22&q-care-school=11&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=600.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00',
      'results?q-annual-income=36000.00&q-take-home=2300.00&q-other-income=1100.00&q-second-applicant=yes&q-sec-app-annual-income=14000.00&q-sec-app-take-home=1000.00&q-sec-app-other-income=600.00&q-card-and-loan=45.00&q-child-spousal=12.00&q-care-school=22.00&q-travel=15.00&q-bills-insurance=35.00&q-rent-mortgage=650.00&q-leisure=28.00&q-holidays=25.00&q-groceries=41.00',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl, { failOnStatusCode: false });
        verifyDatalayer('toolCompletion', locale, values);
      });
    });
  });

  const verifyDatalayer = (eventName, locale, values) => {
    cy.window().then((win) => {
      if (win.adobeDataLayer) {
        const event = win.adobeDataLayer.filter((x) => x.event === eventName);
        if (event.length > 0) {
          const expectedEvent = event[0];
          // Check event properties based on eventName
          if (eventName === 'toolCompletion') {
            expect(expectedEvent).to.have.property('page');
            expect(expectedEvent.page).to.have.property('lang');
            expect(expectedEvent.page.lang).to.eql(locale);
          }
        }
      }
    });
  };

  const verifyEventDoesNotExist = (eventName) => {
    cy.window().then((win) => {
      if (win.adobeDataLayer) {
        const event = win.adobeDataLayer.filter((x) => x.event === eventName);
        expect(event).to.have.lengthOf(0);
      }
    });
  };

  it('DataLayer - errorMessage', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'annual-income?q-take-home=2%2C400.00&q-second-applicant=no&errors=%257B%2522annual-income%2522%253A%2522required%2522%257D#error-summary-heading',
      'annual-income?q-second-applicant=no&q-annual-income=35%2C000&errors=%257B%2522take-home%2522%253A%2522required%2522%257D#error-summary-heading',
      'annual-income?q-second-applicant=yes&q-annual-income=35%2C000.00&q-take-home=2%2C400.00&q-sec-app-take-home=1%2C000&errors=%257B%2522sec-app-annual-income%2522%253A%2522required%2522%257D#error-summary-heading',
      'annual-income?q-second-applicant=yes&q-annual-income=35%2C000.00&q-take-home=2%2C400.00&q-sec-app-annual-income=14%2C000&errors=%257B%2522sec-app-take-home%2522%253A%2522required%2522%257D#error-summary-heading',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        if (values) {
          visitPage(expectedUrl);
          verifyDatalayer('errorMessage', locale, values);
        }
      });
    });
  });
});
