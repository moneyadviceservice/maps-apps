import { expect, test } from '@lib/test.lib';

import testData from '../data/workplacePensionCalculator.json';

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ startCalculatorPage, setCookieControl }) => {
    await setCookieControl();
    await startCalculatorPage.goto('/en/workplace-pension-calculator');
  });

  /**
   * @tests 55877 - Validate landing page
   */
  test(`Should validate start page`, async ({ startCalculatorPage }) => {
    await expect(startCalculatorPage.startPageTitle).toHaveText(
      testData.landingPage.en.heading,
    );
    await expect(startCalculatorPage.startPageIntro).toContainText(
      testData.landingPage.en.intro,
    );
    await expect(startCalculatorPage.introParagraphs.nth(0)).toContainText(
      testData.landingPage.en.info[0],
    );
    await expect(startCalculatorPage.introParagraphs.nth(1)).toContainText(
      testData.landingPage.en.info[1],
    );
    await expect(startCalculatorPage.introListItems.nth(0)).toContainText(
      testData.landingPage.en.info[2],
    );
    await expect(startCalculatorPage.introListItems.nth(1)).toContainText(
      testData.landingPage.en.info[3],
    );
    await expect(startCalculatorPage.introListItems.nth(2)).toContainText(
      testData.landingPage.en.info[4],
    );
    await expect(startCalculatorPage.startCalculatorButton).toContainText(
      testData.landingPage.en.button,
    );
    await expect(startCalculatorPage.startCalculatorHelpText).toContainText(
      testData.landingPage.en.help,
    );
    await startCalculatorPage.startCalculatorButton.click();
    expect(startCalculatorPage.url).toContain(
      '/workplace-pension-calculator/calculator',
    );
  });
});
