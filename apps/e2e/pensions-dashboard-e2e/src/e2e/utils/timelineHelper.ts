import { expect, Page } from '@maps/playwright';

import { RequestHelper } from './request';

export class TimelineHelper {
  /**
   * Verify the timeline rows in the UI match the supplied timeline JSON.
   * - Expects a row locator with data-testid="timeline-row"
   * - Verifies year, monthly total (2 dp) and annual total (no dp)
   * - Optionally verifies the "View pensions (N)" link text where present
   */
  static async verifyTimelineValues(page: Page, request: any) {
    const proceedToTimeline = page.getByTestId('timeline-link');
    await proceedToTimeline.waitFor({ state: 'visible' });
    await proceedToTimeline.click();
    await page.getByTestId('timeline-key').waitFor({ state: 'visible' });

    const timelineResponse = await RequestHelper.getPensionTimeline(
      page,
      request,
    );
    const timelineJson = await timelineResponse.json();
    const years = timelineJson?.years ?? [];
    for (const yearData of years) {
      const year = yearData.year;
      const yearLi = page.locator(
        `li:has([data-testid="timeline-year-${year}"])`,
      );
      await yearLi.waitFor({ state: 'visible' });
      const monthlyRow = yearLi.locator(
        '[data-testid="timeline-year-monthly"]',
      );
      const annualRow = yearLi.locator('[data-testid="timeline-year-annual"]');

      const yearText = `Year: ${yearData.year}`;
      const monthlyText = `£${Number(yearData.monthlyTotal).toLocaleString(
        'en-GB',
        {
          minimumFractionDigits:
            Number(yearData.monthlyTotal) % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        },
      )} a month`;
      const annualText = `£${Number(yearData.annualTotal).toLocaleString(
        'en-GB',
      )} a year`;

      const yearRowDisplayedText = await yearLi.innerText();
      const monthlyRowDisplayedText = `£${await monthlyRow.innerText()} a month`;
      const annualRowDisplayedText = `£${await annualRow.innerText()} a year`;

      expect(yearRowDisplayedText).toContain(yearText);
      expect(monthlyRowDisplayedText).toContain(monthlyText);
      expect(annualRowDisplayedText).toContain(annualText);

      const expectedCount = (yearData.arrangements ?? []).length;
      if (expectedCount > 0) {
        const viewLocator = yearLi.getByText(/View pensions/i);
        if ((await viewLocator.count()) > 0) {
          const viewText = await viewLocator.first().innerText();
          expect(viewText).toContain(`View pensions (${expectedCount})`);
        }
      }
    }
  }
}
