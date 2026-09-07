export type Duration = 'yearly' | 'monthly' | '4 weeks' | 'weekly';

export class WorkplacePensionCalculator {
  elements = {
    landingPageButton: () => cy.get('[data-testid="landing-page-button"]'),

    ageInput: () => cy.get('input#age'),
    ageInfoMessage: () => cy.get('input#age').parent().next(),

    salaryInput: () => cy.get('input#salary'),
    salaryPrimaryMessage: () =>
      cy.get('label[for="salary"]').parent().next().children().first(),
    salarySecondaryMessage: () =>
      cy.get('label[for="salary"]').parent().next().children().last(),
    salaryFrequency: () => cy.get('select#frequency'),

    getContributionType: (contributionType: string) =>
      cy.get(`label[for=${contributionType}]`),
    partContribution: () => cy.get('#contributionType-1'),
    fullContribution: () => cy.get('#contributionType-0'),

    submitButton: () => cy.get('button#submit'),

    contributionsInfoMessage: () =>
      cy.get('[data-testid="contribution-message"]'),
    employeeContribution: () => cy.get('#employeeContribution'),
    employerContribution: () => cy.get('#employerContribution'),
    contributionErrorMessage: () =>
      cy.contains('Please double-check for the following errors:'),

    resultsInfoMessage: () => cy.get('[data-testid="results-message"]'),

    contributionsDurationOption: (value: string) =>
      cy.get(`[data-testid="results"] option[value=${value}]`),

    print: () => cy.get('[data-testid="print"]'),
    email: () => cy.get('[data-testid="link"]').contains('Email your results'),
    reset: () =>
      cy.get('[data-testid="link"]').contains('Reset the calculator'),
  };

  clickSubmit() {
    this.elements.submitButton().click();
  }

  startJourney() {
    this.elements.landingPageButton().click();
  }

  typeAge(age: string) {
    this.elements.ageInput().clear();
    this.elements.ageInput().type(age);
  }

  validateAgeMessage(message?: string) {
    if (message) {
      this.elements.ageInfoMessage().should('contain.text', message);
    }
  }

  typeSalary(salary: string) {
    this.elements.salaryInput().type(salary);
  }

  selectSalaryFrequency(value: string) {
    this.elements.salaryFrequency().select(value);
  }

  validateSalaryMessages(messages: string[]) {
    if (messages.length > 1) {
      this.elements.salaryPrimaryMessage().should('contain.text', messages[0]);
      this.elements
        .salarySecondaryMessage()
        .should('contain.text', messages[1]);
    } else if (messages.length > 0) {
      this.elements.salaryPrimaryMessage().should('contain.text', messages[0]);
    }
  }

  checkContributionType(contributionType: string) {
    this.elements.getContributionType(contributionType).click();
  }

  validateContributionsMessage(message: string) {
    this.elements.contributionsInfoMessage().should('contain.text', message);
  }

  changeEmployeeContribution(value: string) {
    this.elements.employeeContribution().clear().type(value);
  }

  changeEmployerContribution(value: string) {
    this.elements.employerContribution().clear().type(value);
  }

  validateContributionErrorMessage(message: string) {
    this.elements
      .contributionErrorMessage()
      .parents('[data-testid=errors]')
      .first()
      .should('be.visible')
      .should('contain.text', message);
  }

  validateResultsMessage(message: string) {
    this.elements.resultsInfoMessage().should('contain.text', message);
  }

  selectResultsOption(value: string) {
    cy.get(`[data-testid="results"]`).select(value);
  }

  checkEmployeeContributionToBe(
    duration: Duration,
    contribution: string,
    taxRelief: string,
  ) {
    cy.get('dt')
      .contains(`Your ${duration} contribution`)
      .next()
      .should(
        'contain.text',
        `${contribution}(includes tax relief ${taxRelief})Tax relief on pension contributions`,
      );
  }

  checkEmployerContributionToBe(duration: Duration, contribution: string) {
    cy.get('dt')
      .contains(`Employers ${duration} contribution`)
      .next()
      .should('contain.text', contribution);
  }

  checkTotalContributionToBe(duration: Duration, contribution: string) {
    cy.get('dt')
      .contains(`Total ${duration} contributions`)
      .next()
      .should('contain.text', contribution);
  }

  print() {
    this.elements.print().click();
  }

  checkEmail(mailBody: string) {
    this.elements
      .email()
      .should(
        'have.attr',
        'href',
        `mailto:?body=${encodeURIComponent(mailBody)}`,
      );
  }

  reset() {
    this.elements.reset().click();
  }
}
