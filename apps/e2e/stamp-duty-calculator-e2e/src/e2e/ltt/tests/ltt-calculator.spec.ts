import { expect, Page, test } from '@playwright/test';

import { setupLocaleTest } from '../../utils/testSetup';
import taxValueLTT from '../data/taxValueLTT';

const locales: string[] = ['en', 'cy'];

const fillInStampDutyCalculator = async (
  page: Page,
  buyerType: number,
  price: string,
  day: string,
  month: string,
  year: string,
) => {
  const buyerTypeValue = buyerType === 1 ? 'firstOrNextHome' : 'additionalHome';

  await page.locator('#buyerType').waitFor({ state: 'visible' });
  await page.locator('#buyerType').selectOption(buyerTypeValue);
  await page.locator('#price').fill(price);

  // Fill day
  const dayInput = page.locator('#day');
  await dayInput.fill(day);

  // Fill month
  const monthInput = page.locator('#month');
  await monthInput.fill(month);

  // Fill year
  const yearInput = page.locator('#year');
  await yearInput.click();
  await yearInput.fill(year);

  await page.locator('button.tool-nav-submit').click();
};

setupLocaleTest(locales, 'ltt', (locale) => {
  const scenarios = taxValueLTT[locale];
  const priceRegex = /\d+/;

  for (const scenarioName in scenarios) {
    const scenario = scenarios[scenarioName];
    const priceMatch = priceRegex.exec(scenarioName);
    const price = priceMatch ? priceMatch[0] : '0';
    const buyerType = scenarioName.startsWith('secondHomeBuyer') ? 2 : 1;

    test(`Verifies ${scenarioName} → £${price} (${locale})`, async ({
      page,
    }) => {
      await fillInStampDutyCalculator(
        page,
        buyerType,
        price,
        scenario.day,
        scenario.month,
        scenario.year,
      );

      await expect(page.locator('p.t-result-tax')).toHaveText(scenario.tax);
      await expect(page.locator('p.t-result-rate')).toHaveText(scenario.rate);
    });
  }
});
