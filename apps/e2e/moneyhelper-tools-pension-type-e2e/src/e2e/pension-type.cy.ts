import pensionTypeData from '../fixtures/pensionTypeData.json';

const headings = pensionTypeData.headings.en;
const questions = pensionTypeData.questions.en;
const fullAnswerFlow = [0, 1, 2, 1];

// Function to restart
const restartTool = () => {
  cy.visit(`/en/pension-type/question-1`);
};

// Function to answer questions and navigate
const answerQuestionsAndNavigate = (answers: number[]) => {
  cy.answerAndProceed(answers);
  cy.get('[data-testid="next-page-button"]').click();
};

// Function to verify result headings
const verifyResultHeadings = (
  answers: number[],
  heading: string,
  restart = false,
) => {
  answerQuestionsAndNavigate(answers);
  cy.elementContainsText('#results-page-heading', heading);

  if (restart) {
    restartTool();
  }
};

// Function to verify result data
const verifyResultData = (
  answers: number[],
  shouldHaveButton: boolean,
  restart = false,
) => {
  answerQuestionsAndNavigate(answers);
  if (shouldHaveButton) {
    cy.get('#pension-appointment-button').should('exist');
    cy.get('#pension-appointment-button').should(
      'have.attr',
      'href',
      'https://www.moneyhelper.org.uk/en/pensions-and-retirement/pension-wise/book-a-free-pension-wise-appointment',
    );
  } else {
    cy.get('#pension-appointment-button').should('not.exist');
  }
  if (restart) {
    restartTool();
  }
};

describe('Pension Type Tool', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/pension-type/question-1');
  });

  it('Pension Type End to End happy path', () => {
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);
    cy.get('[data-testid="next-page-button"]').click();
    cy.elementContainsText('#results-page-heading', headings[0]);
  });

  it('Skips questions after question 1', () => {
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);
    cy.get('[data-testid="change-question-1"]').click(); // Change question 1
    cy.answerAndProceed([1]);
    cy.verifyChangeAnswerPage(questions, [2, 3, 4]);
  });

  it('Shows correct results heading based on answers', () => {
    verifyResultHeadings([0, 1, 1, 1], headings[0], true); // In most cases you’ll have a defined benefit pension
    verifyResultHeadings([0, 1, 1, 2], headings[1], true); //From what you’ve told us you have a defined contribution pension
    verifyResultHeadings([0, 1, 1, 3], headings[2]); //You might have a defined contribution pension
  });

  it('Shows correct results sections based on answers', () => {
    verifyResultData([0, 1, 1, 2], true, true); // has appointment button
    verifyResultData([0, 1, 1, 0], false, true); // does not have appointment button
    verifyResultData([0, 0], false); // does not have appointment button
  });
});
