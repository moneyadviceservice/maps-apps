import { expect, test } from '@playwright/test';

export function missingFieldsTest(buyerTypeValue: string) {
  return (locale: string) => {
    const errorMessages: { [key: string]: string[] } = {
      en: [
        'Enter a property price, for example £200,000',
        'Enter a purchase date',
      ],
      cy: [
        'Rhowch bris eiddo, er enghraifft £200,000',
        'Rhowch ddyddiad prynu',
      ],
    };

    test(`Verify error message when property price & purchase date is not entered (${locale})`, async ({
      page,
    }) => {
      await page.locator('#buyerType').selectOption(buyerTypeValue);

      await page
        .locator('button:has-text("Calculate"), button:has-text("Cyfrifwch")')
        .click();

      const errorLinks = page.locator('a[data-testid^="error-link-"]');

      await expect(errorLinks.nth(0)).toHaveText(errorMessages[locale][0]);
      await expect(errorLinks.nth(1)).toHaveText(errorMessages[locale][1]);
    });
  };
}
