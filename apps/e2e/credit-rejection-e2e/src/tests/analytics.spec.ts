import { getExpectedEvent } from '@data/analytics.data';
import { expect, test } from '@lib/test.lib';

/**
 * Note:
 *
 * This test migration to Playwright is an MVP
 * The abstractions like page object model do not follow the usual conventions
 * for a questionnaire application, for example: debt-advice-locator
 *
 * A test regarding a bug check has been removed since it's from 2025.
 */

const locales = ['en', 'cy'] as const;
type AnalyticEventId = keyof ReturnType<typeof getExpectedEvent>;

test.describe('Analytics (adobeDataLayer)', () => {
  test.beforeEach(async ({ setCookieControl, page }) => {
    await setCookieControl();
    await page.goto('/en/');
  });

  test('pageLoadReact', async ({ page }) => {
    const urls = [
      'question-1',
      'question-2?q-1=1&score-q-1=0',
      'question-3?q-1=1&q-2=1',
      'question-4?q-1=1&q-2=1&q-3=1',
      'question-5?q-1=1&q-2=1&q-3=1&q-4=1',
      'question-6?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1',
      'question-7?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0',
      'question-8?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0',
      'change-options?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1',
      'results?q-1=1&q-2=1&q-3=1&q-4=1&q-5=1&q-6=0&q-7=0&q-8=1',
    ] as AnalyticEventId[];

    for await (const locale of locales) {
      for await (const url of urls) {
        const expectedEventData = getExpectedEvent(locale)[url];

        await page.goto(`/${locale}/${url}`);

        await expect(page).toHavePartialDataLayerEvent({
          event: 'pageLoadReact',
          ...expectedEventData,
        });
      }
    }
  });

  test('toolStart', async ({ page }) => {
    for await (const locale of locales) {
      const expectedEventData = getExpectedEvent(locale)['question-1'];

      await page.goto(`/${locale}/question-1`);

      await expect(page).toHavePartialDataLayerEvent({
        event: 'toolStart',
        ...expectedEventData,
      });
    }
  });

  test('toolCompletion', async ({ page }) => {
    for await (const locale of locales) {
      const completedJourneyUrl =
        'results?q-1=1&score-q-1=0&q-2=1&score-q-2=0&q-3=2&score-q-3=0&q-4=1&score-q-4=0&q-5=0&score-q-5=1&q-6=0&score-q-6=0&q-7=0&score-q-7=0&q-8=0&score-q-8=0';

      const expectedEventData = getExpectedEvent(locale)[completedJourneyUrl];

      await page.goto(`/${locale}/${completedJourneyUrl}`);

      await expect(page).toHavePartialDataLayerEvent({
        event: 'toolCompletion',
        ...expectedEventData,
      });

      await expect(page).toHaveNoDataLayerEvent({ event: 'toolRestart' });
    }
  });

  test('toolRestart', async ({ page }) => {
    for await (const locale of locales) {
      const restartJourney = 'question-1?restart=true';

      const expectedEventData = getExpectedEvent(locale)[restartJourney];

      await page.goto(`/${locale}/${restartJourney}`);

      await expect(page).toHavePartialDataLayerEvent({
        event: 'toolRestart',
        ...expectedEventData,
      });

      await expect(page).toHaveNoDataLayerEvent({ event: 'toolCompletion' });
    }
  });

  test('errorMessage', async ({ page }) => {
    for await (const locale of locales) {
      const errorJourney = 'question-3?q-1=1&q-2=1&error=q-3';

      const expectedEventData = getExpectedEvent(locale)[errorJourney];

      await page.goto(`/${locale}/${errorJourney}`);

      await expect(page).toHavePartialDataLayerEvent({
        event: 'pageLoadReact',
        ...expectedEventData,
      });
    }
  });

  /**
   * This test will fail when the errorMessage event is added.
   * Please write a valid automated test and remove the other test above.
   */
  test('errorMessage - future proof', async ({ page, questionPage }) => {
    await page.goto('/');
    await questionPage.continueButton.click();

    await expect(questionPage.errorContainer).toBeVisible();
    await expect(page).toHaveNoDataLayerEvent({ event: 'errorMessage' });
  });
});
