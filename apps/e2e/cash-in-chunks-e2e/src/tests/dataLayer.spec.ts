import { expect, test } from '@lib/test.lib';

test.describe('Adobe Data Layer', () => {
  test.beforeEach(async ({ app, setCookieControl }) => {
    await setCookieControl();
    await app.goto();
  });

  /**
   * @tests 48367 - Analytics event fires correctly (pageLoadReact)
   */
  test('pageLoadReact', async ({ page }) => {
    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'take-cash-in-chunks-calculator',
        pageTitle: 'Take cash in chunks | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
        url: 'http://localhost:4307/en/cash-in-chunks',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 48368 - Analytics event fires correctly (toolStart)
   */
  test('Tool Start', async ({ app, page }) => {
    await app.potField.fill('123');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'take-cash-in-chunks-calculator',
        pageTitle: 'Take cash in chunks | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
        url: 'http://localhost:4307/en/cash-in-chunks',
      },
      tool: {
        stepName: 'Calculate',
        toolCategory: '',
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '1',
      },
    });

    await app.chunkField.fill('56');

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolInteraction' },
      { count: 2 },
    );

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolStart' },
      { count: 1 },
    );
  });

  /**
   * @tests 48369 - Analytics event fires correctly (toolInteraction)
   */
  test('Tool Interaction', async ({ app, page }) => {
    await app.potField.fill('123');

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'How much is your pension currently worth?',
        reactCompType: 'MoneyInput',
        stepName: 'Calculate',
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '1',
      },
    });

    await app.incomeField.fill('56,000');

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolInteraction' },
      { count: 2 },
    );

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'What is your yearly income?',
        reactCompType: 'MoneyInput',
        stepName: 'Calculate',
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 48370 - Analytics event fires correctly (toolCompletion)
   */
  test('Tool Completion', async ({ app, page }) => {
    await app.incomeField.fill('56,000');
    await app.potField.fill('25,000');
    await app.chunkField.fill('2,500');
    await app.submitButton.click();

    const completionEvent = {
      page: {
        pageName: 'take-cash-in-chunks-calculator--results',
        pageTitle: 'Take cash in chunks | Pension Wise',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
      },
      tool: {
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '2',
        stepName: 'Your results',
        toolCategory: '',
      },
      event: 'toolCompletion',
    };

    await expect(page).toHavePartialDataLayerEvent(completionEvent, {
      count: 1,
    });

    await app.submitButton.click();
    await expect(page).toHavePartialDataLayerEvent(completionEvent, {
      count: 2,
    });
  });

  /**
   * @tests 48371 - Analytics event fires correctly (toolRestart)
   */
  test('Tool Restart', async ({ app, page }) => {
    await app.incomeField.fill('56,000');
    await app.potField.fill('25,000');
    await app.chunkField.fill('2,500');
    await app.submitButton.click();
    await app.potField.fill('678,000');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolRestart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'take-cash-in-chunks-calculator--results',
        pageTitle: 'Take cash in chunks | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'Your results',
        toolCategory: '',
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '2',
      },
    });
  });

  /**
   * @tests 48372 - Analytics event fires correctly (errorMessage)
   */
  test('Error Message', async ({ app, page }) => {
    await app.submitButton.click();

    await expect(page).toHaveDataLayerEvent({
      event: 'errorMessage',
      eventInfo: {
        toolName: 'Take Cash in Chunks Calculator',
        toolStep: '1',
        stepName: 'Calculate',
        errorDetails: [
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'What is your yearly income?',
            errorMessage: 'Enter a figure',
          },
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'How much is your pension currently worth?',
            errorMessage: 'Enter a figure',
          },

          {
            reactCompType: 'MoneyInput',
            reactCompName:
              'How much do you want to take as your first cash chunk?',
            errorMessage: 'Enter a figure',
          },
        ],
      },
    });
  });
});
