import { adobeDatalayer } from '../fixtures/savingsCalc-adobeDatalayer';

import '@maps-react/utils/e2e/support/commands';

describe('SavingsCalculator-Analytics', () => {
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
      'how-long?isEmbed=false&savingGoal=5%2C000&amount=300&amountDuration=12&saved=10%2C001&interest=5.5#results',
      'how-long?isEmbed=false&savingGoal=25%2C000&amount=2%2C000&amountDuration=12&saved=1%2C000&interest=6.25#results',
      'how-much?isEmbed=false&savingGoal=10%2C000&durationMonth=7&durationYear=2025&saved=&interest=5.5#results',
      'how-much?isEmbed=false&savingGoal=25%2C000&durationMonth=7&durationYear=2025&saved=&interest=6.25#results',
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
    const urls = ['how-long', 'how-much'];

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
      'how-long?isEmbed=false&savingGoal=5%2C000&amount=400&amountDuration=12&saved=10%2C001&interest=4.5#results',
      'how-much?isEmbed=false&savingGoal=5%2C000&amount=400&amountDuration=12&saved=10%2C001&interest=4.5#results',
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
      'how-long?isEmbed=false&savingGoal=5%2C000&amount=&amountDuration=12&saved=10%2C001&interest=7.5#results',
      'how-much?isEmbed=false&savingGoal=&durationMonth=6&durationYear=2025&saved=2%2C600&interest=5.5#results',
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
