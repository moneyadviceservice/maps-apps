import { expect, type Page, test } from '@playwright/test';

import {
  personalPensionsTitle,
  retirementIncomeHeading,
  workplacePensionsTitle,
} from '../data/retirement-income';
import aboutYouPage from '../pages/AboutYouPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';
import retirementIncomePage from '../pages/RetirementIncomePage';

type PensionType = 'definedContribution' | 'definedBenefit' | 'privatePension';

type FocusTestCase = {
  ac: string;
  title: string;
  accordionTitle: string;
  pensionType: PensionType;
  inputTestId: string;
};

type FocusActionCase = Pick<
  FocusTestCase,
  'accordionTitle' | 'pensionType' | 'inputTestId'
>;

const focusTestCases: FocusTestCase[] = [
  {
    ac: 'AC1',
    title: 'focus moves to new Defined Contribution pension field',
    accordionTitle: workplacePensionsTitle,
    pensionType: 'definedContribution',
    inputTestId: 'formdefinedContribution1Id',
  },
  {
    ac: 'AC2',
    title: 'focus moves to new Defined Benefit pension field',
    accordionTitle: workplacePensionsTitle,
    pensionType: 'definedBenefit',
    inputTestId: 'formdefinedBenefit1Id',
  },
  {
    ac: 'AC3',
    title: 'focus moves to new private pension field',
    accordionTitle: personalPensionsTitle,
    pensionType: 'privatePension',
    inputTestId: 'formprivatePension1Id',
  },
];

const addPensionAndGetInput = async (
  page: Page,
  { accordionTitle, pensionType, inputTestId }: FocusActionCase,
) => {
  await retirementIncomePage.openAccordionByTitle(page, accordionTitle);

  await retirementIncomePage.clickAddPensionButton(page, {
    type: pensionType,
  });

  return page.getByTestId(inputTestId);
};

/**
 * @tests User Story 50537
 * @test AC1: Adding a Defined Contribution workplace pension moves focus to the newly added pension field
 * @test AC2: Adding a Defined Benefit workplace pension moves focus to the newly added pension field
 * @test AC3: Adding a private pension moves focus to the newly added pension field
 */
test.describe('Retirement Budget Planner - add pension focus management accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await aboutYouPage.fillValuesAndContinue(page);
    await basePage.waitForPageHeading(page, retirementIncomeHeading);
  });

  focusTestCases.forEach(({ ac, title, ...testCase }) => {
    test(`${ac}: ${title}`, async ({ page }) => {
      const newPensionInput = await addPensionAndGetInput(page, testCase);
      await expect(newPensionInput).toBeVisible();
      await expect(newPensionInput).toBeFocused();
    });
  });
});
