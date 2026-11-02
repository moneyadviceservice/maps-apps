import { addMonths, format } from 'date-fns';
import { analyticEvents } from '@data/analytics.data';
import { expect, test } from '@lib/test.lib';

const currentDate = new Date();
const futureDate = addMonths(currentDate, 6);
const urlDate = format(futureDate, 'dd-MM-yyyy');

test.describe('adobeDataLayer', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /**
   * @tests 58773 - pageLoadReact
   */
  test('pageLoadReact fires when loading the pages', async ({ app, page }) => {
    await app.goto();

    // Check there is a single one.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 1 },
    );

    // Check the exact page load react event.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.landingPage,
    );

    await app.fillDueDateAndContinue(futureDate);

    // This resets the data layer.
    await app.goto(`/en/1?dueDate=${urlDate}`);

    // Check there's 1, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.weeks1to12,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 1 },
    );

    await app.tabs.weeks13to27.click();

    // Check there's 2 now, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.weeks13to27,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 2 },
    );

    await app.tabs.weeks28to41.click();

    // Check there's 3 now, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.weeks28to41,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 3 },
    );

    await app.tabs.months0to6.click();

    // Check there's 4 now, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.months0to6,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 4 },
    );

    await app.tabs.months7to12.click();

    // Check there's 5 now, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.months7to12,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 5 },
    );

    await app.tabs.years1to2.click();

    // Check there's 6 now, and check the actual event is right.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.years1to2,
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.pageLoadReact.allEvents,
      { count: 6 },
    );
  });

  /**
   * @tests 58776 - toolCompletion
   */
  test('toolCompletion fires when on completion', async ({ app, page }) => {
    await app.goto(`/en/5?dueDate=${urlDate}`);
    await app.tabs.years1to2.click();

    // Check there's only 1 toolCompletion event
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.toolCompletion.allEvents,
      { count: 1 },
    );

    // Check the data exactly.
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.toolCompletion.years1to2,
    );

    await app.tabs.months7to12.click();
    await app.tabs.years1to2.click();

    // Check there's still only 1 event
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.toolCompletion.allEvents,
      { count: 1 },
    );
  });

  /**
   * @tests 58775 - toolStart
   */
  test('toolStart fires when user continues', async ({ app, page }) => {
    await app.goto();
    await app.fillDueDateAndContinue(futureDate);

    // Check there's only 1 event
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.toolStart.allEvents,
      { count: 1 },
    );
    await expect(page).toHavePartialDataLayerEvent(
      analyticEvents.toolStart.fullEvent,
    );
  });
});
