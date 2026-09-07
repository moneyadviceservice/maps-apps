import { expect, test } from 'lib/test.lib';

test.describe('Adobe Data Layer', () => {
  /**
   * @tests 47613 - Analytics event fires correctly (pageLoadReact)
   */
  test('make sure pageLoadReact fires', async ({ page, app }) => {
    await app.goto();

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        pageName: 'leave-pot-untouched-calculator--estimate',
        pageTitle: 'Leave your pot untouched | Pension Wise',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
      },
      tool: {
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '1',
        stepName: 'Estimate',
        toolCategory: '',
      },
    });
  });

  /**
   * @tests 47617 - Analytics event fires correctly (toolInteraction)
   */
  test('make sure tool interaction fires', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'How much is your pension currently worth?',
        reactCompType: 'MoneyInput',
        stepName: 'Estimate',
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '1',
      },
    });

    await app.monthlyField.fill('456');

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolInteraction' },
      { count: 2 },
    );

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'How much can you pay in each month?',
        reactCompType: 'MoneyInput',
        stepName: 'Estimate',
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 47615 - Analytics event fires correctly (toolStart)
   */
  test('make sure tool start fires', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'leave-pot-untouched-calculator--estimate',
        pageTitle: 'Leave your pot untouched | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },

      tool: {
        stepName: 'Estimate',
        toolCategory: '',
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '1',
      },
    });

    await app.monthlyField.fill('456');
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
   * @tests 47622 - Analytics event fires correctly (toolRestart)
   */
  test('make sure tool restart fires', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('50000');
    await app.monthlyField.fill('1200');
    await app.submitButton.click();
    await app.potField.fill('678');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolRestart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'leave-pot-untouched-calculator--results',
        pageTitle: 'Leave your pot untouched | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'Your results',
        toolCategory: '',
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '2',
      },
    });
  });

  /**
   * @tests 47620 - Analytics event fires correctly (toolCompletion)
   */
  test('make sure tool completion fires', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');
    await app.monthlyField.fill('456');
    await app.submitButton.click();

    const completionEvent = {
      page: {
        pageName: 'leave-pot-untouched-calculator--results',
        pageTitle: 'Leave your pot untouched | Pension Wise',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
      },
      tool: {
        toolName: 'Leave Pot Untouched Calculator',
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
   * @tests 47623 - Analytics event fires correctly (errorMessage)
   */
  test('make sure tool error message fires', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('0');
    await app.submitButton.click();

    await expect(page).toHaveDataLayerEvent({
      event: 'errorMessage',
      eventInfo: {
        toolName: 'Leave Pot Untouched Calculator',
        toolStep: '1',
        stepName: 'Estimate',
        errorDetails: [
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'How much is your pension currently worth?',
            errorMessage: 'Amount must be at least £1',
          },
        ],
      },
    });
  });
});
