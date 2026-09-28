import { adobeDatalayer } from '../fixtures/midlifeMOT-adobeDatalayer';

describe('MidLifeMOT-Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
    cy.visit('/');
  });

  it('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];

    const questionCount = 18;

    const baseQuery = [
      { q: 1, value: '1', score: '0' },
      { q: 2, value: '0', score: '0' },
      { q: 3, value: '6', score: '2' },
      { q: 4, value: '0', score: '3' },
      { q: 5, value: '0', score: '2' },
      { q: 6, value: '0', score: '2' },
      { q: 7, value: '4', score: '1' },
      { q: 8, value: '0', score: '3' },
      { q: 9, value: '4', score: '1' },
      { q: 10, value: '4', score: '3' },
      { q: 11, value: '0,1', score: '3' },
      { q: 12, value: '0,1', score: '3' },
      { q: 13, value: '0,1', score: '2' },
      { q: 14, value: '0,1', score: '2' },
      { q: 15, value: '0', score: '3' },
      { q: 16, value: '0', score: '3' },
      { q: 17, value: '0', score: '2' },
      { q: 18, value: '0', score: '2' },
    ];

    const buildQuery = (limit: number): string => {
      return baseQuery
        .slice(0, limit)
        .map(({ q, value, score }) => `q-${q}=${value}&score-q-${q}=${score}`)
        .join('&');
    };

    const generateUrls = (): string[] => {
      const urls = [];

      for (let i = 1; i <= questionCount; i++) {
        const query = i > 1 ? `?${buildQuery(i - 1)}` : '';
        urls.push(`question-${i}${query}`);
      }

      const finalQuery = buildQuery(questionCount);
      urls.push(`change-options?${finalQuery}`);
      urls.push(`summary?${finalQuery}`);
      urls.push(`results?${finalQuery}`);

      return urls;
    };

    locales.forEach((locale) => {
      generateUrls().forEach((url) => {
        const values = adobeDatalayer(locale)[url];
        cy.verifyDatalayer('pageLoadReact', locale, values);
      });
    });
  });

  it('DataLayer - toolStart', () => {
    const locales = ['en', 'cy'];
    const urls = ['question-1'];
    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries && dataLayerEntries[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
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
      'results?q-1=2&score-q-1=0&q-2=1&score-q-2=0&q-3=3&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=2&score-q-6=2&q-7=1&score-q-7=2&q-8=0&score-q-8=3&q-9=2%2C3&score-q-9=2&q-10=1&score-q-10=2&q-11=0&score-q-11=2&q-14=4&score-q-14=2&q-15=3&score-q-15=2&q-16=3&score-q-16=1&q-17=1&score-q-17=2&q-18=2&score-q-18=2',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const values = adobeDatalayer(locale)[urlTemplate];
        cy.verifyEventDoesNotExist('toolRestart');
        cy.verifyDatalayer('toolCompletion', locale, values);
      });
    });
  });

  it('DataLayer - toolRestart', () => {
    const locales = ['en', 'cy'];
    const urls = ['question-1?restart=true'];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries && dataLayerEntries[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
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
    const urls = ['question-1?error=q-1'];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const values = adobeDatalayer(locale)[urlTemplate];
        cy.verifyDatalayer('pageLoadReact', locale, values);
      });
    });
  });
});
