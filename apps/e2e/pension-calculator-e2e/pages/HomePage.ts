import { type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // LOCATORS

  breadCrumb() {
    return this.page.getByLabel('breadcrumbs');
  }

  startPensionCalcButton(location: 'hero' | 'footer') {
    return this.page.getByTestId(`start-pension-calculator-${location}`);
  }

  whatyoullGetSection() {
    return this.page.getByTestId('what-youll-get-section');
  }

  howItWorksSection() {
    return this.page.getByTestId('how-it-works-section');
  }

  whatYoullNeedSection() {
    return this.page.getByTestId('what-youll-need-section');
  }

  webchatLink() {
    return this.page.getByTestId('webchat-link');
  }

  phoneNumberLink() {
    return this.page.getByRole('link', { name: '0800 011 3797' });
  }

  onlineFormLink() {
    return this.page.getByTestId('onlineform-link');
  }

  // ACTIONS

  /**
   * Navigates the browser to the home page URL.
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Clicks the Start Pension Calculator button at the specified location.
   *
   * @param location - The section where the button is located ('hero' or 'footer').
   * @returns A promise that resolves when the click action is complete.
   */
  async clickStartPensionCalcButton(
    location: 'hero' | 'footer',
  ): Promise<void> {
    await this.startPensionCalcButton(location).click();
  }
}
