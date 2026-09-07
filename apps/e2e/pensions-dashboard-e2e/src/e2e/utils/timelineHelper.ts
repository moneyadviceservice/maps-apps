import { expect, Page } from '@maps/playwright';

import { RequestHelper } from './request';
import commonHelpers from './commonHelpers';

export class TimelineHelper {
  private static async verifyTimelineRows(page: Page, years: any[]) {
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
      const formatCurrencyValue = (value: number): string => {
        return value.toLocaleString('en-GB', {
          minimumFractionDigits: value % 1 === 0 ? 0 : 2,
          maximumFractionDigits: 2,
        });
      };
      const monthlyText = `£${formatCurrencyValue(
        Number(yearData.monthlyTotal),
      )} a month`;
      const annualText = `£${formatCurrencyValue(
        Number(yearData.annualTotal),
      )} a year`;

      const yearRowDisplayedText = await yearLi.innerText();
      const monthlyRowDisplayedText = `${await monthlyRow.innerText()} a month`;
      const annualRowDisplayedText = `${await annualRow.innerText()} a year`;

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

  private static async switchTimelineToggle(
    page: Page,
    timelineType: 'legacy' | 'alternative',
  ) {
    const toggleRadio = page.getByTestId(
      `timeline-toggle-option-${timelineType}-label`,
    );
    if ((await toggleRadio.count()) === 0) {
      throw new Error(
        `Timeline toggle "${timelineType}" was not found for hasMultipleIncomeOptions flow.`,
      );
    }

    await toggleRadio.check();
    await expect(toggleRadio).toBeChecked();
  }

  private static async expectDefaultLegacyToggleSelected(page: Page) {
    const legacyToggle = page.getByTestId(
      'timeline-toggle-option-legacy-label',
    );
    if ((await legacyToggle.count()) === 0) {
      throw new Error('Timeline legacy toggle was not found.');
    }
    await expect(legacyToggle).toBeChecked();
  }

  private static getTimelineResponseByType(
    timelineResponses: any[],
    timelineType: 'legacy' | 'alternative',
  ) {
    const response = timelineResponses.find((res) =>
      res.url().includes(`type=${timelineType}`),
    );
    if (!response) {
      throw new Error(
        `Timeline response for type "${timelineType}" not found.`,
      );
    }
    return response;
  }

  static async verifyTimelineValues(
    page: Page,
    request: any,
    confirmedArrangements?: any[],
  ) {
    const proceedToTimeline = page.getByTestId('timeline-link');
    await proceedToTimeline.waitFor({ state: 'visible' });
    await proceedToTimeline.click();
    await page.getByTestId('timeline-key').waitFor({ state: 'visible' });

    const hasMultipleIncomeOptions = (confirmedArrangements ?? []).some(
      (arrangement: any) => arrangement?.hasMultipleIncomeOptions === true,
    );

    const timelineResponses = await RequestHelper.getPensionTimeline(
      page,
      request,
      hasMultipleIncomeOptions,
    );

    if (hasMultipleIncomeOptions) {
      const legacyResponse = this.getTimelineResponseByType(
        timelineResponses,
        'legacy',
      );
      const alternativeResponse = this.getTimelineResponseByType(
        timelineResponses,
        'alternative',
      );
      const legacyTimelineJson = await legacyResponse.json();
      const alternativeTimelineJson = await alternativeResponse.json();

      await this.expectDefaultLegacyToggleSelected(page);
      await expect(page).toHaveURL(/your-pensions-timeline\?income=legacy/);
      await this.verifyTimelineRows(page, legacyTimelineJson?.years ?? []);

      await this.switchTimelineToggle(page, 'alternative');
      await expect(page).toHaveURL(
        /your-pensions-timeline\?income=alternative/,
      );
      await this.verifyTimelineRows(page, alternativeTimelineJson?.years ?? []);
      return;
    }

    // Handle non-mcCloud and non-multiple timelines
    if (!timelineResponses || timelineResponses.length === 0) {
      throw new Error(
        'No timeline response received for non-multiple income timeline.',
      );
    }

    const timelineJson = await timelineResponses[0].json();
    if (!timelineJson?.years) {
      throw new Error(
        'Timeline response missing years data for non-multiple timeline.',
      );
    }

    await this.verifyTimelineRows(page, timelineJson.years);
    await commonHelpers.clickBackLink(page);
  }
}
