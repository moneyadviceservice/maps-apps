import incomeData from '../fixtures/adjustableIncome.json';

export class IncomeEstimator {
  elements = {
    heading: () => cy.get('#main h1'),
    potLabel: () => cy.get('label[for=pot]'),
    potIncome: () => cy.get('#pot'),
    ageLabel: () => cy.get('label[for=age]'),
    age: () => cy.get('#age'),
    monthlyIncome: () => cy.get('#updateMonth'),
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

  updateMonthlyIncome(income: string) {
    this.elements.monthlyIncome().clear().type(`{selectAll}${income}`);
  }

  validateResults(
    potIncome: string,
    takeHome: string,
    tax: string,
    age: string,
  ) {
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
          incomeData.core.taxAmount
            .replace('%TAX_VALUE%', tax)
            .replace('%AGE_UNTIL%', age),
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
    });
  }

  validateErrorMessage(fieldType: 'pot' | 'age', labelPrefix: 'pot' | 'age') {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('[data-testid="error-summary-heading"]').should(
        'contain.text',
        incomeData.core.unableSubmitLabel,
      );
      cy.get('ul li')
        .first()
        .should('contain.text', incomeData.core[`${labelPrefix}ErrorLabel1`]);
    });
    cy.get(`label[for=${fieldType}] ~ .text-red-700`).should(
      'have.text',
      incomeData.core[`${labelPrefix}FieldLevelErrorLabel`],
    );
  }

  validateErrorMessageForZeroValue() {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('[data-testid="error-summary-heading"]').should(
        'contain.text',
        incomeData.core.unableSubmitLabel,
      );
      cy.get('ul li')
        .first()
        .should('contain.text', incomeData.core.potZeroErrorLabel);
    });
    cy.get(`label[for=pot] ~ .text-red-700`).should(
      'have.text',
      incomeData.core.potZeroFieldLevelErrorLabel,
    );
  }
}
