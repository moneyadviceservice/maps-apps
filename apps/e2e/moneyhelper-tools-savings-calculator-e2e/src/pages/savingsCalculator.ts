export enum SAVING_FREQUENCY {
  WEEKLY = '52',
  MONTHLY = '12',
  YEARLY = '1',
}

export enum MONTHS {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export class saveCalculator {
  elements = {
    heading: () => cy.get('#main h1'),
    intro: () => cy.get('#main p').eq(0),
    howMuchIntro: () => cy.get('#main p').eq(1),
    howLongIntro: () => cy.get('#main p').eq(2),
    titles: () => cy.get('#main h1'),
    howLongCalculate: () => cy.get('#main p~a').eq(0),
    howMuchCalculate: () => cy.get('#main p~a').eq(1),

    getLabelForField: (id: string) => cy.get(`label[for="${id}"]`),
    getInputField: (id: string) => cy.get(`#${id}`),

    savingFrequency: () => cy.get('select#amountDuration'),
    month: () => cy.get('select#durationMonth'),
    year: () => cy.get('select#durationYear'),

    resultsContainer: () => cy.get('#results'),
  };

  checkLabelForField(id: string, label: string) {
    this.elements.getLabelForField(id).should('have.text', label);
  }

  enterValueForField(id: string, value: string) {
    this.elements.getInputField(id).clear().type(value);
  }

  selectSavingFrequency(value: SAVING_FREQUENCY) {
    this.elements.savingFrequency().select(value);
  }

  selectMonth(value: MONTHS) {
    this.elements.month().select(value);
  }

  selectYear(value: string) {
    this.elements.year().select(value);
  }

  submitButton() {
    cy.get('button[type="submit"]').first().click();
  }

  validateHowLongResults(
    duration: string,
    target: string,
    savingAmount: string,
    savingTip: string,
  ) {
    this.elements.resultsContainer().within(() => {
      cy.get('h2').should('have.text', 'Your results');
      cy.get('h2 ~ p').should(
        'have.text',
        'To adjust the results, edit your answers.',
      );

      cy.get('dt').eq(0).should('have.text', 'It will take until:');
      cy.get('dd').eq(0).should('have.text', duration);

      cy.get('dt').eq(1).should('have.text', 'To hit your goal of:');
      cy.get('dd').eq(1).should('have.text', target);

      cy.get('dt').eq(2).should('have.text', 'If you save:');
      cy.get('dd').eq(2).should('have.text', savingAmount);

      cy.get('h3').should('have.text', 'Reach your goal sooner');
      cy.get('h3 ~ p').should('have.text', savingTip);
    });
  }

  validateHowMuchResults(
    savingAmount: string,
    target: string,
    saveTotal: string,
    savingTip: string,
  ) {
    this.elements.resultsContainer().within(() => {
      cy.get('h2').should('have.text', 'Your results');
      cy.get('h2 ~ p').should(
        'have.text',
        'To adjust the results, edit your answers.',
      );

      cy.get('dt').eq(0).should('have.text', 'You will need to save:');
      cy.get('dd').eq(0).should('have.text', savingAmount);

      cy.get('dt').eq(1).should('have.text', 'To meet your target of:');
      cy.get('dd').eq(1).should('have.text', target);

      cy.get('dt')
        .eq(2)
        .should('have.text', 'Total you will save by this date:');
      cy.get('dd').eq(2).should('have.text', saveTotal);

      cy.get('h3').should('have.text', 'Reach your goal sooner');
      cy.get('h3 ~ p').should('have.text', savingTip);
    });
  }

  validateNotes(note: string, nextSteps: string[]) {
    cy.get('main div')
      .eq(21)
      .within(() => {
        cy.get('p').should('have.text', note);
        cy.get('h2').should('have.text', 'Next steps');
        nextSteps.forEach((nextStep, index) => {
          cy.get('li').eq(index).should('contain.text', nextStep);
        });
      });
  }

  validateInterestMessage(msg: string) {
    cy.get('label[for="interest"] ~ p').should('have.text', msg);
  }

  /**
   * As we are setting a specific date to handle the tests, we are getting Hydration error from React.
   * Clearing this error by closing the modal, before continuing with next steps
   */
  clearHydrationError() {
    cy.get('button[aria-label="Close"]', {
      timeout: 10000,
      includeShadowDom: true,
    }).click();
  }

  validateErrorMessage(fieldId: string, message: string) {
    cy.get('[aria-describedby=error-summary-heading]').within(() => {
      cy.get('h5').should('have.text', 'There is a problem');
      cy.get('li').contains(message);
    });
    this.elements.getLabelForField(fieldId).next().should('have.text', message);
  }
}
