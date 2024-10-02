import adobeDatalayer from '../fixtures/adobeDatalayer.json';

describe('Adobe Analytics Tracking', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/', { failOnStatusCode: false });
  });

  const verifyDatalayer = (eventName: string, locale: string, values: any) => {
    cy.window().then((win: any) => {
      const event = win.adobeDataLayer.filter(
        (x: { event }) => x.event === eventName,
      );
      expect(event.length).to.greaterThan(0);
      const expectedEvent = event[event.length - 1];

      expect(expectedEvent.page.lang).to.eql(locale);
      expect(expectedEvent.page.pageName).to.eql(values.page['pageName']);
      expect(expectedEvent.page.pageTitle).to.eql(values.page['pageTitle']);
      expect(expectedEvent.page.pageType).to.eql(values.page['pageType']);
      expect(expectedEvent.page.site).to.eql(values.page['site']);

      expect(expectedEvent.tool.stepName).to.eql(values.tool['stepName']);
      expect(expectedEvent.tool.toolCategory).to.eql(
        values.tool['toolCategory'],
      );
      expect(expectedEvent.tool.toolName).to.eql(values.tool['toolName']);
      expect(expectedEvent.tool.toolStep).to.eql(values.tool['toolStep']);
    });
  };

  it('DataLayer - pageLoadReact', () => {
    for (const [url, values] of Object.entries(adobeDatalayer)) {
      const locale = values.page.lang;
      const visitUrl = `/${locale}/pension-wise-appointment${url}`;
      cy.intercept(visitUrl).as(`${url}alias`);
      cy.visit(visitUrl);
      cy.wait(`@${url}alias`).its('response.statusCode').should('eq', 200);
      cy.url().should('include', url);

      // Wait for the ACDL to fire by performing below operations
      if (url.includes('/summary')) {
        cy.get('[data-testid="hero-title"]').should('be.visible');
      } else {
        cy.get('[data-testid="page-title"]').should('be.visible');
      }
      cy.get('body').should('be.visible').click();
      cy.scrollTo('bottom');

      verifyDatalayer('pageLoad', locale, values);
    }
  });
});
