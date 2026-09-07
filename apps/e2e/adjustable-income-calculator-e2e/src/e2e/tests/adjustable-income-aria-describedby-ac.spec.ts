/**
 * @story US 31615
 * Adjustable income: Error messages aren't associated with the inputs.
 *
 * Verifies that `aria-describedby` is correctly applied to inputs when
 * validation errors are displayed, ensuring screen reader accessibility.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@playwright/test';

import {
  AGE_ERROR_ID,
  ARIA_DESCRIBEDBY,
  POT_ERROR_ID,
} from '../data/adjustableIncome';
import { AdjustableIncomePage } from '../pages/AdjustableIncomePage';

const axe = (page: Page) =>
  /** @ts-expect-error This is caused by a mismatch in types that AxeBuilder and Playwright have */
  new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

test.describe('Adjustable Income - aria-describedby error association (US-31615)', () => {
  let adjustableIncomePage: AdjustableIncomePage;

  test.beforeEach(async ({ page }) => {
    adjustableIncomePage = new AdjustableIncomePage(page);
    await adjustableIncomePage.goto();
  });

  /**
   * TC_001: Verify `aria-describedby` is present on input when validation error is displayed
   */
  test('TC_001: aria-describedby is present on the pot input when a validation error is displayed', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      /.+/,
    );
  });

  test('TC_001: aria-describedby is present on the age input when a validation error is displayed', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();

    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      /.+/,
    );
  });

  /**
   * TC_002: Verify `aria-describedby` value matches error message ID
   */
  test('TC_002: aria-describedby on the pot input exactly matches the ID of its error message element', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      POT_ERROR_ID,
    );
    await expect(adjustableIncomePage.potError()).toBeVisible();
  });

  test('TC_002: aria-describedby on the age input exactly matches the ID of its error message element', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();

    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      AGE_ERROR_ID,
    );
    await expect(adjustableIncomePage.ageError()).toBeVisible();
  });

  /**
   * TC_003: Verify `aria-describedby` is applied to the input element only
   */
  test('TC_003: aria-describedby is on the pot input only, not on the label or parent container', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      POT_ERROR_ID,
    );
    await expect(adjustableIncomePage.potLabel()).not.toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );
    await expect(
      adjustableIncomePage.potInput().locator('..'),
    ).not.toHaveAttribute(ARIA_DESCRIBEDBY);
  });

  test('TC_003: aria-describedby is on the age input only, not on the label or parent container', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();

    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      AGE_ERROR_ID,
    );
    await expect(adjustableIncomePage.ageLabel()).not.toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );
    await expect(
      adjustableIncomePage.ageInput().locator('..'),
    ).not.toHaveAttribute(ARIA_DESCRIBEDBY);
  });

  /**
   * TC_004: Verify screen reader association between input and error message.
   * Full screen reader automation is not possible, but this test verifies the
   * programmatic association (aria-describedby referencing a visible, non-empty
   * element) required for screen reader announcements.
   */
  test('TC_004: Pot input has the programmatic association required for screen reader to announce the error', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await adjustableIncomePage.assertReferencedErrorExistsAndIsNonEmpty(
      adjustableIncomePage.potInput(),
    );
  });

  /**
   * TC_005: Verify behaviour when multiple inputs have errors
   */
  test('TC_005: Each input with an error has a unique aria-describedby pointing to its own error message ID', async () => {
    await adjustableIncomePage.gotoWithBothErrors();

    const potDescribedBy = await adjustableIncomePage
      .potInput()
      .getAttribute(ARIA_DESCRIBEDBY);
    expect(potDescribedBy).toBe(POT_ERROR_ID);
    await expect(adjustableIncomePage.potError()).toBeVisible();

    await adjustableIncomePage.gotoWithAgeMinError();
    const ageDescribedBy = await adjustableIncomePage
      .ageInput()
      .getAttribute(ARIA_DESCRIBEDBY);
    expect(ageDescribedBy).toBe(AGE_ERROR_ID);
    await expect(adjustableIncomePage.ageError()).toBeVisible();

    expect(ageDescribedBy).not.toBe(potDescribedBy);
  });

  /**
   * TC_006: Verify `aria-describedby` is removed or updated when error is resolved.
   * After navigating to a valid state, `gotoWithValidInputs` waits for the
   * results section to confirm the page is fully rendered before asserting
   * the attribute has been removed.
   */
  test('TC_006: aria-describedby is removed from the pot input when the validation error is resolved', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();
    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );

    await adjustableIncomePage.gotoWithValidInputs();
    await expect(adjustableIncomePage.potInput()).not.toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );
  });

  test('TC_006: aria-describedby is removed from the age input when the validation error is resolved', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();
    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );

    await adjustableIncomePage.gotoWithValidInputs();
    await expect(adjustableIncomePage.ageInput()).not.toHaveAttribute(
      ARIA_DESCRIBEDBY,
    );
  });

  /**
   * TC_007: Verify referenced error message ID exists in DOM
   */
  test('TC_007: The element ID referenced by aria-describedby on the pot input exists in the DOM', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    const describedBy = await adjustableIncomePage
      .potInput()
      .getAttribute(ARIA_DESCRIBEDBY);
    expect(describedBy).not.toBeNull();
    await expect(
      adjustableIncomePage.locatorById(describedBy as string),
    ).toBeAttached();
  });

  test('TC_007: The element ID referenced by aria-describedby on the age input exists in the DOM', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();

    const describedBy = await adjustableIncomePage
      .ageInput()
      .getAttribute(ARIA_DESCRIBEDBY);
    expect(describedBy).not.toBeNull();
    await expect(
      adjustableIncomePage.locatorById(describedBy as string),
    ).toBeAttached();
  });

  /**
   * TC_008: Verify no broken reference is present
   */
  test('TC_008: aria-describedby on the pot input does not reference a missing or empty element', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await adjustableIncomePage.assertReferencedErrorExistsAndIsNonEmpty(
      adjustableIncomePage.potInput(),
    );
  });

  test('TC_008: aria-describedby on the age input does not reference a missing or empty element', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();

    await adjustableIncomePage.assertReferencedErrorExistsAndIsNonEmpty(
      adjustableIncomePage.ageInput(),
    );
  });

  /**
   * TC_009: Verify dynamic error message updates maintain correct association
   */
  test('TC_009: aria-describedby on the pot input remains correctly associated when the error type changes', async () => {
    await adjustableIncomePage.gotoWithPotRequiredError();
    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      POT_ERROR_ID,
    );
    await expect(adjustableIncomePage.potError()).toBeVisible();

    await adjustableIncomePage.gotoWithPotMaxError();
    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      POT_ERROR_ID,
    );
    await expect(adjustableIncomePage.potError()).toBeVisible();
  });

  test('TC_009: aria-describedby on the age input remains correctly associated when the error type changes', async () => {
    await adjustableIncomePage.gotoWithAgeMinError();
    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      AGE_ERROR_ID,
    );
    await expect(adjustableIncomePage.ageError()).toBeVisible();

    await adjustableIncomePage.gotoWithAgeMaxError();
    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      AGE_ERROR_ID,
    );
    await expect(adjustableIncomePage.ageError()).toBeVisible();
  });

  /**
   * TC_010: Verify accessibility compliance when error message is displayed.
   * Runs an axe scan scoped to the form fieldsets and error summary.
   */
  test('TC_010: No axe accessibility violations on the pot input and its error message', async ({
    page,
  }) => {
    await adjustableIncomePage.gotoWithPotRequiredError();

    await expect(adjustableIncomePage.potError()).toBeVisible();
    await expect(adjustableIncomePage.potInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      POT_ERROR_ID,
    );

    const results = await axe(page).include('fieldset').analyze();
    expect(results.violations).toEqual([]);
  });

  test('TC_010: No axe accessibility violations on the age input and its error message', async ({
    page,
  }) => {
    await adjustableIncomePage.gotoWithAgeMinError();

    await expect(adjustableIncomePage.ageError()).toBeVisible();
    await expect(adjustableIncomePage.ageInput()).toHaveAttribute(
      ARIA_DESCRIBEDBY,
      AGE_ERROR_ID,
    );

    const results = await axe(page).include('fieldset').analyze();
    expect(results.violations).toEqual([]);
  });

  test('TC_010: No axe accessibility violations on the full form when both errors are displayed', async ({
    page,
  }) => {
    await adjustableIncomePage.gotoWithBothErrors();

    const results = await axe(page)
      .include('form, fieldset, .t-error-summary')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
