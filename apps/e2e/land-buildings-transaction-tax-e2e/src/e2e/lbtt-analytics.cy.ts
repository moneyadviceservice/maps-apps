import { adobeDatalayer } from '../fixtures/lbtt-adobeDatalayer';

import '@maps-react/utils/e2e/support/commands';

describe('LBTT - Analytics', () => {
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
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=250%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=350%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=9%2C999%2C937.789',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=nextHome&price=450%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=nextHome&price=937%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=550%2C000',
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C200%2C000',
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
    const urls = ['lbtt'];

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
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=250%2C000',
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
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=550%2C000',
    ];

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

  it('DataLayer - errorMessage', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstTimeBuyer&price=',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        if (values) {
          visitPage(expectedUrl);
          cy.verifyDatalayer('errorMessage', locale, values);
        }
      });
    });
  });

  it('DataLayer - toolInteraction', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'lbtt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=750%2C000',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        if (values) {
          visitPage(expectedUrl);
        }
      });
    });
  });
});
