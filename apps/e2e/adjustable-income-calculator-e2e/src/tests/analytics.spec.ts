import { expect, test } from '@lib/test.lib';

test.describe('Adobe Data Layer', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 50979 - Analytics event fires correctly (pageLoadReact)
   */
  test('pageLoadReact', async ({ page, adjustableIncomePage }) => {
    await adjustableIncomePage.goto();

    await expect(page).toHavePartialDataLayerEvent({
      event: 'pageLoadReact',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'adjustable-income-estimator--estimate',
        pageTitle: 'Get an adjustable income | Pension Wise',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Estimate',
        toolCategory: '',
        toolName: 'Adjustable Income Estimator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 47841 - Analytics event fires correctly (toolStart)
   */
  test('Tool Start', async ({ adjustableIncomePage, page }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('123');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolStart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'adjustable-income-estimator--estimate',
        pageTitle: 'Get an adjustable income | Pension Wise',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Estimate',
        toolCategory: '',
        toolName: 'Adjustable Income Estimator',
        toolStep: '1',
      },
    });

    await adjustableIncomePage.ageInput.fill('56');

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
   * @tests 47842 - Analytics event fires correctly (toolInteraction)
   */
  test('Tool Interaction', async ({ adjustableIncomePage, page }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('123');

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'How much is your pension currently worth?',
        reactCompType: 'MoneyInput',
        stepName: 'Estimate',
        toolName: 'Adjustable Income Estimator',
        toolStep: '1',
      },
    });

    await adjustableIncomePage.ageInput.fill('56');

    await expect(page).toHavePartialDataLayerEvent(
      { event: 'toolInteraction' },
      { count: 2 },
    );

    await expect(page).toHaveDataLayerEvent({
      event: 'toolInteraction',
      eventInfo: {
        reactCompName: 'What age do you want to start taking money?',
        reactCompType: 'NumberInput',
        stepName: 'Estimate',
        toolName: 'Adjustable Income Estimator',
        toolStep: '1',
      },
    });
  });

  /**
   * @tests 47843 - Analytics event fires correctly (toolCompletion)
   */
  test('Tool Completion', async ({ adjustableIncomePage, page }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('123');
    await adjustableIncomePage.ageInput.fill('56');
    await adjustableIncomePage.submitButton.click();

    const completionEvent = {
      page: {
        pageName: 'adjustable-income-estimator--results',
        pageTitle: 'Get an adjustable income | Pension Wise',
        lang: 'en',
        pageType: 'tool page',
        source: 'direct',
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
      },
      tool: {
        toolName: 'Adjustable Income Estimator',
        toolStep: '2',
        stepName: 'Your results',
        toolCategory: '',
      },
      event: 'toolCompletion',
    };

    await expect(page).toHavePartialDataLayerEvent(completionEvent, {
      count: 1,
    });

    await adjustableIncomePage.submitButton.click();
    await expect(page).toHavePartialDataLayerEvent(completionEvent, {
      count: 2,
    });
  });

  /**
   * @tests 47844 - Analytics event fires correctly (toolRestart)
   */
  test('Tool Restart', async ({ adjustableIncomePage, page }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('50000');
    await adjustableIncomePage.ageInput.fill('56');
    await adjustableIncomePage.submitButton.click();
    await adjustableIncomePage.potInput.fill('678');

    await expect(page).toHavePartialDataLayerEvent({
      event: 'toolRestart',
      page: {
        categoryL1: 'Pensions & retirement',
        categoryL2: 'Taking your pension',
        lang: 'en',
        pageName: 'adjustable-income-estimator--results',
        pageTitle: 'Get an adjustable income | Pension Wise',
        pageType: 'tool page',
        source: 'direct',
      },
      tool: {
        stepName: 'Your results',
        toolCategory: '',
        toolName: 'Adjustable Income Estimator',
        toolStep: '2',
      },
    });
  });

  /**
   * @tests 47845 - Analytics event fires correctly (errorMessage)
   */
  test('Error Message', async ({ adjustableIncomePage, page }) => {
    await adjustableIncomePage.goto();
    await adjustableIncomePage.potInput.fill('0');
    await adjustableIncomePage.submitButton.click();

    await expect(page).toHaveDataLayerEvent({
      event: 'errorMessage',
      eventInfo: {
        errorDetails: [
          {
            errorMessage: 'Amount must be at least £1',
            reactCompName: 'How much is your pension currently worth?',
            reactCompType: 'MoneyInput',
          },
        ],
        stepName: 'Estimate',
        toolName: 'Adjustable Income Estimator',
        toolStep: '1',
      },
    });
  });
});
