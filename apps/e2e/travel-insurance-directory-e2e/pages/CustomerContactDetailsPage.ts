import { expect, type Locator, type Page } from '@playwright/test';

import { AccountDashboardPage } from './AccountDashboardPage';

export class CustomerContactDetailsPage extends AccountDashboardPage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATORS
  get heading(): Locator {
    return this.page.getByRole('heading', {
      name: 'Customer contact details',
      exact: true,
    });
  }

  get guidanceText(): Locator {
    return this.page.getByText(
      'Enter the contact details you want customers to use.',
      { exact: true },
    );
  }

  private websiteAddressField(): Locator {
    return this.page.getByTestId('website');
  }

  private customerTelephoneField(): Locator {
    return this.page.getByTestId('telephone_number');
  }

  private customerEmailField(): Locator {
    return this.page.getByTestId('email_address');
  }

  //ACTIONS
  async clickCustomerContactDetails(): Promise<void> {
    await super.clickCustomerContactDetails();
    await this.assertPageHeading();
  }

  async clickBackAndWaitForFirmDetails(): Promise<void> {
    await this.page.getByTestId('tool-nav-prev').click();
    await expect(this.heading).toBeVisible();
  }

  async clickBackAndWaitForAccountDashboard(): Promise<void> {
    await this.page.getByTestId('tool-nav-prev').click();
    await this.assertHeading('Register your firm');
  }

  async fillWebsiteAddress(value: string): Promise<void> {
    await this.websiteAddressField().fill(value);
  }

  async fillCustomerTelephone(value: string): Promise<void> {
    await this.customerTelephoneField().fill(value);
  }

  async fillCustomerEmail(value: string): Promise<void> {
    await this.customerEmailField().fill(value);
  }

  //ASSERTIONS
  async assertPageHeading(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async assertGuidanceText(): Promise<void> {
    await expect(this.guidanceText).toBeVisible();
  }

  async assertFieldsVisible(): Promise<void> {
    await expect(this.websiteAddressField()).toBeVisible();
    await expect(this.customerTelephoneField()).toBeVisible();
    await expect(this.customerEmailField()).toBeVisible();
  }

  async assertFieldsEmpty(): Promise<void> {
    await expect(this.websiteAddressField()).toHaveValue('');
    await expect(this.customerTelephoneField()).toHaveValue('');
    await expect(this.customerEmailField()).toHaveValue('');
  }

  async assertWebsiteErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('website-error')).toBeVisible();
  }

  async assertTelephoneErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('telephone_number-error')).toBeVisible();
  }

  async assertEmailErrorVisible(): Promise<void> {
    await expect(this.page.getByTestId('email_address-error')).toBeVisible();
  }

  async assertStillOnCustomerContactDetailsPage(): Promise<void> {
    await expect(this.heading).toBeVisible();
  }

  async thePrinciplePlaceOfBusinessHeading(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Principle place of business' }),
    ).toBeVisible();
  }

  async theAccountHeading(): Promise<void> {
    await this.assertHeading('Main authorised firm');
  }
}
