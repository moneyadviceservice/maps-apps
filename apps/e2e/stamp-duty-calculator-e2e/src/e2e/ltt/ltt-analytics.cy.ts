import { adobeDatalayer } from '../../fixtures/ltt-adobeDatalayer';

import '@maps-react/utils/e2e/support/commands';

describe('Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
  });

  const visitPage = (url: string) => {
    cy.visit(url);
  };

  it.skip('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'ltt?calculated=true&buyerType=firstOrNextHome&price=350%2C000',
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstOrNextHome&price=9%2C999%2C567.89',
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=9%2C999%2C567.89',
      'ltt?isEmbedded=false&calculated=true&recalculated=false&buyerType=additionalHome&price=1%2C290%2C000.45',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyDatalayer('pageLoadReact', locale, values);
      }
    }
  });

  it.skip('DataLayer - toolStart', () => {
    const locales = ['en', 'cy'];
    const urls = ['ltt'];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries?.[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
          visitPage(expectedUrl);
          cy.verifyDatalayer('toolStart', locale, values);
        } else {
          console.warn(
            `URL template "${urlTemplate}" not found in adobeDatalayer for locale "${locale}"`,
          );
        }
      }
    }
  });

  it.skip('DataLayer - toolCompletion', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'ltt?isEmbedded=false&calculated=true&recalculated=false&buyerType=firstOrNextHome&price=350%2C000',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyEventDoesNotExist('toolRestart');
        cy.verifyDatalayer('toolCompletion', locale, values);
      }
    }
  });

  it.skip('DataLayer - toolRestart', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=450%2C000',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const dataLayerEntries = adobeDatalayer(locale);

        if (dataLayerEntries?.[urlTemplate]) {
          const values = dataLayerEntries[urlTemplate];
          visitPage(expectedUrl);
          cy.verifyEventDoesNotExist('toolCompletion');
          cy.verifyDatalayer('toolRestart', locale, values);
        } else {
          console.warn(
            `URL template "${urlTemplate}" not found in adobeDatalayer for locale "${locale}"`,
          );
        }
      }
    }
  });

  it.skip('DataLayer - errorMessage', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=additionalHome&price=',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        if (values) {
          visitPage(expectedUrl);
          cy.verifyDatalayer('errorMessage', locale, values);
        }
      }
    }
  });

  it.skip('DataLayer - toolInteraction', () => {
    const locales = ['en', 'cy'];
    const urls = [
      'ltt?isEmbedded=false&calculated=true&recalculated=true&buyerType=firstTimeBuyer&price=750%2C000',
    ];

    for (const locale of locales) {
      for (const urlTemplate of urls) {
        const url = urlTemplate.replace('[locale]', locale);
        const expectedUrl = `/${locale}/${url}`;
        const values = adobeDatalayer(locale)[urlTemplate];

        if (values) {
          visitPage(expectedUrl);
        }
      }
    }
  });
});
