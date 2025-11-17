describe('Look up form and results pages', () => {
  const path = '/en/pension-wise-appointment';

  beforeEach(() => {
    cy.setCookieControl();
  });

  it('should display the textinput to input the urn number', () => {
    cy.visit(`${path}/find-appointment`);
    cy.get("input[name='urn']").should('have.length', 1);
  });

  it('should navigate to results when urn number is well formatted', () => {
    cy.visit(`${path}/find-appointment`);
    cy.get("input[name='urn']").type('RET9-6IOT');
    cy.intercept({ pathname: '/api/find-appointment' }, (req) => {
      req.reply({ statusCode: 200 });
    }).as('lookup');

    cy.get('button[data-testid="find-urn"]').click({ force: true });
    cy.wait('@lookup').then(() => {
      cy.visit(`${path}/client-summary`);
    });
    cy.title().should('contain', 'Client summary - Pension Wise');
  });

  it('should return error message when format is incorrect', () => {
    cy.visit(`${path}/find-appointment`);
    cy.get("input[name='urn']").type('WRONGURN');
    cy.intercept({ pathname: '/api/find-appointment' }).as('lookup');
    cy.get('button[data-testid="find-urn"]').click({ force: true });

    cy.wait(`@lookup`).then((res) => {
      cy.wrap(res.response.statusCode).should('equal', 302);
      cy.get('[data-testid="urn-error"]').should('have.length', 1);
      cy.url().should('contain', 'error=format');
    });
  });

  it('should return error message when database connection fail', () => {
    cy.visit(`${path}/find-appointment`);
    cy.get("input[name='urn']").type('PET9-6IOT');
    cy.intercept({ pathname: '/api/find-appointment' }).as('lookup');
    cy.get('button[data-testid="find-urn"]').click({ force: true });

    cy.wait(`@lookup`).then(() => {
      cy.get('[data-testid="urn-error"]').should('have.length', 1);
      cy.url().should('contain', 'error=access');
    });
  });
});
