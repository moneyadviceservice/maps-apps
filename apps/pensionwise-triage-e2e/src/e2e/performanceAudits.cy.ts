import { forEach } from 'cypress/types/lodash';

describe('Lighthouse', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/', { failOnStatusCode: false });
  });

  it('should run performance audits on pension journeys', () => {
    const urls = [
      '/en/pension-wise-triage/lifetime-annuity?q1=2&q2=1&q3=2&q4=1',
      '/cy/pension-wise-triage/age/under-50?q1=1',
    ];
    urls.forEach((url) => {
      cy.visit(url);

      cy.lighthouse(
        {
          performance: 25,
          accessibility: 90,
          'best-practices': 80,
          seo: 60,
        },
        {
          formFactor: 'mobile',
          screenEmulation: {
            desktop: false,
            disable: false,
            width: Cypress.config('viewportWidth'),
            height: Cypress.config('viewportHeight'),
            deviceScaleRatio: 1,
          },
        },
      );
    });
  });
});
