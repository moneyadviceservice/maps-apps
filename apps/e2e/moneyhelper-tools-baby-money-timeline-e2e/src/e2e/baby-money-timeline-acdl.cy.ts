import { getFutureDate } from '@maps-react/utils/e2e/support/commands';

import { adobeDatalayer } from '../fixtures/baby-money-timeline-adobeDatalayer';

const { day, month, year } = getFutureDate();

describe('Baby Money Timeline-Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
  });

  const visitPage = (url: string, options?: Partial<Cypress.VisitOptions>) => {
    cy.visit(url, options);
  };

  it('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'baby-money-timeline',
      `baby-money-timeline/1?day=${day}&month=${month}&year=${year}`,
      `baby-money-timeline/2?day=${day}&month=${month}&year=${year}`,
      `baby-money-timeline/3?day=${day}&month=${month}&year=${year}`,
      `baby-money-timeline/4?day=${day}&month=${month}&year=${year}`,
      `baby-money-timeline/5?day=${day}&month=${month}&year=${year}`,
      `baby-money-timeline/6?day=${day}&month=${month}&year=${year}`,
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyDatalayer('pageLoadReact', locale, values);
      });
    });
  });

  it('DataLayer - toolStart', () => {
    const locales = ['en', 'cy'];
    const urls = [
      `baby-money-timeline/2?day=${day}&month=${month}&year=${year}`,
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries && dataLayerEntries[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
          visitPage(expectedUrl);
          cy.verifyDatalayer('toolStart', locale, values);
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
      `baby-money-timeline/6?day=${day}&month=${month}&year=${year}`,
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyDatalayer('toolCompletion', locale, values);
      });
    });
  });
});
