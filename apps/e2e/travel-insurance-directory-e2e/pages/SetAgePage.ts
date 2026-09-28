import { type Locator } from '@playwright/test';

import { BasePage } from './basePage';

type Region = 'Europe' | 'WorldwideExcUSA' | 'Worldwide';
type SingleOrAnnual = 'Single' | 'Multi';

const regionMap: Record<Region, string> = {
  Europe: 'uk_and_europe',
  WorldwideExcUSA: 'worldwide_excluding_us_canada',
  Worldwide: 'worldwide_including_us_canada',
};

const SingleOrAnnualMap: Record<SingleOrAnnual, string> = {
  Single: 'single_trip',
  Multi: 'annual_multi_trip',
};

export class SetAgePage extends BasePage {
  //selectors
  private readonly thirtyDaysLandSelectTestId =
    'select-input-up_to_30_days_land';
  private readonly thirtyDaysCruiseSelectTestId =
    'select-input-up_to_30_days_cruise';
  private readonly ninetyDaysLandSelectTestId =
    'select-input-up_to_90_days_land';
  private readonly ninetyDaysCruiseSelectTestId =
    'select-input-up_to_90_days_cruise';
  private readonly ninetyPlusLandSelectTestId =
    'select-input-over_90_days_land';
  private readonly ninetyPlusCruiseSelectTestId =
    'select-input-over_90_days_cruise';

  private readonly errorSummaryHeadingTestId = 'error-summary-heading';
  private readonly errorSummaryListElementTestId = 'list-element';

  //locators

  upto30DaysLandSelect(): Locator {
    return this.page.getByTestId(this.thirtyDaysLandSelectTestId);
  }

  upto30DaysCruiseSelect(): Locator {
    return this.page.getByTestId(this.thirtyDaysCruiseSelectTestId);
  }

  upto90DaysLandSelect(): Locator {
    return this.page.getByTestId(this.ninetyDaysLandSelectTestId);
  }

  upto90DaysCruiseSelect(): Locator {
    return this.page.getByTestId(this.ninetyDaysCruiseSelectTestId);
  }

  over90DaysLandSelect(): Locator {
    return this.page.getByTestId(this.ninetyPlusLandSelectTestId);
  }

  over90DaysCruiseSelect(): Locator {
    return this.page.getByTestId(this.ninetyPlusCruiseSelectTestId);
  }

  errorSummary(): Locator {
    return this.page.getByTestId(this.errorSummaryHeadingTestId);
  }

  errorSummaryListElement(): Locator {
    return this.page
      .getByTestId(this.errorSummaryListElementTestId)
      .locator('li');
  }

  //actions
  /**
   * Navigates to the Trip Cover page based on the specified region and trip duration type.
   * @param region - The target geographic region.
   * @param singleOrAnnual - Specifies if the policy is single trip or annual multi-trip.
   * @returns A promise that resolves when navigation is complete.
   */
  async gotoTripCover(
    region: Region,
    singleOrAnnual: SingleOrAnnual,
  ): Promise<void> {
    const firmId = await this.resolveFirmId();
    const urlRegion = regionMap[region];
    const urlSingleOrAnnual = SingleOrAnnualMap[singleOrAnnual];

    await this.page.goto(
      `/account/trip-cover/${firmId}/${urlRegion}/${urlSingleOrAnnual}`,
    );
  }

  /**
   * Selects a specific age option inside a provided dropdown locator.
   * @param selectInput - The Playwright Locator element for the select dropdown.
   * @param value - The value/option to select.
   * @returns A promise that resolves when the option is selected.
   */
  async setAgeSelect(selectInput: Locator, value: string): Promise<void> {
    await selectInput.selectOption(value);
  }

  /**
   * Sets the same age tier option across all trip duration and travel type dropdowns
   * (Land and Cruise options for up to 30 days, up to 90 days, and over 90 days).
   * @param value - The option value to apply to all age dropdowns.
   * @returns A promise that resolves when all selections are complete.
   */
  async setAgeSelectAll(value: string): Promise<void> {
    await this.upto30DaysLandSelect().selectOption(value);
    await this.upto30DaysCruiseSelect().selectOption(value);

    await this.upto90DaysLandSelect().selectOption(value);
    await this.upto90DaysCruiseSelect().selectOption(value);

    await this.over90DaysLandSelect().selectOption(value);
    await this.over90DaysCruiseSelect().selectOption(value);
  }
}
