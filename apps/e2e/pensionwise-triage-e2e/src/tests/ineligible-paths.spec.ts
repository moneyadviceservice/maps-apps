import { expect, test } from 'lib/test.lib';

test.describe('Ineligible paths', () => {
  /**
   * @tests 47263 - AC3: Navigating to under 50 ineligible page
   * @tests 47281 - AC6: Continue Under 50
   */
  test('Under 50 year old is ineligible', async ({ pages }) => {
    await pages.questions.agePage.goto();
    await pages.questions.agePage.selectOption('Under 50');

    await pages.questions.agePage.submit();

    await expect(pages.ineligible.under50Page.sectionTitle).toHaveText(
      pages.ineligible.under50Page.data.title,
    );
  });

  /**
   * @tests 47278 - AC9: Continue 75 or over
   */
  test('Over 75 year old is ineligible', async ({ pages }) => {
    await pages.questions.agePage.goto();
    await pages.questions.agePage.selectOption('75 and over');

    await pages.questions.agePage.submit();

    await expect(pages.ineligible.over75Page.sectionTitle).toHaveText(
      pages.ineligible.over75Page.data.title,
    );
  });

  test.describe('50 to 54 year old', () => {
    /**
     * @tests 47270 - AC3: Navigating to (50-54) transition page
     * @tests 47280 - AC7: Continue 50-54
     */
    test.beforeEach(async ({ pages }) => {
      await pages.questions.agePage.goto();
      await pages.questions.agePage.selectOption('50 - 54');
      await pages.questions.agePage.submit();
      await pages.transitional.fiftyToFiftyFourPage.continue();
    });

    /**
     * @tests 47268 - AC5: Continue to Question 2
     */
    test('Terminal illness', async ({ pages }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('Yes');
      await pages.questions.terminallyIllPage.submit();

      await expect(
        pages.ineligible.terminallyIllConfirmationPage.sectionTitle,
      ).toHaveText(pages.ineligible.terminallyIllConfirmationPage.data.title);
    });

    /**
     * @tests 47239 - AC3: Navigating to question 2 ineligible page
     * @tests 47246 - AC7: Continue [No]
     */
    test('Does not have DC pension', async ({ pages }) => {
      await pages.questions.definedContributionPage.selectOption('No');
      await pages.questions.definedContributionPage.submit();
      await expect(pages.ineligible.noDCPage.sectionTitle).toHaveText(
        pages.ineligible.noDCPage.data.title,
      );
    });

    /**
     * @tests 47247 -AC6: Continue [Yes]
     */
    test('Did not seek debt advice (Has lifetime annuity payment)', async ({
      pages,
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
      await pages.questions.debtAdvice.selectOption('No');
      await pages.questions.debtAdvice.submit();

      await expect(pages.ineligible.freeDebtAdvicePage.sectionTitle).toHaveText(
        pages.ineligible.freeDebtAdvicePage.data.title,
      );
    });

    test('Did not seek debt advice (Does not have lifetime annuity payment)', async ({
      pages,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('No');
      await pages.questions.annuityPage.submit();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('No');
      await pages.questions.debtAdvice.submit();

      await expect(pages.ineligible.freeDebtAdvicePage.sectionTitle).toHaveText(
        pages.ineligible.freeDebtAdvicePage.data.title,
      );
    });
  });

  test.describe('55 to 74 year old', () => {
    /**
     * @tests 47279 - AC8: Continue 55-74
     */
    test.beforeEach(async ({ pages }) => {
      await pages.questions.agePage.goto();
      await pages.questions.agePage.selectOption('55 - 74');
      await pages.questions.agePage.submit();
    });

    /**
     * @tests 47217 - AC3: Navigating to question 3 ineligible page
     * @tests 47226 - AC8: Continue [Yes]
     */

    test('Terminal illness', async ({ pages }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('Yes');
      await pages.questions.terminallyIllPage.submit();

      await expect(
        pages.ineligible.terminallyIllConfirmationPage.sectionTitle,
      ).toHaveText(pages.ineligible.terminallyIllConfirmationPage.data.title);
    });

    test('Does not have DC pension', async ({ pages }) => {
      await pages.questions.definedContributionPage.selectOption('No');
      await pages.questions.definedContributionPage.submit();

      await expect(pages.ineligible.noDCPage.sectionTitle).toHaveText(
        pages.ineligible.noDCPage.data.title,
      );
    });

    /**
     * @tests 47196 - AC5: Continue
     * @tests 47198 - Navigating to question 4 ineligible page
     * @tests 47209 - AC4: Continue [Yes]
     * @tests 47225 - AC9: Continue [No]
     */
    test('Did not seek debt advice (Has lifetime annuity payment)', async ({
      pages,
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
      await pages.questions.debtAdvice.selectOption('No');
      await pages.questions.debtAdvice.submit();

      await expect(pages.ineligible.freeDebtAdvicePage.sectionTitle).toHaveText(
        pages.ineligible.freeDebtAdvicePage.data.title,
      );
    });

    /**
     *
     * @tests 47168 - "Get Free Debt Advice First" ineligiblity page content checks
     * @tests 47208 - AC5: Continue [No]
     * @tests 47176 - AC6: Continue [No]
     */
    test('Did not seek debt advice (Does not have lifetime annuity payment)', async ({
      pages,
    }) => {
      await pages.questions.definedContributionPage.selectOption('Yes');
      await pages.questions.definedContributionPage.submit();
      await pages.questions.terminallyIllPage.selectOption('No');
      await pages.questions.terminallyIllPage.submit();
      await pages.questions.annuityPage.selectOption('No');
      await pages.questions.annuityPage.submit();
      await pages.questions.missedPayments.selectOption('Yes');
      await pages.questions.missedPayments.submit();
      await pages.questions.debtAdvice.selectOption('No');
      await pages.questions.debtAdvice.submit();

      await expect(pages.ineligible.freeDebtAdvicePage.sectionTitle).toHaveText(
        pages.ineligible.freeDebtAdvicePage.data.title,
      );
    });
  });
});
