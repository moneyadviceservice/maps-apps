import { aboutYouData, yourIncomeData } from 'data';
import { saveAndComeBackData } from 'data/saveAndComeBackData';
import { type Locator, type Page } from '@playwright/test';

import { BasePage } from './basePage';

export class ProgressSavedPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  //LOCATERS

  ReturnToYourSavedProgressButton(): Locator {
    return this.page.getByTestId('return-to-progress');
  }

  ResendEmailButton(): Locator {
    return this.page.getByTestId('resend-email');
  }

  //ACTIONS

  async goto(): Promise<void> {
    const sessionId = await this.postPageData('about-you', aboutYouData);
    await this.postPageData('your-income', yourIncomeData, sessionId, {
      action: 'save',
    });

    const savedAndComeBackData = saveAndComeBackData(sessionId);
    await this.postPageData('save', savedAndComeBackData, sessionId);

    const returnUrl = `/en/your-income?sessionId=${sessionId}`;
    const searchParams = new URLSearchParams({
      returnTo: returnUrl,
      sessionId: sessionId,
    });

    await this.page.goto(`/en/progress-saved?${searchParams.toString()}`);
  }

  async clickReturnToYourSavedProgressButton(): Promise<void> {
    await this.ReturnToYourSavedProgressButton().click();
  }

  async clickResendEmailButton(): Promise<void> {
    await this.ResendEmailButton().click();
  }
}
