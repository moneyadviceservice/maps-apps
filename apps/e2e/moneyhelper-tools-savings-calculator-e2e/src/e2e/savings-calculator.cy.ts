import saveData from '../fixtures/savingsCalculator.json';
import {
  MONTHS,
  saveCalculator,
  SAVING_FREQUENCY,
} from '../pages/savingsCalculator';

const todaysDate = new Date();

describe('Savings Calculator', () => {
  beforeEach(() => {
    //cy.mockGoogleAnalytics();
    cy.setCookieControl();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    const now = new Date(Date.parse('2023-06-01')).getTime();
    cy.clock(now, ['Date']);
    cy.visit('/en/savings-calculator');
    cy.tick(10000);
    page.clearHydrationError();
  });

  const page = new saveCalculator();

  it('landing page', () => {
    page.elements.heading().should('have.text', saveData.core.heading);
    page.elements.intro().should('have.text', saveData.core.intro);
    page.elements
      .howMuchIntro()
      .should('have.text', saveData.core.howMuchIntro);
    page.elements
      .howLongIntro()
      .should('have.text', saveData.core.howLongIntro);
  });

  it('how long to save for target', () => {
    page.elements.howLongCalculate().click();
    page.elements.titles().should('have.text', saveData.howLong.title);
    page.clearHydrationError();

    page.checkLabelForField('savingGoal', saveData.howLong.savingsGoalLabel);
    page.enterValueForField('savingGoal', '20000');

    page.checkLabelForField('amount', saveData.howLong.selectDropdown);
    page.enterValueForField('amount', '250');
    page.selectSavingFrequency(SAVING_FREQUENCY.MONTHLY);

    page.checkLabelForField('saved', saveData.howLong.savedAmount);
    page.enterValueForField('saved', '2000');

    page.checkLabelForField('interest', saveData.howLong.grossInterest);
    page.enterValueForField('interest', '5.1');

    page.submitButton();

    page.clearHydrationError();
    page.validateHowLongResults(
      'August 2028(5 years and 2 months)',
      '£20,000',
      '£250 a month',
      'You could reach your goal over 1 year sooner by increasing your saving amount to £340 (an increase of £90 per month).',
    );

    page.validateNotes(saveData.howLong.note, saveData.howLong.nextSteps);
  });

  it('how long to save for target, recalculate', () => {
    page.elements.howLongCalculate().click();
    page.elements.titles().should('have.text', saveData.howLong.title);
    page.clearHydrationError();

    page.enterValueForField('savingGoal', '20000');

    page.enterValueForField('amount', '2500');
    page.selectSavingFrequency(SAVING_FREQUENCY.YEARLY);

    page.enterValueForField('saved', '2000');

    page.enterValueForField('interest', '0.1');

    page.submitButton();

    page.validateInterestMessage(saveData.core.lowInterestMsg);
    page.validateHowLongResults(
      'September 2030(7 years and 3 months)',
      '£20,000',
      '£2,500 a year',
      'You could reach your goal almost 2 years sooner by increasing your saving amount to £3,264 (an increase of £764 per year).',
    );

    page.clearHydrationError();
    page.enterValueForField('interest', '25');
    page.submitButton();
    page.validateInterestMessage(
      saveData.core.highInterestMsg.replace('%RATE_OF_INTEREST%', '25'),
    );
    page.validateHowLongResults(
      'May 2027(3 years and 11 months)',
      '£20,000',
      '£2,500 a year',
      'You could reach your goal 11 months sooner by increasing your saving amount to £3,804 (an increase of £1,304 per year).',
    );

    page.clearHydrationError();
    page.enterValueForField('amount', '250');
    page.selectSavingFrequency(SAVING_FREQUENCY.MONTHLY);
    page.enterValueForField('interest', '5.1');
    page.submitButton();

    page.validateHowLongResults(
      'August 2028(5 years and 2 months)',
      '£20,000',
      '£250 a month',
      'You could reach your goal over 1 year sooner by increasing your saving amount to £340 (an increase of £90 per month).',
    );
  });

  it('how long to save for target, validation messages', () => {
    page.elements.howLongCalculate().click();
    page.elements.titles().should('have.text', saveData.howLong.title);
    page.clearHydrationError();
    page.submitButton();
    page.clearHydrationError();

    page.validateErrorMessage(
      'savingGoal',
      saveData.validationMessages.savingsGoal,
    );
    page.validateErrorMessage(
      'amount',
      saveData.validationMessages.amountToSave,
    );

    page.enterValueForField('savingGoal', '20000');
    page.submitButton();
    page.clearHydrationError();

    page.validateErrorMessage(
      'amount',
      saveData.validationMessages.amountToSave,
    );
  });

  it('how much to save for target', () => {
    page.elements.howMuchCalculate().click();
    page.elements.titles().should('have.text', saveData.howMuch.title);
    page.clearHydrationError();

    page.checkLabelForField('savingGoal', saveData.howMuch.savingsGoalLabel);
    page.enterValueForField('savingGoal', '20000');

    page.checkLegendWithValue(saveData.howMuch.savingDate);
    page.checkLabelForField('durationMonth', saveData.howMuch.month);
    page.checkLabelForField('durationYear', saveData.howMuch.year);

    page.selectMonth(MONTHS.August);
    page.selectYear('2026');

    page.checkLabelForField('saved', saveData.howMuch.savedAmount);
    page.enterValueForField('saved', '2000');

    page.checkLabelForField('interest', saveData.howMuch.grossInterest);
    page.enterValueForField('interest', '5.1');

    page.submitButton();
    page.clearHydrationError();

    page.validateHowMuchResults(
      '£430 per month',
      'August 2026',
      '£20,002',
      'You could reach your goal 9 months sooner by increasing your saving amount to £578 (an increase of £148 per month).',
    );

    page.validateNotes(saveData.howMuch.note, saveData.howMuch.nextSteps);
  });

  it('how much to save for target, recalculate', () => {
    page.elements.howMuchCalculate().click();
    page.elements.titles().should('have.text', saveData.howMuch.title);
    page.clearHydrationError();

    page.enterValueForField('savingGoal', '20000');

    page.selectMonth(MONTHS.August);
    page.selectYear('2026');

    page.enterValueForField('saved', '2000');

    page.enterValueForField('interest', '0.1');

    page.submitButton();
    page.clearHydrationError();

    page.validateInterestMessage(saveData.core.lowInterestMsg);
    page.validateHowMuchResults(
      '£473 per month',
      'August 2026',
      '£20,008',
      'You could reach your goal 9 months sooner by increasing your saving amount to £620 (an increase of £147 per month).',
    );
    page.validateNotes(saveData.howMuch.note, saveData.howMuch.nextSteps);

    page.enterValueForField('interest', '25');
    page.submitButton();
    page.clearHydrationError();

    page.validateInterestMessage(
      saveData.core.highInterestMsg.replace('%RATE_OF_INTEREST%', '25'),
    );
    page.validateHowMuchResults(
      '£292 per month',
      'August 2026',
      '£20,034',
      'You could reach your goal 9 months sooner by increasing your saving amount to £436 (an increase of £144 per month).',
    );

    page.selectMonth(MONTHS.December);
    page.selectYear('2026');
    page.enterValueForField('interest', '5.1');
    page.submitButton();
    page.clearHydrationError();

    page.validateHowMuchResults(
      '£385 per month',
      'December 2026',
      '£20,007',
      'You could reach your goal 10 months sooner by increasing your saving amount to £519 (an increase of £134 per month).',
    );
  });

  it('how much to save for target, validation messages', () => {
    page.elements.howMuchCalculate().click();
    page.elements.titles().should('have.text', saveData.howMuch.title);
    page.clearHydrationError();
    page.submitButton();
    page.clearHydrationError();

    page.validateErrorMessage(
      'savingGoal',
      saveData.validationMessages.savingsGoal,
    );

    page.enterValueForField('savingGoal', '20000');

    page.selectMonth(MONTHS.April);
    page.selectYear('2024');

    page.enterValueForField('saved', '2000');
    page.enterValueForField('interest', '5.1');
    page.submitButton();
    page.clearHydrationError();
    page.validateErrorMessage('date', saveData.validationMessages.pastDate);

    page.selectMonth(todaysDate.getMonth() + 1);
    page.selectYear(todaysDate.getFullYear().toString());
    page.submitButton();
    page.clearHydrationError();
    page.validateErrorMessage('date', saveData.validationMessages.currentDate);
  });
});
