import { expect, test } from '../lib/test.lib';
const languages = ['en', 'cy'] as const;

const propertyInput = '350000';
const depositInput = '35000';

for (const language of languages) {
  test.describe('Mortgage Calculator', () => {
    /**
     * @tests 58371 - Displays teaser cards
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Displays teaser cards - ${language}`, async ({
      page,
      calculatorInput,
      teaserCards,
    }) => {
      await page.goto(`${language}`);

      await expect(await teaserCards.teaserCard(0)).toBeHidden();

      await calculatorInput.propertyPrice.fill(propertyInput);
      await calculatorInput.deposit.fill(depositInput);
      await calculatorInput.calculateButton.click();

      for (let cardIndex = 0; cardIndex < 2; cardIndex++) {
        await expect(await teaserCards.teaserCard(cardIndex)).toBeVisible();
        await expect(await teaserCards.teaserImage(cardIndex)).toBeVisible();
        await expect(await teaserCards.teaserTitle(cardIndex)).toBeVisible();
        await expect(await teaserCards.teaserTitle(cardIndex)).toBeVisible();
      }
    });
  });
}
