import { getExpectedEvent } from '@data/analytics.data';
import { expect, test } from '@lib/test.lib';
import { UrlUtils } from '@utils/url.util';

/**
 * Note:
 *
 * This test migration to Playwright is an MVP
 * The abstractions like page object model do not follow the usual conventions
 * for a questionnaire application, for example: debt-advice-locator
 */

const locales = ['en', 'cy'] as const;
type AnalyticEventId = keyof ReturnType<typeof getExpectedEvent>;

test.describe('analytics', () => {
  test.beforeEach(async ({ setCookieControl, page }) => {
    await setCookieControl();
    await page.goto('/');
  });

  test('pageLoadReact', async ({ page }) => {
    const urls = UrlUtils.generateUrls() as AnalyticEventId[];

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
        'results?q-1=2&score-q-1=0&q-2=1&score-q-2=0&q-3=3&score-q-3=2&q-4=0&score-q-4=3&q-5=0&score-q-5=2&q-6=2&score-q-6=2&q-7=1&score-q-7=2&q-8=0&score-q-8=3&q-9=2%2C3&score-q-9=2&q-10=1&score-q-10=2&q-11=0&score-q-11=2&q-14=4&score-q-14=2&q-15=3&score-q-15=2&q-16=3&score-q-16=1&q-17=1&score-q-17=2&q-18=2&score-q-18=2';

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
      const errorJourney = 'question-1?error=q-1';

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
