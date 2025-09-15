import wpcc from '../fixtures/workplacePensionCalculator.json';
import {
  WorkplacePensionCalculator,
  type Duration,
} from '../pages/workplacePensionCalculator';

const page = new WorkplacePensionCalculator();

type Contribution = {
  duration: string;
  durationType: Duration;
  employeeContribution: string;
  taxRelief: string;
  employerContribution: string;
  totalContribution: string;
};

describe('Workplace Pension Calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/workplace-pension-calculator');
  });

  it('Landing page', () => {
    cy.elementContainsText(
      '[data-testid="toolpage-h1-title"]',
      wpcc.landingPage.en.heading,
    );
    cy.elementContainsText(
      '[data-testid="tool-intro"]',
      wpcc.landingPage.en.intro,
    );

    cy.elementContainsText(
      '[data-testid="paragraph"]',
      wpcc.landingPage.en.info[0],
    );
    cy.elementContainsText(
      '[data-testid="paragraph"]',
      wpcc.landingPage.en.info[1],
    );
    cy.elementContainsText(
      '[data-testid="list-element"]',
      wpcc.landingPage.en.info[2],
    );
    cy.elementContainsText(
      '[data-testid="list-element"]',
      wpcc.landingPage.en.info[3],
    );
    cy.elementContainsText(
      '[data-testid="list-element"]',
      wpcc.landingPage.en.info[4],
    );
    cy.elementContainsText(
      '[data-testid="landing-page-button"]',
      wpcc.landingPage.en.button,
    );
    cy.elementContainsText(
      '[data-testid="urgent-callout"]',
      wpcc.landingPage.en.help,
    );

    cy.get('[data-testid="landing-page-button"]').click();
    cy.url().should('include', '/workplace-pension-calculator/calculator');
  });

  describe('Salary validation messages', () => {
    wpcc.yourDetails.salary.testCases.forEach(
      ({ salary, frequency, label, messages }) => {
        it(`should display ${label}`, () => {
          page.startJourney();
          page.typeSalary(salary);
          page.selectSalaryFrequency(frequency);
          let msgs = [];
          if (messages.length > 1) {
            msgs = [
              wpcc.yourDetails.salary.messages[messages[0]],
              wpcc.yourDetails.salary.messages[messages[1]],
            ];
          } else if (messages.length === 1) {
            msgs = [wpcc.yourDetails.salary.messages[messages[0]]];
          }
          page.validateSalaryMessages(msgs);
        });
      },
    );
  });

  it('should show contributions for whole salary below threshold', () => {
    page.startJourney();
    page.typeAge('21');
    page.validateAgeMessage(
      'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
    );
    page.typeSalary('6239');
    page.selectSalaryFrequency('1');

    page.validateSalaryMessages([
      'Your employer will not automatically enrol you into a pension but you can choose to join. If you earn more than the lower level of qualifying earnings, your employer must also contribute.',
      'Please note: Your earnings are very close to the threshold at which your employer does not have to contribute to your pension if you choose to enrol. You should check to confirm whether or not your employer will contribute as this threshold varies depending on whether you are paid monthly, weekly or 4-weekly. Read more about the salary thresholds for workplace pensions. (opens in a new window) ',
    ]);

    page.elements.partContribution().should('be.disabled');
    page.elements.fullContribution().should('be.checked');
    page.clickSubmit();

    // Contributions
    page.validateContributionsMessage(
      'Contributions will be made on your salary of £6,239 per year.',
    );
    page.changeEmployeeContribution('1');
    page.validateContributionErrorMessage(
      'Please double-check for the following errors:1. Total contribution must be at least 8%.',
    );

    page.changeEmployeeContribution('5');
    page.elements.contributionErrorMessage().should('not.exist');

    page.changeEmployerContribution('2');
    page.validateContributionErrorMessage(
      'Please double-check for the following errors:1. Total contribution must be at least 8%.',
    );

    page.changeEmployerContribution('3');
    page.elements.contributionErrorMessage().should('not.exist');
    page.clickSubmit();

    // Results
    page.validateResultsMessage(
      'Contributions will be based on your salary of £6,239 per year.',
    );
    page.elements.contributionsDurationOption('12').should('be.selected');
    page.checkEmployeeContributionToBe('monthly', '£26.00', '£5.20');
    page.checkEmployerContributionToBe('monthly', '£15.60');
    page.checkTotalContributionToBe('monthly', '£41.60');
  });

  wpcc.testCases.forEach((scenario) => {
    it(`should show contributions for ${scenario.label}`, () => {
      page.startJourney();
      page.typeAge(scenario.age);
      page.validateAgeMessage(scenario.ageValidationMessage);
      page.typeSalary(scenario.salary);
      page.selectSalaryFrequency(scenario.salaryFrequency);

      page.validateSalaryMessages(scenario.salaryValidationMessages);

      page.checkContributionType(scenario.contributionType);
      page.clickSubmit();

      // Contributions
      page.validateContributionsMessage(scenario.contributionsMessage);
      page.changeEmployeeContribution(scenario.employeeContribution);
      page.changeEmployerContribution(scenario.employerContribution);
      page.clickSubmit();

      // Results
      page.validateResultsMessage(scenario.resultsMessage);
      scenario.contributions.forEach(
        ({
          duration,
          durationType,
          employeeContribution,
          taxRelief,
          employerContribution,
          totalContribution,
        }: Contribution) => {
          page.selectResultsOption(duration);
          page.checkEmployeeContributionToBe(
            durationType,
            employeeContribution,
            taxRelief,
          );
          page.checkEmployerContributionToBe(
            durationType,
            employerContribution,
          );
          page.checkTotalContributionToBe(durationType, totalContribution);
        },
      );
    });
  });

  it('should disable pension calculator for age below 16', () => {
    page.startJourney();
    page.typeAge('15');
    page.validateAgeMessage(
      'You are too young to join a workplace pension. When you reach the age of 16 you can choose to join. If you do so, your employer might make contributions too depending on how much you earn.',
    );
    page.elements.submitButton().should('be.disabled');
  });

  it('should disable pension calculator for age 75 or above', () => {
    page.startJourney();
    page.typeAge('75');
    page.validateAgeMessage(
      'You are not entitled to be automatically enrolled into a workplace pension. Many of the tax benefits of saving into a pension stop at age 75.',
    );
    page.elements.submitButton().should('be.disabled');

    page.typeAge('80');
    page.elements.submitButton().should('be.disabled');
  });

  it('should call print on click to print', () => {
    page.startJourney();
    page.typeAge('21');
    page.typeSalary('6239');
    page.clickSubmit();

    page.validateContributionsMessage(
      'Contributions will be made on your salary of £6,239 per year.',
    );
    page.clickSubmit();

    page.validateResultsMessage(
      'Contributions will be based on your salary of £6,239 per year.',
    );
    cy.window().then((win) => {
      cy.stub(win, 'print').as('print');
    });
    page.print();
    cy.get('@print').should('be.calledOnce');
  });

  it('should send results on an email', () => {
    page.startJourney();
    page.typeAge('21');
    page.typeSalary('6239');
    page.clickSubmit();

    page.validateContributionsMessage(
      'Contributions will be made on your salary of £6,239 per year.',
    );
    page.clickSubmit();

    page.validateResultsMessage(
      'Contributions will be based on your salary of £6,239 per year.',
    );
    page.checkEmail(
      '\n    1. Your details: 21 Years, £6,239 per year, full salary\n\n    2. Your contributions: You: 5%, Your employer: 3%\n\n    3. Your Results\n\n    Qualifying earnings: £6,239\n\n    \n    Your monthly contribution: £26.00 (includes tax relief of £5.20)\n\n    Employers monthly contribution: £15.60\n\n    Total monthly contributions: £41.60\n      ',
    );
  });

  it('should reset calculator', () => {
    page.startJourney();
    page.typeAge('21');
    page.typeSalary('6239');
    page.clickSubmit();

    page.validateContributionsMessage(
      'Contributions will be made on your salary of £6,239 per year.',
    );
    page.clickSubmit();

    page.validateResultsMessage(
      'Contributions will be based on your salary of £6,239 per year.',
    );
    page.reset();
    cy.url().should(
      'include',
      '/en/workplace-pension-calculator/calculator?reset=true#top',
    );
  });
});
