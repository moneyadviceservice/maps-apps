import potData from '../fixtures/potEstimator.json';

export class PotEstimator {
  elements = {
    heading: () => cy.get('#main h1'),
    incomeLabel: () => cy.get('label[for=income]'),
    incomeText: () => cy.get('label[for=income] ~ p'),
    yearlyIncome: () => cy.get('#income'),
    potLabel: () => cy.get('label[for=pot]'),
    pot: () => cy.get('#pot'),
    calculate: () => cy.get('#submit'),
    callOut: () => cy.get('.mb-8 > p'),
    errorMessage: () => cy.get('.t-error-summary'),
    results: () => cy.get('#results'),
    resultsTitle: () => cy.get('#results h2'),
  };

  enterYearlyIncome(income: string) {
    this.elements.yearlyIncome().clear().type(income);
  }

  enterPotValue(pot: string) {
    this.elements.pot().clear().type(pot);
  }

  validateResults(potValue: string, takeHome: string, tax: string) {
    this.elements.results().within(() => {
      cy.get('dl dt')
        .first()
        .should(
          'have.text',
          potData.core.potLabel.replace('%POT_VALUE%', potValue),
        );
      cy.get('dl dd').first().should('have.text', takeHome);
      cy.get('dl dt').last().should('have.text', potData.core.estimateLabel);
      cy.get('dl dd')
        .last()
        .should(
          'have.text',
          potData.core.taxAmount.replace('%TAX_VALUE%', tax),
        );
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

  validateErrorMessage(fieldType: 'pot' | 'income') {
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
}
