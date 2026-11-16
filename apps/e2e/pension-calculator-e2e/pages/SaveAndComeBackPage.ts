import { aboutYouData, yourIncomeData } from 'data';
import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class SaveAndComeBackPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATERS

  email(): Locator {
    return this.page.getByTestId('email');
  }

  saveAndSendEmailButton(): Locator {
    return this.page.getByRole('button', { name: 'Save and send email' });
  }

  //errors

  errorSummary(): Locator {
    return this.page.getByTestId('error-summary-heading');
  }

  emailError(): Locator {
    return this.page.getByTestId('email-error');
  }

  //ACTIONS

  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData('your-income', yourIncomeData, sessionId, {
      action: 'save',
    });

    const returnUrl = `/en/your-income?sessionId=${sessionId}`;
    const searchParams = new URLSearchParams({
      returnTo: returnUrl,
      sessionId: sessionId,
    });

    await this.page.goto(`/en/save?${searchParams.toString()}`);
  }

  async fillEmail(email: string): Promise<void> {
    await this.email().fill(email);
  }

  async clickSaveAndSendEmailButton(): Promise<void> {
    await this.saveAndSendEmailButton().click();
  }
}
