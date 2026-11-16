import { expect, type Page, test } from '@playwright/test';

import { personalPensionsTitle } from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementCostsPage from '../pages/RetirementCostsPage';
import retirementIncomePage from '../pages/RetirementIncomePage';
import {
  holdIncomeFieldSave,
  waitForFieldSave,
} from '../utils/cacheSaveMonitor';

const navigations = [
  {
    name: 'Continue',
    click: (page: Page) => basePage.continueButton(page).click(),
    waitForDestination: (page: Page) =>
      retirementCostsPage.waitForPageToBeReady(page),
  },
  {
    name: 'About you tab',
    click: (page: Page) => basePage.clickTab(page, 'About you'),
    waitForDestination: (page: Page) => aboutYouPage.waitForPageToBeReady(page),
  },
];

const expectIncomeValues = async (page: Page) => {
  await retirementIncomePage.waitForPageToBeReady(page);
  await retirementIncomePage.openAccordionByTitle(page, personalPensionsTitle);
  await expect(retirementIncomePage.statePensionInput(page)).toHaveValue('234');
  await expect(retirementIncomePage.personalPensionInput(page)).toHaveValue(
    '456',
  );
};

test.describe('Bug 60930: values persist when changing pages', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await retirementIncomePage.waitForPageToBeReady(page);
  });

  for (const navigation of navigations) {
    test(`income saves are ordered when using ${navigation.name}`, async ({
      page,
    }) => {
      await retirementIncomePage.fillStatePension(page, '234');
      await retirementIncomePage.openAccordionByTitle(
        page,
        personalPensionsTitle,
      );
      await retirementIncomePage.fillPersonalPension(page, '321');
      await retirementIncomePage.personalPensionInput(page).fill('456');

      const saveMonitor = await holdIncomeFieldSave(
        page,
        'formprivatePension',
        '456',
      );
      const navigationClick = navigation.click(page);

      try {
        // Keep the blur blocked until the navigation click has been dispatched.
        await Promise.all([saveMonitor.started, navigationClick]);
      } finally {
        saveMonitor.release();
      }

      expect((await saveMonitor.fieldSaved).status()).toBe(307);
      const formResponse = await saveMonitor.formSaved;
      expect(formResponse.ok()).toBe(true);
      expect(formResponse.request().postDataJSON()).toMatchObject({
        formstatePension: '234',
        formprivatePension: '456',
      });
      expect(saveMonitor.order).toEqual(['blur response', 'form request']);

      await navigation.waitForDestination(page);
      await basePage.clickTab(page, 'Retirement income');
      await expectIncomeValues(page);
      await page.reload();
      await expectIncomeValues(page);
    });
  }

  test('costs entered immediately before Back persist on return', async ({
    page,
  }) => {
    await retirementIncomePage.fillValuesAndContinue(page, '1234');
    await retirementCostsPage.waitForPageToBeReady(page);
    await retirementCostsPage.fillRent(page, '700');

    const mortgage = retirementCostsPage.mortgageRepaymentInput(page);
    await basePage.waitForHydration(page, mortgage);
    await mortgage.fill('850');
    const blurSaved = waitForFieldSave(page, 'formmortgageRepayment', '850');
    await basePage.clickBackLink(page);
    expect((await blurSaved).status()).toBe(307);
    await retirementIncomePage.waitForPageToBeReady(page);
    await basePage.clickTab(page, 'Retirement costs');
    await retirementCostsPage.waitForPageToBeReady(page);
    await page.reload();
    await retirementCostsPage.waitForPageToBeReady(page);
    await expect(retirementCostsPage.rentInput(page)).toHaveValue('700');
    await expect(mortgage).toHaveValue('850');
  });
});
