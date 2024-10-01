import potData from '../fixtures/potUntouched.json';

export class PotUntouched {
  elements = {
    heading: () => cy.get('#main h1'),
    potText: () => cy.get('label[for=pot]'),
    pot: () => cy.get('#pot'),
    monthText: () => cy.get('label[for=month]'),
    month: () => cy.get('#month'),
    updateMonthText: () => cy.get('label[for=updateMonth]'),
    updateMonth: () => cy.get('#updateMonth'),
    calculate: () => cy.get('#submit'),
    callOut: () => cy.get('.mb-8 > p'),
    errorMessage: () => cy.get('.t-error-summary'),
    errorMessage1: () => cy.get('.mb-4 > .text-red-700'),
    results: () => cy.get('#results'),
    resultsTitle: () => cy.get('#results h2'),
  };

  enterPotValue(pot: string) {
    this.elements.pot().clear().type(pot);
  }

  enterMonthlyContribution(pay: string) {
    this.elements.month().clear().type(pay);
  }

  updateMonthlyContribution(pay: string) {
    this.elements.updateMonth().type(`{selectAll}${pay}`);
  }

  validateResults(yearly: string[], monthlyContribution: string) {
    this.elements.results().within(() => {
      cy.get('thead tr th')
        .first()
        .should('have.text', potData.core.resultsHeader1);
      cy.get('thead tr th')
        .last()
        .should('have.text', potData.core.resultsHeader2);
      yearly.forEach((yearlyAmount, index) => {
        cy.get('tbody tr')
          .eq(index)
          .within(() => {
            cy.get('td')
              .first()
              .should('have.text', index + 1);
            cy.get('td').last().should('have.text', yearlyAmount);
          });
      });

      this.elements
        .updateMonthText()
        .should('have.text', potData.core.updateMonthLabel);
      this.elements.updateMonth().should('have.value', monthlyContribution);

      cy.get('.list-disc li')
        .eq(0)
        .should('have.text', potData.core.resultInfo1);
      cy.get('.list-disc li')
        .eq(1)
        .should('have.text', potData.core.resultInfo2);
      cy.get('.list-disc li')
        .eq(2)
        .should('have.text', potData.core.resultInfo3);
    });
  }

  validateErrorMessages() {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('h5').should('contain.text', potData.core.unableSubmitLabel);
      cy.get('ul li')
        .first()
        .should('contain.text', potData.core.incomeErrorLabel);
      cy.get('ul li').last().should('contain.text', potData.core.potErrorLabel);
    });
  }

  validateErrorMessage(fieldType: 'pot') {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('h5').should('contain.text', potData.core.unableSubmitLabel);
      cy.get('ul li')
        .first()
        .should('contain.text', potData.core[`${fieldType}ErrorLabel`]);
    });
    cy.get(`label[for=${fieldType}] ~ .text-red-700`).should(
      'have.text',
      potData.core.fieldLevelErrorLabel,
    );
  }

  validateErrorMessageForZeroValue() {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('h5').should('contain.text', potData.core.unableSubmitLabel);
      cy.get('ul li')
        .first()
        .should('contain.text', potData.core.incomeErrorLabelForZero);
    });
    cy.get(`label[for=pot] ~ .text-red-700`).should(
      'have.text',
      potData.core.fieldLevelErrorLabel1,
    );
  }
}
