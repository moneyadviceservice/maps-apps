import { expect, Locator, Page } from '@playwright/test';

export class ErrorSummaryPage {
  readonly page: Page;
  readonly summaryHeading: Locator;
  readonly errorLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    this.summaryHeading = page.getByTestId('error-summary-heading');

    // All error messages use this class — reliable selector
    this.errorLinks = page.locator('a.whitespace-pre-wrap');
  }

  async assertErrorSummaryHeading(expected: string) {
    await expect(this.summaryHeading.filter({ hasText: expected })).toHaveCount(
      1,
    );
  }

  async assertErrorMessage(message: string) {
    const link = this.errorLinks.filter({ hasText: message });
    await expect(link).toHaveCount(1);
  }

  async assertAllErrorMessages(messages: string[]) {
    for (const message of messages) {
      await this.assertErrorMessage(message);
    }
  }

  // NEW — heading can be English or Welsh
  async assertHeadingInEitherLanguage() {
    const headings = [
      'There is a problem', // English
      'Mae yna broblem', // Welsh
    ];

    await Promise.any(headings.map((h) => this.assertErrorSummaryHeading(h)));
  }

  // NEW — assert Salary 2 errors (indexes 9–17) in either language
  async assertSalary2ErrorsInEitherLanguage(
    english: string[],
    welsh: string[],
  ) {
    const startIndex = 9; // Salary 2 errors begin at index 9

    for (let i = startIndex; i <= 17; i++) {
      const englishMsg = english[i];
      const welshMsg = welsh[i];

      const englishMatch = this.errorLinks.filter({ hasText: englishMsg });
      const welshMatch = this.errorLinks.filter({ hasText: welshMsg });

      await expect(englishMatch.or(welshMatch)).toHaveCount(1);
    }
  }
}
