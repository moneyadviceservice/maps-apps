import incomeData from '../fixtures/guaranteedIncome.json';

export class IncomeEstimator {
  elements = {
    heading: () => cy.get('#main h1'),
    potLabel: () => cy.get('label[for=pot]'),
    potIncome: () => cy.get('#pot'),
    ageLabel: () => cy.get('label[for=age]'),
    ageText: () => cy.get('label[for=age] ~ p'),
    age: () => cy.get('#age'),
    calculate: () => cy.get('#submit'),
    callOut: () => cy.get('.mb-8 > p'),
    errorMessage: () => cy.get('.t-error-summary'),
    results: () => cy.get('#results'),
    resultsTitle: () => cy.get('#results h2'),
  };

  enterPotIncome(pot: string) {
    this.elements.potIncome().clear().type(pot);
  }

  enterAgeValue(age: string) {
    this.elements.age().clear().type(age);
  }

  validateResults(potIncome: string, takeHome: string, tax: string) {
    this.elements.results().within(() => {
      cy.get('dl dt')
        .first()
        .should(
          'have.text',
          incomeData.core.potResultsLabel.replace('%POT_VALUE%', potIncome),
        );
      cy.get('dl dd').first().should('have.text', takeHome);
      cy.get('dl dt').last().should('have.text', incomeData.core.estimateLabel);
      cy.get('dl dd')
        .last()
        .should(
          'have.text',
          incomeData.core.taxAmount.replace('%TAX_VALUE%', tax),
        );
    });
  }

  validateErrorMessages() {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('[data-testid="error-summary-heading"]').should(
        'contain.text',
        incomeData.core.unableSubmitLabel,
      );
      cy.get('ul li')
        .first()
        .should('contain.text', incomeData.core.potErrorLabel);
      cy.get('ul li')
        .last()
        .should('contain.text', incomeData.core.ageErrorLabel);
    });
  }

  validateErrorMessage(
    fieldType: 'pot' | 'age',
    labelPrefix: 'pot' | 'age' | 'age2',
  ) {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('[data-testid="error-summary-heading"]').should(
        'contain.text',
        incomeData.core.unableSubmitLabel,
      );
      cy.get('ul li')
        .first()
        .should('contain.text', incomeData.core[`${labelPrefix}ErrorLabel`]);
    });
    cy.get(`label[for=${fieldType}] ~ .text-red-700`).should(
      'have.text',
      incomeData.core[`${labelPrefix}FieldLevelErrorLabel`],
    );
  }
}
