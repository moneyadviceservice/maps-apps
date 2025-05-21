import { adobeDatalayer } from '../fixtures/creditRejection-adobeDatalayer';

import '@maps-react/utils/e2e/support/commands';
describe('CreditRejection-Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
  });

  const visitPage = (url: string) => {
    cy.visit(url);
  };

  it('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'credit-rejection/question-1',
      'credit-rejection/question-2?q-1=1&score-q-1=0',
      'credit-rejection/question-3?q-1=1&q-2=1',
      'credit-rejection/question-4?q-1=1&q-2=1&q-3=1',
      'credit-rejection/question-5?q-1=1&q-2=1&q-3=1&q-4=1',
      'credit-rejection/question-6?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1',
      'credit-rejection/question-7?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0',
      'credit-rejection/question-8?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0',
      'credit-rejection/change-options?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1',
      'credit-rejection/results?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1',
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
    const urls = ['credit-rejection/question-1'];
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
      'credit-rejection/results?q-1=1&score-q-1=0&q-2=1&score-q-2=0&q-3=2&score-q-3=0&q-4=1&score-q-4=0&q-5=0&score-q-5=1&q-6=0&score-q-6=0&q-7=0&score-q-7=0&q-8=0&score-q-8=0',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyEventDoesNotExist('toolRestart');
        cy.verifyDatalayer('toolCompletion', locale, values);
      });
    });
  });

  it('DataLayer - toolRestart', () => {
    const locales = ['en', 'cy'];
    const urls = ['credit-rejection/question-1?restart=true'];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries && dataLayerEntries[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
          visitPage(expectedUrl);
          cy.verifyEventDoesNotExist('toolCompletion');
          cy.verifyDatalayer('toolRestart', locale, values);
        } else {
          console.warn(
            `URL template "${urlTemplate}" not found in adobeDatalayer for locale "${locale}"`,
          );
        }
      });
    });
  });

  // Error Message
  it('DataLayer - errorMessage', () => {
    const locales = ['en', 'cy'];
    const urls = ['credit-rejection/question-3?q-1=1&q-2=1&error=q-3'];

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
});
