import { expect, Page, test } from '@playwright/test';

import { setupLocaleTest } from '../../utils/testSetup';
import taxValueSDLT, { ScenarioKey, TaxData } from '../data/sdltTaxValues';

const locales: string[] = ['en', 'cy'];

const fillInStampDutyCalculator = async (
  page: Page,
  buyerType: number,
  price: string,
  day: string,
  month: string,
  year: string,
) => {
  const buyerTypeValue =
    buyerType === 1
      ? 'firstTimeBuyer'
      : buyerType === 2
      ? 'nextHome'
      : 'additionalHome';

  await page.locator('#buyerType').selectOption(buyerTypeValue);
  await page.locator('#price').fill(price);
  await page.locator('#day').fill(day);
  await page.locator('#month').fill(month);
  await page.locator('#year').click();
  await page.locator('#year').fill(year);
  await page.locator('button.tool-nav-submit').click();
};

const errorMessages: Record<(typeof locales)[number], string> = {
  en: 'Enter a property price, for example £200,000',
  cy: 'Rhowch bris eiddo, er enghraifft £200,000',
};

setupLocaleTest(locales, 'sdlt', (locale) => {
  const scenarios = taxValueSDLT[locale];

  for (const [scenarioName, scenario] of Object.entries(scenarios) as [
    ScenarioKey,
    TaxData,
  ][]) {
    const { day, month, year } = scenario;
    const priceMatch = scenarioName.match(/\d+/);
    const price = priceMatch ? priceMatch[0] : '0';

    const buyerType = scenarioName.startsWith('secondHomeBuyer')
      ? 3
      : scenarioName.startsWith('nextHomeBuyer')
      ? 2
      : 1;

    test(`Verifies ${scenarioName} → £${price} (${locale})`, async ({
      page,
    }) => {
      await fillInStampDutyCalculator(page, buyerType, price, day, month, year);
      await expect(page.locator('p.t-result-tax')).toHaveText(scenario.tax);
      await expect(page.locator('p.t-result-rate')).toHaveText(scenario.rate);
    });
  }

  test('Verify error message when no property price entered', async ({
    page,
  }) => {
    await page.locator('#buyerType').selectOption('additionalHome');
    await page
      .locator('button:has-text("Calculate"), button:has-text("Cyfrifwch")')
      .click();

    await expect(page.locator('a[data-testid="error-link-0"]')).toHaveText(
      errorMessages[locale],
    );
  });
});
