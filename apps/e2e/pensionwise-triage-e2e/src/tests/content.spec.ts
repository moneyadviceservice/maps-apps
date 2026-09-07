import { IneligibilityPage } from 'pages/ineligible/ineligible.page';
import { QuestionPage } from 'pages/question/question.page';
import { TransitionalPage } from 'pages/transitional/transitional.page';
import { expect, test } from '@lib/test.lib';

test.describe('Content', () => {
  test.describe('Ineligible pages', () => {
    /**
     * @tests 47264 - Content checks
     * @tests 47161 - Remove "online" from pages
     */
    test('Under 50', async ({ pages }) => {
      const { under50Page } = pages.ineligible;
      await under50Page.goto();

      await expect(under50Page.pageTitle).toHaveText(
        IneligibilityPage.EXPECTED_PAGE_TITLE,
      );

      await expect(under50Page.sectionTitle).toHaveText(under50Page.data.title);
    });

    /**
     * @tests 47256 - Content checks
     * @tests 47161 - Remove "online" from pages

     */
    test('Over 75', async ({ pages }) => {
      const { over75Page } = pages.ineligible;
      await over75Page.goto();

      await expect(over75Page.pageTitle).toHaveText(
        IneligibilityPage.EXPECTED_PAGE_TITLE,
      );

      await expect(over75Page.sectionTitle).toHaveText(over75Page.data.title);
    });

    /**
     * @tests 47237 - 'Call us free on 0800 011 0397' link in the Q2 ineligibility content
     */
    test('Validate telephone link protocol and format', async ({ pages }) => {
      const { over75Page } = pages.ineligible;
      await over75Page.goto();

      const phoneLink = over75Page.phoneLink;

      await expect(phoneLink).toBeVisible();
      await expect(phoneLink).toHaveAttribute('href', 'tel:08001383944');
    });

    /**
     * @tests 47240 - Content checks
     * @tests 47161 - Remove "online" from pages
     */
    test('Does not have DC pension', async ({ pages }) => {
      const { noDCPage } = pages.ineligible;
      await noDCPage.goto();

      await expect(noDCPage.pageTitle).toHaveText(
        IneligibilityPage.EXPECTED_PAGE_TITLE,
      );

      await expect(noDCPage.sectionTitle).toHaveText(noDCPage.data.title);
    });

    /**
     * @tests 47218 - Content checks
     * @tests 47161 - Remove "online" from pages
     */
    test('Living with terminal illnesss', async ({ pages }) => {
      const { terminallyIllConfirmationPage } = pages.ineligible;
      await terminallyIllConfirmationPage.goto();

      await expect(terminallyIllConfirmationPage.pageTitle).toHaveText(
        IneligibilityPage.EXPECTED_PAGE_TITLE,
      );

      await expect(terminallyIllConfirmationPage.sectionTitle).toHaveText(
        terminallyIllConfirmationPage.data.title,
      );
    });

    /**
     * @tests 47168 - Content checks
     * @tests 47161 - Remove "online" from pages
     */
    test('Get debt advice first', async ({ pages }) => {
      const { freeDebtAdvicePage } = pages.ineligible;
      await freeDebtAdvicePage.goto();

      await expect(freeDebtAdvicePage.pageTitle).toHaveText(
        IneligibilityPage.EXPECTED_PAGE_TITLE,
      );

      await expect(freeDebtAdvicePage.sectionTitle).toHaveText(
        freeDebtAdvicePage.data.title,
      );
    });
  });

  test.describe('Question pages', () => {
    /**
     * @tests 47286 - Content checks
     * @tests 47160 - Remove "online" from pages
     */
    test('Question 1: How old are you?', async ({ pages }) => {
      const { agePage } = pages.questions;
      await agePage.goto();

      await expect(agePage.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(agePage.radioOptions).toHaveCount(
        agePage.data.options.length,
      );

      for (const option of agePage.data.options) {
        await expect(agePage.optionRadio(option)).toBeVisible();
      }

      await expect(agePage.accordionHeader).toHaveText(
        agePage.data.accordion?.title ?? '',
      );

      await expect(agePage.accordionContent).toHaveText(
        agePage.data.accordion?.description ?? '',
      );
    });

    /**
     * @tests 47252 - Content checks
     * @tests 47160 - Remove "online" from pages
     * @tests 47236 - 'Find out your pension type' link in the Q2 ineligibility content
     */
    test('Question 2: Do you have a UK-based DC pension', async ({ pages }) => {
      const { definedContributionPage } = pages.questions;
      await definedContributionPage.goto();

      await expect(definedContributionPage.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(definedContributionPage.radioOptions).toHaveCount(
        definedContributionPage.data.options.length,
      );

      for (const option of definedContributionPage.data.options) {
        await expect(definedContributionPage.optionRadio(option)).toBeVisible();
      }

      await expect(definedContributionPage.accordionHeader).toHaveText(
        definedContributionPage.data.accordion?.title ?? '',
      );

      await expect(definedContributionPage.accordionContent).toHaveText(
        definedContributionPage.data.accordion?.description ?? '',
      );

      await expect(definedContributionPage.link).toHaveAttribute(
        'href',
        'https://tool.moneyhelper.org.uk/en/pension-type/question-1',
      );
    });

    /**
     * @tests 47233 - Content checks
     * @tests 47160 - Remove "online" from pages
     */

    test('Question 3: Have you been diagnosed with a terminal illness?', async ({
      pages,
    }) => {
      const { terminallyIllPage } = pages.questions;
      await terminallyIllPage.goto();

      await expect(terminallyIllPage.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(terminallyIllPage.radioOptions).toHaveCount(
        terminallyIllPage.data.options.length,
      );

      for (const option of terminallyIllPage.data.options) {
        await expect(terminallyIllPage.optionRadio(option)).toBeVisible();
      }

      await expect(terminallyIllPage.accordionHeader).toHaveText(
        terminallyIllPage.data.accordion?.title ?? '',
      );

      await expect(terminallyIllPage.accordionContent).toHaveText(
        terminallyIllPage.data.accordion?.description ?? '',
      );
    });

    /**
     * @tests 47212 - Content checks
     * @tests 47160 - Remove "online" from pages
     */

    test('Question 4: Have you already got a lifetime annuity in payment?', async ({
      pages,
    }) => {
      const { annuityPage } = pages.questions;
      await annuityPage.goto();

      await expect(annuityPage.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(annuityPage.radioOptions).toHaveCount(
        annuityPage.data.options.length,
      );

      for (const option of annuityPage.data.options) {
        await expect(annuityPage.optionRadio(option)).toBeVisible();
      }

      await expect(annuityPage.accordionHeader).toHaveText(
        annuityPage.data.accordion?.title ?? '',
      );

      await expect(annuityPage.accordionContent).toHaveText(
        annuityPage.data.accordion?.description ?? '',
      );
    });

    /**
     * @tests 47193 - Content checks
     * @tests 47160 - Remove "online" from pages
     */

    test('Question 5: Have you missed more than one payment?', async ({
      pages,
    }) => {
      const { missedPayments } = pages.questions;
      await missedPayments.goto();

      await expect(missedPayments.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(missedPayments.radioOptions).toHaveCount(
        missedPayments.data.options.length,
      );

      for (const option of missedPayments.data.options) {
        await expect(missedPayments.optionRadio(option)).toBeVisible();
      }

      await expect(missedPayments.accordionHeader).toHaveText(
        missedPayments.data.accordion?.title ?? '',
      );

      await expect(missedPayments.accordionContent).toHaveText(
        missedPayments.data.accordion?.description ?? '',
      );
    });

    /**
     * @tests 47181 - Content checks
     * @tests 47160 - Remove "online" from pages
     */

    test('Question 6: Have you received debt advice?', async ({ pages }) => {
      const { debtAdvice } = pages.questions;
      await debtAdvice.goto();

      await expect(debtAdvice.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );

      await expect(debtAdvice.radioOptions).toHaveCount(
        debtAdvice.data.options.length,
      );

      for (const option of debtAdvice.data.options) {
        await expect(debtAdvice.optionRadio(option)).toBeVisible();
      }

      await expect(debtAdvice.accordionHeader).toHaveText(
        debtAdvice.data.accordion?.title ?? '',
      );

      await expect(debtAdvice.accordionContent).toHaveText(
        debtAdvice.data.accordion?.description ?? '',
      );
    });
  });

  test.describe('Transitional pages', () => {
    /**
     * @tests 47271 - Content checks
     * @tests 47161 - Remove "online" from pages
     */

    test('If your 50 to 54', async ({ pages }) => {
      const { fiftyToFiftyFourPage } = pages.transitional;
      await fiftyToFiftyFourPage.goto();

      await expect(fiftyToFiftyFourPage.pageTitle).toHaveText(
        QuestionPage.EXPECTED_PAGE_TITLE,
      );
    });

    /**
     * @tests 00000 - Content checks
     * @tests 47161 - Remove "online" from pages
     * @tests 47199 - AC2: "If you have a lifetime annuity payment" transitional page content checks
     */
    test('If you have a lifetime annuity payment', async ({ pages }) => {
      const { lifetimeAnnuityConfirmationPage } = pages.transitional;
      await lifetimeAnnuityConfirmationPage.goto();

      await expect(
        pages.transitional.lifetimeAnnuityConfirmationPage.pageTitle,
      ).toHaveText(TransitionalPage.EXPECTED_PAGE_TITLE);
    });
  });
});
