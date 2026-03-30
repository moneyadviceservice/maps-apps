import printData from '../fixtures/printData.json';
describe('Test print page', () => {
  for (const lang of ['en', 'cy']) {
    for (const {
      title,
      params,
      urn,
      interestListOptions,
      toDoCards,
    } of printData.pageData) {
      it(`should display ${title} in ${
        lang === 'en' ? 'English' : 'Welsh'
      }`, () => {
        cy.setCookieControl();
        const page = `/${lang}/pension-wise-appointment/print-summary?${params}`;
        cy.intercept(page).as('printSummary');
        cy.visit(page);

        cy.wait('@printSummary').then(() => {
          cy.get('[data-testid="urn"]').should('have.text', urn);

          if (interestListOptions !== 0) {
            cy.get('[data-testid="interest-list-section"]')
              .its('length')
              .should('eql', interestListOptions);
          }
          cy.get('ul[data-testid="todo-cards-section"]')
            .children('li')
            .its('length')
            .should('eql', toDoCards);
        });
      });
    }
  }
});
