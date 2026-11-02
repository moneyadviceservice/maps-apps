import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class OpeningHoursPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Page load
  async waitForPageLoad(): Promise<void> {
    await this.page
      .getByRole('heading', { name: 'Opening hours', exact: true })
      .waitFor();
  }

  // Headings
  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: 'Opening hours',
      exact: true,
    });
  }

  get guidanceText(): Locator {
    return this.page.getByText(
      'Enter the opening hours for your principle place of business.',
      { exact: true },
    );
  }

  // Weekday fields
  get weekdayOpeningHour(): Locator {
    return this.page.getByTestId('opening_time_hours');
  }

  get weekdayOpeningMinute(): Locator {
    return this.page.getByTestId('opening_time_minutes');
  }

  get weekdayOpeningAmRadio(): Locator {
    return this.page.getByTestId('opening_time_am-label');
  }

  get weekdayOpeningPmRadio(): Locator {
    return this.page.getByTestId('opening_time_pm-label');
  }

  get weekdayClosingHour(): Locator {
    return this.page.getByTestId('closing_time_hours');
  }

  get weekdayClosingMinute(): Locator {
    return this.page.getByTestId('closing_time_minutes');
  }

  get weekdayClosingAmRadio(): Locator {
    return this.page.getByTestId('closing_time_am-label');
  }

  get weekdayClosingPmRadio(): Locator {
    return this.page.getByTestId('closing_time_pm-label');
  }

  // Weekend radio buttons
  get saturdayYes(): Locator {
    return this.page.locator('label[for="radio-saturday_opening-yes"]');
  }

  get saturdayNo(): Locator {
    return this.page.locator('label[for="radio-saturday_opening-no"]');
  }

  get sundayYes(): Locator {
    return this.page.locator('label[for="radio-sunday_opening-yes"]');
  }

  get sundayNo(): Locator {
    return this.page.locator('label[for="radio-sunday_opening-no"]');
  }

  // Weekend fields
  get saturdayOpeningHour(): Locator {
    return this.page.getByTestId('saturday_opening_time_hours');
  }

  get saturdayOpeningMinute(): Locator {
    return this.page.getByTestId('saturday_opening_time_minutes');
  }

  get saturdayOpeningAmRadio(): Locator {
    return this.page.getByTestId('saturday_opening_time_am-label');
  }

  get saturdayOpeningPmRadio(): Locator {
    return this.page.getByTestId('saturday_opening_time_pm-label');
  }

  get saturdayClosingHour(): Locator {
    return this.page.getByTestId('saturday_closing_time_hours');
  }

  get saturdayClosingMinute(): Locator {
    return this.page.getByTestId('saturday_closing_time_minutes');
  }

  get saturdayClosingAmRadio(): Locator {
    return this.page.getByTestId('saturday_closing_time_am-label');
  }

  get saturdayClosingPmRadio(): Locator {
    return this.page.getByTestId('saturday_closing_time_pm-label');
  }

  get sundayOpeningHour(): Locator {
    return this.page.getByTestId('sunday_opening_time_hours');
  }

  get sundayOpeningMinute(): Locator {
    return this.page.getByTestId('sunday_opening_time_minutes');
  }

  get sundayOpeningAmRadio(): Locator {
    return this.page.getByTestId('sunday_opening_time_am-label');
  }

  get sundayOpeningPmRadio(): Locator {
    return this.page.getByTestId('sunday_opening_time_pm-label');
  }

  get sundayClosingHour(): Locator {
    return this.page.getByTestId('sunday_closing_time_hours');
  }

  get sundayClosingMinute(): Locator {
    return this.page.getByTestId('sunday_closing_time_minutes');
  }

  get sundayClosingAmRadio(): Locator {
    return this.page.getByTestId('sunday_closing_time_am-label');
  }

  get sundayClosingPmRadio(): Locator {
    return this.page.getByTestId('sunday_closing_time_pm-label');
  }

  // Assertions
  async assertPageHeading(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async assertGuidanceText(): Promise<void> {
    await expect(this.guidanceText).toBeVisible();
  }

  async assertWeekdayFieldsVisible(): Promise<void> {
    await expect(this.weekdayOpeningHour).toBeVisible();
    await expect(this.weekdayOpeningMinute).toBeVisible();
    await expect(this.weekdayOpeningAmRadio).toBeVisible();
    await expect(this.weekdayOpeningPmRadio).toBeVisible();
    await expect(this.weekdayClosingHour).toBeVisible();
    await expect(this.weekdayClosingMinute).toBeVisible();
    await expect(this.weekdayClosingAmRadio).toBeVisible();
    await expect(this.weekdayClosingPmRadio).toBeVisible();
  }

  async assertWeekendRadioButtonsVisible(): Promise<void> {
    await expect(this.saturdayYes).toBeVisible();
    await expect(this.saturdayNo).toBeVisible();
    await expect(this.sundayYes).toBeVisible();
    await expect(this.sundayNo).toBeVisible();
  }

  async assertSaturdayFieldsVisible(): Promise<void> {
    await expect(this.saturdayOpeningHour).toBeVisible();
    await expect(this.saturdayOpeningMinute).toBeVisible();
    await expect(this.saturdayOpeningAmRadio).toBeVisible();
    await expect(this.saturdayOpeningPmRadio).toBeVisible();
    await expect(this.saturdayClosingHour).toBeVisible();
    await expect(this.saturdayClosingMinute).toBeVisible();
    await expect(this.saturdayClosingAmRadio).toBeVisible();
    await expect(this.saturdayClosingPmRadio).toBeVisible();
  }

  async assertSundayFieldsVisible(): Promise<void> {
    await expect(this.sundayOpeningHour).toBeVisible();
    await expect(this.sundayOpeningMinute).toBeVisible();
    await expect(this.sundayOpeningAmRadio).toBeVisible();
    await expect(this.sundayOpeningPmRadio).toBeVisible();
    await expect(this.sundayClosingHour).toBeVisible();
    await expect(this.sundayClosingMinute).toBeVisible();
    await expect(this.sundayClosingAmRadio).toBeVisible();
    await expect(this.sundayClosingPmRadio).toBeVisible();
  }

  async assertSaturdayFieldsHidden(): Promise<void> {
    await expect(this.saturdayOpeningHour).toBeHidden();
    await expect(this.saturdayOpeningMinute).toBeHidden();
    await expect(this.saturdayOpeningAmRadio).toBeHidden();
    await expect(this.saturdayOpeningPmRadio).toBeHidden();
    await expect(this.saturdayClosingHour).toBeHidden();
    await expect(this.saturdayClosingMinute).toBeHidden();
    await expect(this.saturdayClosingAmRadio).toBeHidden();
    await expect(this.saturdayClosingPmRadio).toBeHidden();
  }

  async assertSundayFieldsHidden(): Promise<void> {
    await expect(this.sundayOpeningHour).toBeHidden();
    await expect(this.sundayOpeningMinute).toBeHidden();
    await expect(this.sundayOpeningAmRadio).toBeHidden();
    await expect(this.sundayOpeningPmRadio).toBeHidden();
    await expect(this.sundayClosingHour).toBeHidden();
    await expect(this.sundayClosingMinute).toBeHidden();
    await expect(this.sundayClosingAmRadio).toBeHidden();
    await expect(this.sundayClosingPmRadio).toBeHidden();
  }

  async assertWeekdayOpeningErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('opening_time-error')).toBeVisible();
  }

  async assertWeekdayClosingErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('closing_time-error')).toBeVisible();
  }

  async assertWeekendRadioErrorsVisible(): Promise<void> {
    await expect(this.page.getByTestId('saturday_opening-error')).toBeVisible();
    await expect(this.page.getByTestId('sunday_opening-error')).toBeVisible();
  }

  async clickBackToPrinciplePlaceOfBusiness(): Promise<void> {
    await this.page.getByTestId('tool-nav-prev').click();
    await expect(
      this.page.getByRole('heading', {
        name: 'Principle place of business',
        exact: true,
      }),
    ).toBeVisible();
  }

  async assertNavigatedToNextPage(): Promise<void> {
    await expect(
      this.page.getByRole('heading', {
        name: 'Confirm details',
        exact: true,
      }),
    ).toBeVisible();
  }

  async assertWeekdayTimesPersisted(
    openHH: string,
    openMM: string,
    openAmPm: string,
    closeHH: string,
    closeMM: string,
    closeAmPm: string,
  ): Promise<void> {
    await expect(this.weekdayOpeningHour).toHaveValue(openHH);
    await expect(this.weekdayOpeningMinute).toHaveValue(openMM);
    if (openAmPm === 'am') {
      await expect(this.weekdayOpeningAmRadio).toBeChecked();
    }
    if (openAmPm === 'pm') {
      await expect(this.weekdayOpeningPmRadio).toBeChecked();
    }
    await expect(this.weekdayClosingHour).toHaveValue(closeHH);
    await expect(this.weekdayClosingMinute).toHaveValue(closeMM);
    if (closeAmPm === 'am') {
      await expect(this.weekdayClosingAmRadio).toBeChecked();
    }
    if (closeAmPm === 'pm') {
      await expect(this.weekdayClosingPmRadio).toBeChecked();
    }
  }

  async assertWeekendSelectionsPersisted(
    saturday: string,
    sunday: string,
  ): Promise<void> {
    if (saturday === 'No') {
      await expect(this.saturdayNo).toBeChecked();
    }
    if (sunday === 'No') {
      await expect(this.sundayNo).toBeChecked();
    }
  }

  // Actions

  async selectWeekdayOpeningAm(): Promise<void> {
    await this.weekdayOpeningAmRadio.click();
  }

  async selectWeekdayOpeningPm(): Promise<void> {
    await this.weekdayOpeningPmRadio.click();
  }

  async selectWeekdayClosingAm(): Promise<void> {
    await this.weekdayClosingAmRadio.click();
  }

  async selectWeekdayClosingPm(): Promise<void> {
    await this.weekdayClosingPmRadio.click();
  }

  async selectSaturdayYes(): Promise<void> {
    await this.saturdayYes.click();
  }

  async selectSaturdayNo(): Promise<void> {
    await this.saturdayNo.click();
  }

  async selectSaturdayOpeningAm(): Promise<void> {
    await this.saturdayOpeningAmRadio.click();
  }

  async selectSaturdayOpeningPm(): Promise<void> {
    await this.saturdayOpeningPmRadio.click();
  }

  async selectSaturdayClosingAm(): Promise<void> {
    await this.saturdayOpeningAmRadio.click();
  }

  async selectSaturdayClosingPm(): Promise<void> {
    await this.saturdayOpeningPmRadio.click();
  }

  async selectSundayYes(): Promise<void> {
    await this.sundayYes.click();
  }

  async selectSundayNo(): Promise<void> {
    await this.sundayNo.click();
  }

  async selectSundayOpeningAm(): Promise<void> {
    await this.sundayOpeningAmRadio.click();
  }

  async selectSundayOpeningPm(): Promise<void> {
    await this.sundayOpeningPmRadio.click();
  }

  async selectSundayClosingAm(): Promise<void> {
    await this.sundayClosingAmRadio.click();
  }

  async selectSundayClosingPm(): Promise<void> {
    await this.sundayClosingPmRadio.click();
  }

  async selectWeekdayOpeningHour(value: string): Promise<void> {
    await this.weekdayOpeningHour.selectOption(value);
  }

  async selectWeekdayOpeningMinute(value: string): Promise<void> {
    await this.weekdayOpeningMinute.selectOption(value);
  }

  async selectWeekdayClosingHour(value: string): Promise<void> {
    await this.weekdayClosingHour.selectOption(value);
  }

  async selectWeekdayClosingMinute(value: string): Promise<void> {
    await this.weekdayClosingMinute.selectOption(value);
  }

  async selectWeekdayOpeningTime(hh: string, mm: string): Promise<void> {
    await this.selectWeekdayOpeningHour(hh);
    await this.selectWeekdayOpeningMinute(mm);
  }

  async selectWeekdayClosingTime(hh: string, mm: string): Promise<void> {
    await this.weekdayClosingHour.selectOption(hh);
    await this.weekdayClosingMinute.selectOption(mm);
  }

  async selectValidWeekdayTimes(): Promise<void> {
    await this.selectWeekdayOpeningTime('9', '00');
    await this.selectWeekdayOpeningAm();
    await this.selectWeekdayClosingTime('5', '30');
    await this.selectWeekdayClosingPm();
  }
}
