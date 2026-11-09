import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

import { aboutYouTitle } from '../data/about-you';
import aboutYouRadioGroupPage from '../pages/AboutYouRadioGroupPage';
import { basePage } from '../pages/basePage';
import homePage from '../pages/HomePage';

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

/**
 * @tests User Story 50526
 * @test AC2: Arrow keys move focus within the radio group and keep single selection
 * @test AC3: Radio group has correct semantics/labelling and no related axe violations
 */

test.describe('Retirement Budget Planner - About You radio group accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await homePage.startRetirementBudgetPlanner(page);
    await basePage.waitForPageHeading(page, aboutYouTitle);
  });

  test('AC2: arrow keys move focus and selection within the radio group', async ({
    page,
  }) => {
    const maleRadio = aboutYouRadioGroupPage.maleRadio(page);
    const femaleRadio = aboutYouRadioGroupPage.femaleRadio(page);

    await expect(maleRadio).toBeVisible();
    await expect(femaleRadio).toBeVisible();

    await maleRadio.focus();
    await expect(maleRadio).toBeFocused();

    await aboutYouRadioGroupPage.selectFemaleWithArrowRight(page);

    await expect(femaleRadio).toBeFocused();
    await expect(femaleRadio).toBeChecked();
    await expect(maleRadio).not.toBeChecked();

    await aboutYouRadioGroupPage.selectMaleWithArrowLeft(page);

    await expect(maleRadio).toBeFocused();
    await expect(maleRadio).toBeChecked();
    await expect(femaleRadio).not.toBeChecked();
  });

  test('AC3: radio group exposes valid semantics and labels', async ({
    page,
  }) => {
    const radioGroup = aboutYouRadioGroupPage.genderGroup(page);
    const maleRadio = aboutYouRadioGroupPage.maleRadio(page);
    const femaleRadio = aboutYouRadioGroupPage.femaleRadio(page);

    await expect(radioGroup).toBeVisible();
    await expect(maleRadio).toBeVisible();
    await expect(femaleRadio).toBeVisible();

    await expect(maleRadio).toHaveAttribute('name', 'gender');
    await expect(femaleRadio).toHaveAttribute('name', 'gender');

    // Validate each radio has an associated, non-empty label.
    await expect(
      aboutYouRadioGroupPage.getAssociatedLabelText(page, maleRadio),
    ).resolves.not.toBe('');
    await expect(
      aboutYouRadioGroupPage.getAssociatedLabelText(page, femaleRadio),
    ).resolves.not.toBe('');

    const groupId = await aboutYouRadioGroupPage.ensureGroupId(page);

    const results = await axe(page).include(`#${groupId}`).analyze();
    expect(results.violations).toEqual([]);
  });
});
