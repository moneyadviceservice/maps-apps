import { analytics } from '@data/analytics.data';
import { expect, test } from '@lib/test.lib';
import {
  HaveYouBeenRefusedCredit,
  HowGoodIsYourCreditScore,
  HowLongToWait,
  HowQuicklyToRepay,
  MoneyPurpose,
} from '@utils/answers.util';

test.describe('analytics', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 59578 - Analytics - pageLoadReact
   * @tests 59583 - Analytics - Localisation
   */
  test('pageLoadReact', async ({ page }) => {
    const {
      question1,
      question2,
      question3,
      question4,
      question5,
      question6,
      changeOptions,
      results,
      welshQuestion1,
    } = analytics.pageLoadReact;

    await page.goto('/en/question-1');
    await expect(page).toHavePartialDataLayerEvent(question1);

    await page.goto('/en/question-2?q-1=£5000');
    await expect(page).toHavePartialDataLayerEvent(question2);

    await page.goto('/en/question-3?q-1=£5000&q-2=1');
    await expect(page).toHavePartialDataLayerEvent(question3);

    await page.goto('/en/question-4?q-1=£5000&q-2=1&q-3=0');
    await expect(page).toHavePartialDataLayerEvent(question4);

    await page.goto('/en/question-5?q-1=£5000&q-2=1&q-3=0&q-4=1');
    await expect(page).toHavePartialDataLayerEvent(question5);

    await page.goto('/en/question-6?q-1=£5000&q-2=1&q-3=0&q-4=1&q-5=1');
    await expect(page).toHavePartialDataLayerEvent(question6);

    await page.goto(
      '/en/change-options?q-1=£5000&q-2=1&q-3=0&q-4=1&q-5=1&q-6=1',
    );
    await expect(page).toHavePartialDataLayerEvent(changeOptions);

    await page.goto('/en/results?q-1=£5000&q-2=1&q-3=0&q-4=1&q-5=1&q-6=1');
    await expect(page).toHavePartialDataLayerEvent(results);

    await page.goto('/cy/question-1');
    await expect(page).toHavePartialDataLayerEvent(welshQuestion1);
  });

  /**
   * @tests 59579 - Analytics - toolStart
   */
  test('toolStart', async ({ page }) => {
    await page.goto('/en/question-1');
    await expect(page).toHavePartialDataLayerEvent({
      page: {
        pageName: 'credit-options--question-1',
        pageTitle: 'How much do you need to borrow?',
        lang: 'en',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
      },
      tool: {
        toolName: 'Credit Options',
        toolStep: '1',
        stepName: 'How much do you need to borrow?',
        toolCategory: '',
      },
      event: 'toolStart',
    });
  });

  /**
   * @tests 59580 - Analytics - toolCompletion
   */
  test('toolCompletion', async ({ page, pages }) => {
    await pages.resultsPage.goto({
      borrowAmount: 47600,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AWeekOrMore,
      howQuicklyCanYouRepay: HowQuicklyToRepay.OneToTwoYears,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.Yes,
      whatsYourCreditScore: HowGoodIsYourCreditScore.Poor,
    });

    await expect(page).toHavePartialDataLayerEvent({
      page: {
        pageName: 'credit-options--results',
        pageTitle: 'Borrowing options to consider',
        lang: 'en',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
      },
      tool: {
        toolName: 'Credit Options',
        toolCategory: '',
        toolStep: 8,
        stepName: 'Borrowing options to consider',
      },
      event: 'toolCompletion',
    });
  });

  /**
   * @tests 59581 - Analytics - toolRestart
   */
  test('toolRestart', async ({ page, pages }) => {
    await pages.resultsPage.goto({
      borrowAmount: 47600,
      whatsTheMoneyFor: MoneyPurpose.BuyACar,
      howLongCouldYouWait: HowLongToWait.AWeekOrMore,
      howQuicklyCanYouRepay: HowQuicklyToRepay.OneToTwoYears,
      haveYouBeenRefusedCredit: HaveYouBeenRefusedCredit.Yes,
      whatsYourCreditScore: HowGoodIsYourCreditScore.Poor,
    });

    await pages.resultsPage.startAgainButton.click();

    await expect(page).toHavePartialDataLayerEvent({
      page: {
        pageName: 'credit-options--question-1',
        pageTitle: 'How much do you need to borrow?',
        lang: 'en',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Everyday money',
        categoryL2: 'Credit',
      },
      tool: {
        toolName: 'Credit Options',
        toolStep: '1',
        stepName: 'How much do you need to borrow?',
        toolCategory: '',
      },
      event: 'toolRestart',
    });
  });

  /**
   * @tests 59582 - Analytics - errorMessage
   *
   * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   * @bug 59639 - Once this bug has been resolved, delete this line and remove the .fail
   * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   */
  test.fail('errorMessage', async ({ page, pages }) => {
    await pages.startPage.goto();
    await pages.startPage.continueButton.click();

    await expect(page).toHavePartialDataLayerEvent({
      event: 'errorMessage',
      // More information required once the bug has been resolved.
    });
  });
});
