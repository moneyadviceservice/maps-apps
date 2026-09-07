import { expect, test } from 'lib/test.lib';

test.describe('Eligible paths', () => {
  test.describe('50 to 54 year old', () => {
    test.beforeEach(async ({ pages }) => {
      await pages.questions.agePage.goto();
      await pages.questions.agePage.selectOption('50 - 54');
      await pages.questions.agePage.submit();
      await pages.transitional.fiftyToFiftyFourPage.continue();
    });
    /**
     *   @tests 47186 - AC8: Continue [No]
     */

    test('Has DC pension, not ill, has annuity, and not missed a payment', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('Yes');
      await pages.questions.annuityPage.submit();
      await pages.transitional.lifetimeAnnuityConfirmationPage.continue();
      await pages.questions.missedPayments.selectOption('No');
      await pages.questions.missedPayments.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=2$/);
    });

    /**
     *   @tests 47167 - Navigating to question 6 ineligible page
     *   @tests 47177 - AC5: Continue [Yes]
     *   @tests 47187 - AC7: Continue [Yes]
     */
    test('Has DC pension, not ill, has annuity, has missed payments but received debt advice', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('Yes');
      await pages.questions.annuityPage.submit();
      await pages.transitional.lifetimeAnnuityConfirmationPage.continue();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('Yes');
      await pages.questions.debtAdvice.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=2$/);
    });

    test('Has DC pension, not ill, no lifetime annuity, has missed payments but received debt advice', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('No');
      await pages.questions.annuityPage.submit();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('Yes');
      await pages.questions.debtAdvice.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=2$/);
    });
  });

  test.describe('55 to 74 year old', () => {
    test.beforeEach(async ({ pages }) => {
      await pages.questions.agePage.goto();
      await pages.questions.agePage.selectOption('55 - 74');
      await pages.questions.agePage.submit();
    });

    test('Has DC pension, not ill, has annuity, and not missed a payment', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('Yes');
      await pages.questions.annuityPage.submit();
      await pages.transitional.lifetimeAnnuityConfirmationPage.continue();
      await pages.questions.missedPayments.selectOption('No');
      await pages.questions.missedPayments.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=3$/);
    });

    test('Has DC pension, not ill, has annuity, has missed payments but received debt advice', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('Yes');
      await pages.questions.annuityPage.submit();
      await pages.transitional.lifetimeAnnuityConfirmationPage.continue();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('Yes');
      await pages.questions.debtAdvice.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=3$/);
    });

    test('Has DC pension, not ill, no lifetime annuity, has missed payments but received debt advice', async ({
      pages,
      page,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('No');
      await pages.questions.annuityPage.submit();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('Yes');
      await pages.questions.debtAdvice.submit();

      await expect(page).toHaveURL(/\/en\/pension-wise-appointment\?age=3$/);
    });
  });
});
