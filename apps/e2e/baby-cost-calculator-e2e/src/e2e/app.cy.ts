import { getGreeting } from '../support/app.po';

describe('baby-cost-calculator-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getGreeting().contains(/When is your baby due/);
  });
});
