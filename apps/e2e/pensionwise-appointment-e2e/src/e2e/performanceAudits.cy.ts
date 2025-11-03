describe('Lighthouse', () => {
  it('should run performance audits on summary page', () => {
    const url =
      '?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2';
    cy.setCookieControl();
    cy.visit(url);
    cy.get('[data-testid="page-title"]').should('be.visible');

    cy.lighthouse(
      {
        performance: 25,
        accessibility: 90,
        'best-practices': 74,
        seo: 60,
      },
      {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          disable: false,
          width: Cypress.config('viewportWidth'),
          height: Cypress.config('viewportHeight'),
          deviceScaleRatio: 1,
        },
      },
    );
  });
});
