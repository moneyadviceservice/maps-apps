import creditRejectionData from '../fixtures/creditRejectionData.json';

const resultSections = creditRejectionData.resultSections.en;
const questions = creditRejectionData.questions.en;
const fullAnswerFlow = [1, 0, 1, 0, 1, 1, 1, 1];

const verifyResultsPageSections = (
  answers: number[],
  sections: string[],
  restart = false,
) => {
  cy.answerAndProceed(answers);
  cy.intercept(`/**/en/credit-rejection/results.json*`).as('result');
  cy.get('[data-testid="next-page-button"]').click();
  cy.wait('@result').its('response.statusCode').should('eq', 200);
  cy.get('h1').should('have.text', 'Your action plan').should('be.visible');

  cy.get('[data-testid="expandable-section"]').then(($blocks) => {
    expect($blocks).to.have.length(sections.length);
    sections.forEach((section: string) => {
      expect($blocks).to.contain(section);
    });
  });

  if (restart) {
    cy.get('[data-testid="start-again-link"]').click();
    cy.url().should('include', '/credit-rejection/question-1?restart=true');
  }
};

describe('Credit Rejection Tool', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/credit-rejection/question-1');
  });

  it('Credit Rejection End to End happy path', () => {
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);
    cy.intercept(`/**/en/credit-rejection/results.json*`).as('result');
    cy.get('[data-testid="next-page-button"]').click();
    cy.wait('@result').its('response.statusCode').should('eq', 200);
    cy.get('#results-page-heading').contains('Your action plan');
    cy.get('[data-testid="summary-block-title"]').each(($elem, index) => {
      cy.wrap($elem).click();
      cy.get('details > div')
        .eq(index)
        .then(($el) => {
          expect($el).not.to.be.empty;
        });
    });
    cy.get('[data-testid="start-again-link"]')
      .should(($startAgainElem) => {
        expect($startAgainElem).to.have.attr(
          'href',
          '/en/credit-rejection/question-1?restart=true',
        );
      })
      .then(($startAgainElem) => {
        cy.wrap($startAgainElem).click();
      });
    cy.elementContainsText(
      'h1',
      'Have you been declined for credit in the past six months?',
    );
    cy.get('input[type="radio"]').each(($elem) => {
      cy.wrap($elem).should('not.be.checked');
    });
  });

  it('Skips question 4 based on question 3 answer - Do any of the accounts in your name use old details?', () => {
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);
    cy.get('[data-testid="change-question-3"]').click(); // Change question 3
    cy.answerAndProceed([2, 0, 1, 1, 1]);
    cy.verifyChangeAnswerPage(questions, [4]);
  });

  it('Results page shows correct content based on selected answers scenario 1', () => {
    verifyResultsPageSections(
      [1, 0, 2, 1, 0, 0, 1],
      resultSections.filter(
        (x) =>
          x === resultSections[2] ||
          x === resultSections[3] ||
          x === resultSections[9],
      ),
      true,
    );
  });

  it('Results page shows correct content based on selected answers scenario 2', () => {
    verifyResultsPageSections(
      [0, 1, 0, 0, 0, 1, 1, 0],
      resultSections.filter((x) => x !== resultSections[2]),
      true,
    );
  });

  it('Results page shows correct content based on selected answers scenario 3', () => {
    verifyResultsPageSections(
      [0, 1, 1, 0, 0, 1, 1, 0],
      resultSections.filter((x) => x !== resultSections[3]),
    );
  });
});
