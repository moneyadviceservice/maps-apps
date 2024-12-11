import { getGreeting } from '../pages/app.po';

describe('money-adviser-network-e2e', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/');
  });

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains(/Debt advice referral/);
  });
});
