import query from '../fixtures/queryParams.json';
describe('Summary page redirected from Lookup form', () => {
  beforeEach(() => {
    cy.setCookieControl();
  });
  it('should display question and answers correctly', () => {
    const possibleAnswers = ['Yes', 'No'];
    const queryParamsToString = Object.keys(query).reduce((acc, key) => {
      acc += `${key}=${query[key]}&`;
      return acc;
    }, '');
    cy.log('Query params ', queryParamsToString);
    cy.visit(
      `/en/pension-wise-appointment/client-summary?${queryParamsToString}`,
    );
    cy.get('[data-testid="urn-callout"]').should('contain.text', 'PDH0-0WAV');

    Object.keys(query).forEach((param) => {
      if (param.length === 4)
        cy.get(`[data-testid="section-${param}"]`).should(
          'contain.text',
          possibleAnswers[Number(query[param]) - 1],
        );
    });
  });
});
