import cashData from '../fixtures/cashInChunks.json';

type FieldType = 'income' | 'pot' | 'chunk';
type LabelPrefix =
  | 'income'
  | 'pot'
  | 'cashChunk'
  | 'potZero'
  | 'chunkLessThanPot';

export class cashChunks {
  elements = {
    heading: () => cy.get('#main h1'),
    incomeText: () => cy.get('label[for=income]'),
    incomeLabel: () => cy.get('label[for=income] ~p'),
    income: () => cy.get('#income'),
    potText: () => cy.get('label[for=pot]'),
    pot: () => cy.get('#pot'),
    cashChunkText: () => cy.get('label[for=chunk]'),
    cashChunk: () => cy.get('#chunk'),
    updateChunkLabel: () => cy.get('label[for=updateChunk]'),
    updateChunk: () => cy.get('#updateChunk'),
    cashChunksLessThanPotValue: () =>
      cy.get('label[for=${fieldType}] ~ .text-red-700'),
    calculate: () => cy.get('#submit'),
    callOut: () => cy.get('.mb-8 > p'),
    errorMessage: () => cy.get('.t-error-summary'),
    results: () => cy.get('#results'),
    resultsTitle: () => cy.get('#results h2'),
  };

  enterIncomeValue(income: string) {
    this.elements.income().clear().type(income);
  }

  enterPotValue(pot: string) {
    this.elements.pot().clear().type(pot);
  }

  enterCashInChunks(chunk: string) {
    this.elements.cashChunk().clear().type(chunk);
  }

  updateChunk(chunk: string) {
    this.elements.updateChunk().clear().type(chunk);
  }

  validateResults(results: string[], firstChunk: string, pot: string) {
    this.elements.results().within(() => {
      cy.get('dt')
        .first()
        .should(
          'have.text',
          cashData.core.resultsHeader
            .replace('%FIRST_CHUNK%', firstChunk)
            .replace('%POT%', pot),
        );
      cy.get('dd').first().should('have.text', results[0]);

      cy.get('dt').eq(1).should('have.text', cashData.core.resultsLabel1);
      cy.get('dd').eq(1).should('have.text', results[1]);
      cy.get('dt').last().should('have.text', cashData.core.resultsLabel2);
      cy.get('dd').last().should('have.text', results[2]);

      this.elements
        .updateChunkLabel()
        .should('have.text', cashData.core.updateChunkLabel);
      this.elements.updateChunk().should('have.value', firstChunk);

      cy.get('p').should('have.text', cashData.core.resultInfo);
    });
  }

  validateErrorMessages() {
    this.validateErrorMessage(
      ['income', 'pot', 'chunk'],
      ['income', 'pot', 'cashChunk'],
    );
  }

  validateErrorMessage(fieldTypes: FieldType[], labelPrefixes: LabelPrefix[]) {
    this.elements.errorMessage().should('exist');
    this.elements.errorMessage().within(() => {
      cy.get('[data-testid="error-summary-heading"]').should(
        'have.text',
        cashData.core.unableSubmitLabel,
      );
      labelPrefixes.forEach((labelPrefix, index) => {
        cy.get('ul li')
          .eq(index)
          .should('have.text', cashData.core[`${labelPrefix}ErrorLabel`]);
      });
    });

    fieldTypes.forEach((fieldType, index) => {
      cy.get(`label[for=${fieldType}] ~ .text-red-700`).should(
        'have.text',
        cashData.core[`${labelPrefixes[index]}FieldLevelErrorLabel`],
      );
    });
  }
}
