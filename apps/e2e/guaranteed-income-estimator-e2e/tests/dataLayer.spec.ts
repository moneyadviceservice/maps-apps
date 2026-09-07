import { expect, test } from 'lib/test.lib';

test.describe('Adobe Data Layer', () => {
  /**
   * @tests 47948 - Analytics event fires correctly (pageLoadReact)
   */
  test('pageLoadReact', async ({ page, app }) => {
    await app.goto();

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'guaranteed-income-estimator--estimate',
        pageTitle: 'Get a guaranteed income (annuity) | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
        url: 'http://localhost:4305/en/guaranteed-income-estimator',
      },
      tool: {
        stepName: 'Estimate',
        toolCategory: '',
        toolName: 'Guaranteed Income Estimator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 47949 - Analytics event fires correctly (toolStart)
   */
  test('Tool Start', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'guaranteed-income-estimator--estimate',
        pageTitle: 'Get a guaranteed income (annuity) | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
        url: 'http://localhost:4305/en/guaranteed-income-estimator',
      },
      tool: {
        stepName: 'Estimate',
        toolCategory: '',
        toolName: 'Guaranteed Income Estimator',
        toolStep: '1',
      },
    });

    await app.ageField.fill('56');

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
   * @tests 47950 - Analytics event fires correctly (toolInteraction)
   */
  test('Tool Interaction', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'How much is your pension currently worth?',
        reactCompType: 'MoneyInput',
        stepName: 'Estimate',
        toolName: 'Guaranteed Income Estimator',
        toolStep: '1',
      },
    });

    await app.ageField.fill('56');

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolInteraction' },
      { count: 2 },
    );

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'What age do you want the income to start?',
        reactCompType: 'NumberInput',
        stepName: 'Estimate',
        toolName: 'Guaranteed Income Estimator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 47951 - Analytics event fires correctly (toolCompletion)
   */
  test('Tool Completion', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('123');
    await app.ageField.fill('56');
    await app.submitButton.click();

    const completionEvent = {
      page: {
        pageName: 'guaranteed-income-estimator--results',
        pageTitle: 'Get a guaranteed income (annuity) | Pension Wise',
        lang: 'en',
        site: 'moneyhelper',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
      },
      tool: {
        toolName: 'Guaranteed Income Estimator',
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
   * @tests 47952 - Analytics event fires correctly (toolRestart)
   */
  test('Tool Restart', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('50000');
    await app.ageField.fill('55');
    await app.submitButton.click();
    await app.potField.fill('678');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolRestart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'guaranteed-income-estimator--results',
        pageTitle: 'Get a guaranteed income (annuity) | Pension Wise',
        pageType: 'tool page',
        site: 'moneyhelper',
        source: 'direct',
      },
      tool: {
        stepName: 'Your results',
        toolCategory: '',
        toolName: 'Guaranteed Income Estimator',
        toolStep: '2',
      },
    });
  });

  /**
   * @tests 47953 - Analytics event fires correctly (errorMessage)
   */
  test('Error Message', async ({ app, page }) => {
    await app.goto();
    await app.potField.fill('0');
    await app.submitButton.click();

    await expect(page).toHaveDataLayerEvent({
      event: 'errorMessage',
      eventInfo: {
        toolName: 'Guaranteed Income Estimator',
        toolStep: '1',
        stepName: 'Estimate',
        errorDetails: [
          {
            reactCompType: 'MoneyInput',
            reactCompName: 'How much is your pension currently worth?',
            errorMessage: 'Amount must be at least £1',
          },
          {
            reactCompType: 'NumberInput',
            reactCompName: 'What age do you want the income to start?',
            errorMessage: 'Enter a figure',
          },
        ],
      },
    });
  });
});
