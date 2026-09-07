import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class PrinciplePlaceOfBusinessPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: 'Principle place of business',
      exact: true,
    });
  }

  get openingHoursHeading(): Locator {
    return this.page.getByRole('heading', {
      name: 'Opening hours',
      exact: true,
    });
  }

  get guidanceText(): Locator {
    return this.page.getByText(
      'Enter the contact details you want customers to use.',
      { exact: true },
    );
  }

  get addressLineOne(): Locator {
    return this.page.getByTestId('line_one');
  }

  get addressLineTwo(): Locator {
    return this.page.getByTestId('line_two');
  }

  get town(): Locator {
    return this.page.getByTestId('town');
  }

  get country(): Locator {
    return this.page.getByTestId('country');
  }

  get postcode(): Locator {
    return this.page.getByTestId('postcode');
  }

  //ACTIONS
  async fillAddressLineOne(value: string): Promise<void> {
    await this.addressLineOne.fill(value);
  }

  async fillAddressLineTwo(value: string): Promise<void> {
    await this.addressLineTwo.fill(value);
  }

  async fillTown(value: string): Promise<void> {
    await this.town.fill(value);
  }

  async fillCountry(value: string): Promise<void> {
    await this.country.fill(value);
  }

  async fillPostcode(value: string): Promise<void> {
    await this.postcode.clear();
    await this.postcode.fill(value);
    await expect(this.postcode).toHaveValue(value);
  }

  async clickBackToPrinciplePlaceOfBusiness(): Promise<void> {
    await this.page.getByTestId('tool-nav-prev').click();
    await this.assertPageHeading();
  }

  async clickBackToCustomerContactDetails(): Promise<void> {
    await this.page.getByTestId('tool-nav-prev').click();
    await expect(
      this.page.getByRole('heading', { name: 'Customer contact details' }),
    ).toBeVisible();
  }

  async assertPostcodeRejected(
    postcode: string,
    apiPath: string,
  ): Promise<void> {
    await this.fillPostcode(postcode);
    const response = await this.clickContinueAndWaitForPostResponse(apiPath);
    expect(response.status()).toBe(400);
    await this.assertPostcodeErrorVisible();
  }

  async assertPostcodeAcceptedAndAdvances(
    postcode: string,
    apiPath: string,
  ): Promise<void> {
    await this.fillAddressLineOne('123 Test Street');
    await this.fillTown('London');
    await this.fillCountry('England');
    await this.fillPostcode(postcode);
    await this.clickContinueAndWaitForApi(apiPath, this.openingHoursHeading);
    await this.assertNoPostcodeError();
    await this.clickBackToPrinciplePlaceOfBusiness();
  }

  //ASSERTIONS
  async assertPageHeading(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async assertOpeningHoursHeading(): Promise<void> {
    await expect(this.openingHoursHeading).toBeVisible();
  }

  async assertGuidanceText(): Promise<void> {
    await expect(this.guidanceText).toBeVisible();
  }

  async assertFieldsVisible(): Promise<void> {
    await expect(this.addressLineOne).toBeVisible();
    await expect(this.addressLineTwo).toBeVisible();
    await expect(this.town).toBeVisible();
    await expect(this.country).toBeVisible();
    await expect(this.postcode).toBeVisible();
  }

  async assertFieldsEmpty(): Promise<void> {
    await expect(this.addressLineOne).toHaveValue('');
    await expect(this.addressLineTwo).toHaveValue('');
    await expect(this.town).toHaveValue('');
    await expect(this.country).toHaveValue('');
    await expect(this.postcode).toHaveValue('');
  }

  async assertAddressLineOneErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('line_one-error')).toBeVisible();
  }

  async assertTownErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('town-error')).toBeVisible();
  }

  async assertPostcodeErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('postcode-error')).toBeVisible();
  }

  async assertNoPostcodeError(): Promise<void> {
    await expect(this.page.getByTestId('postcode-error')).toBeHidden();
  }

  async assertCountryErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('country-error')).toBeVisible();
  }

  async assertStillOnPrinciplePlaceOfBusinessPage(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async assertFieldValuesPersisted(values: {
    line1: string;
    line2: string;
    town: string;
    country: string;
    postcode: string;
  }): Promise<void> {
    await expect(this.addressLineOne).toHaveValue(values.line1);
    await expect(this.addressLineTwo).toHaveValue(values.line2);
    await expect(this.town).toHaveValue(values.town);
    await expect(this.country).toHaveValue(values.country);
    await expect(this.postcode).toHaveValue(values.postcode);
  }

  async assertCustomerContactDetailsPersisted(): Promise<void> {
    await expect(this.page.getByTestId('website')).not.toHaveValue('');
    await expect(this.page.getByTestId('telephone_number')).not.toHaveValue('');
    await expect(this.page.getByTestId('email_address')).not.toHaveValue('');
  }
}
