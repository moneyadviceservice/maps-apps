import { expect, Locator, Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class DocumentPage extends BasePage {
  private readonly feedbackBoxTestId = 'feedback-callout';
  private readonly mainHeadingTestId = 'main-heading';

  async navigateToFirstDocument(page: Page) {
    await page.goto('/en/research-library');

    const firstCard = page.getByTestId('information-callout').first();
    await firstCard.getByRole('link').first().click();
  }

  get feedbackBox(): Locator {
    return this.page.getByTestId(this.feedbackBoxTestId);
  }

  async assertFeedbackFormText(text: string, linkText: string) {
    await expect(this.feedbackBox).toContainText(text);
    await expect(
      this.feedbackBox.locator(`a[href="mailto:${linkText}"]`),
    ).toBeVisible();
  }

  async assertPageIsLoaded() {
    await this.page.waitForURL('**/en/research-library/**');
    await expect(this.page.getByTestId(this.mainHeadingTestId)).toBeVisible();
  }
}
