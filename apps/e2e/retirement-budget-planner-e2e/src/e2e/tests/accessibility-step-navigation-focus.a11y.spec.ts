import { expect, test } from '@playwright/test';

import RbpFocusPage, {
  TAB_NAMES,
} from '../pages/RetirementBudgetPlannerFocusPage';

/**
 * @tests User Story 50533
 * @test AC1 About you continue moves focus to tab content on Retirement income
 * @test AC2 Retirement income continue moves focus to tab content on Retirement costs
 * @test AC3 Retirement costs continue moves focus to tab content on Results
 * @test AC4 Results back moves focus to tab content on Retirement costs
 * @test AC5 Retirement costs back moves focus to tab content on Retirement income
 * @test AC6 Retirement income back moves focus to tab content on About you
 * @test AC7 Retirement income tab to About you keeps focus on About you tab
 * @test AC8 Retirement costs tab to Retirement income keeps focus on Retirement income tab
 */
test.describe('Retirement Budget Planner - step navigation focus accessibility', () => {
  let rbpFocus: ReturnType<typeof RbpFocusPage>;

  test.beforeEach(async ({ page }) => {
    rbpFocus = RbpFocusPage(page);
  });

  test('AC1: About you continue moves focus to tab content on Retirement income page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementIncome();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.RETIREMENT_INCOME);
  });

  test('AC2: Retirement income continue moves focus to tab content on Retirement costs page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementCosts();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.RETIREMENT_COSTS);
  });

  test('AC3: Retirement costs continue moves focus to tab content on Results page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToResults();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.RESULTS);
  });

  test('AC4: Results back moves focus to tab content on Retirement costs page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToResults();
    await rbpFocus.activateBackWithKeyboard();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.RETIREMENT_COSTS);
  });

  test('AC5: Retirement costs back moves focus to tab content on Retirement income page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementCosts();
    await rbpFocus.activateBackWithKeyboard();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.RETIREMENT_INCOME);
  });

  test('AC6: Retirement income back moves focus to tab content on About you page', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementIncome();
    await rbpFocus.activateBackWithKeyboard();
    await rbpFocus.assertTabContentFocused(TAB_NAMES.ABOUT_YOU);
  });

  test('AC7: Retirement income tab to About you keeps focus on About you tab', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementIncome();
    await rbpFocus.activateProgressTabWithKeyboard(TAB_NAMES.ABOUT_YOU);
    await rbpFocus.assertProgressTabFocused(TAB_NAMES.ABOUT_YOU);
  });

  test('AC8: Retirement costs tab to Retirement income keeps focus on Retirement income tab', async () => {
    await rbpFocus.startAtAboutYou();
    await rbpFocus.goToRetirementCosts();
    await rbpFocus.activateProgressTabWithKeyboard(TAB_NAMES.RETIREMENT_INCOME);
    await rbpFocus.assertProgressTabFocused(TAB_NAMES.RETIREMENT_INCOME);
  });
});
