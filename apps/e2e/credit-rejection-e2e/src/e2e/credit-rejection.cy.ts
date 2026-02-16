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
  cy.get('[data-testid="next-page-button"]').click();

  cy.get('[data-testid="summary-block-title"]').should(($blocks) => {
    expect($blocks).to.have.length(sections.length);
    sections.forEach((section: string) => {
      expect($blocks).to.contain(section);
    });
  });

  if (restart) {
    cy.get('[data-testid="start-again-link"]').click();
    cy.url().should('include', '/question-1?restart=true');
  }
};

describe('Credit Rejection Tool', () => {
  beforeEach(() => {
    cy.skipExceptions();
    //cy.visit(basePath);
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
    cy.visit('/en/question-1');
  });

  it('Credit Rejection End to End happy path', () => {
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);
    cy.get('[data-testid="next-page-button"]').click();
    cy.elementContainsText('#results-page-heading', 'Your action plan');
    cy.get('[data-testid="summary-block-title"]').each(($elem, index) => {
      cy.wrap($elem).click();
      cy.get('details > div')
        .eq(index)
        .then(($el) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect($el).not.to.be.empty;
        });
    });
    cy.get('[data-testid="start-again-link"]')
      .should(($startAgainElem) => {
        expect($startAgainElem).to.have.attr(
          'href',
          '/en/question-1?restart=true',
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

  it('Reults page shows correct content based on selected answers', () => {
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
    verifyResultsPageSections(
      [0, 1, 0, 0, 0, 1, 1, 0],
      resultSections.filter((x) => x !== resultSections[2]),
      true,
    );
    verifyResultsPageSections(
      [0, 1, 1, 0, 0, 1, 1, 0],
      resultSections.filter((x) => x !== resultSections[3]),
    );
  });

  //This test case checks the ticket 23991 - Credit Rejection: Text changes for english & welsh
  it('Verify the changed text under the Have you registered to vote at your current address? ', () => {
    //English version
    cy.visit('/en/question-7?q-1=0&q-2=0&q-3=1&q-4=1&q-5=0&q-6=0');
    cy.get('.pb-4').should(
      'contain.text',
      'Many lenders use the electoral register to verify your identity and where you live.',
    );

    //Welsh version
    cy.visit('/cy/question-7?q-1=0&q-2=0&q-3=1&q-4=1&q-5=0&q-6=0');

    cy.get('.pb-4').should(
      'contain.text',
      "Mae llawer o fenthycwyr yn defnyddio'r gofrestr etholiadol i wirio pwy ydych chi a ble rydych chi'n byw.",
    );
  });

  // This test case verifies for Step Tools Lose Data on Error(Ticket - 24832) E2E testing of Credit Rejection
  // ----------------------------------------------------------------------------------------------------------
  it('Step Tools Lose Data on Error E2E-Credit Rejection', () => {
    cy.visit('/en/question-1');
    // Tapped on Continue button without selecting the option/answer for the question-1
    cy.get('button[data-testid="step-container-submit-button"]').click();

    //Check the displayed error message for not selecting / entering the value for the question-1
    cy.get('[data-testid="errorMessage-1"]').should(
      'contain.text',
      'Please select an answer',
    );
    cy.answerAndProceed(fullAnswerFlow);
    cy.verifyChangeAnswerPage(questions);

    //Tap on the change link at question-1 for going to back to question-1 to see the previously selected option
    cy.get('[data-testid="change-question-1"]').click();

    // Check the shown selected option is same as earlier for the question-1
    cy.get(':nth-child(2) > .flex > ').should('contain.text', 'No');
  });
});
