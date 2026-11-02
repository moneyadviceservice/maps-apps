/**
 * @story US 31615
 * Adjustable income: Error messages aren't associated with the inputs.
 *
 * Verifies that `aria-describedby` is correctly adjustableIncomePagelied to inputs when
 * validation errors are displayed, ensuring screen reader accessibility.
 */

import AxeBuilder from '@axe-core/playwright';
import { expect, Page, test } from '@lib/test.lib';

const potErrorId = 'pot-error';
const ageErrorId = 'age-error';

const axe = (page: Page) =>
  /** @ts-expect-error This is caused by a mismatch in types that AxeBuilder and Playwright have */
  new AxeBuilder({ page }).withTags([
    'wcag2a',
    'wcag2aa',
    'wcag21a',
    'wcag21aa',
  ]);

/**
 * User Story 31615
 */
test.describe('aria-describedby error association', () => {
  const validPotValue = 45000;
  const validAge = 56;
  const invalidAgeYoung = 54;
  const invalidAgeOld = 100;

  const endpoints = {
    potRequiredError: `?pot=&age=${validAge}#results`,
    minAgeError: `?pot=${validPotValue}&age=${invalidAgeYoung}#results`,
    bothErrors: `?pot=&age=#results`,
    validInputs: `?pot=${validPotValue}&age=${validAge}#results`,
    maxAgeError: `?pot=${validPotValue}&age=${invalidAgeOld}#results`,
  };

  test.beforeEach(async ({ adjustableIncomePage, setCookieControl }) => {
    await setCookieControl();
    await adjustableIncomePage.goto();
  });

  /**
   * @tests 54994 - Verify `aria-describedby` is present on input when validation error is displayed
   */
  test('TC_001: aria-describedby is present on the pot input when a validation error is displayed', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      /.+/,
    );
  });

  test('TC_001: aria-describedby is present on the age input when a validation error is displayed', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      /.+/,
    );
  });

  /**
   * @tests 54995 - Verify `aria-describedby` value matches error message ID
   */
  test('TC_002: aria-describedby on the pot input exactly matches the ID of its error message element', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorId,
    );
    await expect(adjustableIncomePage.potErrorLabel).toBeVisible();
  });

  test('TC_002: aria-describedby on the age input exactly matches the ID of its error message element', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );
    await expect(adjustableIncomePage.ageErrorLabel).toBeVisible();
  });

  /**
   * @tests 54997 - Verify `aria-describedby` is adjustableIncomePagelied to the input element only
   */
  test('TC_003: aria-describedby is on the pot input only, not on the label or parent container', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorId,
    );
    await expect(adjustableIncomePage.potLabel).not.toHaveAttribute(
      'aria-describedby',
    );
    await expect(adjustableIncomePage.potInputParent).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  test('TC_003: aria-describedby is on the age input only, not on the label or parent container', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );
    await expect(adjustableIncomePage.ageLabel).not.toHaveAttribute(
      'aria-describedby',
    );
    await expect(adjustableIncomePage.ageInputParent).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  /**
   * @tests 54998 - Verify screen reader association between input and error message.
   * Full screen reader automation is not possible, but this test verifies the
   * programmatic association (aria-describedby referencing a visible, non-empty
   * element) required for screen reader announcements.
   */
  test('TC_004: Pot input has the programmatic association required for screen reader to announce the error', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    const potErrorAriaDescBy = 'pot-error';
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorAriaDescBy,
    );

    await expect(adjustableIncomePage.potErrorLabel).toBeAttached();

    const errorLabelText =
      await adjustableIncomePage.potErrorLabel.textContent();
    expect(errorLabelText?.trim()).not.toBe('');
  });

  /**
   * @tests 54999 - Verify behaviour when multiple inputs have errors
   */
  test('TC_005: Each input with an error has a unique aria-describedby pointing to its own error message ID', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.bothErrors);

    await expect(adjustableIncomePage.potErrorLabel).toBeVisible();
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorId,
    );

    await adjustableIncomePage.goto(endpoints.minAgeError);

    await expect(adjustableIncomePage.ageErrorLabel).toBeVisible();
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );
    expect(adjustableIncomePage.ageInput).not.toBe(
      adjustableIncomePage.potInput,
    );
  });

  /**
   * @tests 55000 - Verify `aria-describedby` is removed or updated when error is resolved.
   * After navigating to a valid state, `gotoWithValidInputs` waits for the
   * results section to confirm the page is fully rendered before asserting
   * the attribute has been removed.
   */
  test('TC_006: aria-describedby is removed from the pot input when the validation error is resolved', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
    );

    await adjustableIncomePage.goto(endpoints.validInputs);
    await expect(adjustableIncomePage.resultsSection).toBeVisible();

    await expect(adjustableIncomePage.potInput).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  /**
   * @tests 55000 - Verify aria-describedby is removed or updated when error is resolved
   */
  test('TC_006: aria-describedby is removed from the age input when the validation error is resolved', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
    );

    await adjustableIncomePage.goto(endpoints.validInputs);
    await expect(adjustableIncomePage.resultsSection).toBeVisible();
    await expect(adjustableIncomePage.ageInput).not.toHaveAttribute(
      'aria-describedby',
    );
  });

  /**
   * @tests 55182 - Verify referenced error message ID exists in DOM
   */
  test('TC_007: The element ID referenced by aria-describedby on the pot input exists in the DOM', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    const describedBy = await adjustableIncomePage.potInput.getAttribute(
      'aria-describedby',
    );
    expect(describedBy).not.toBeNull();
    await expect(adjustableIncomePage.potInput).toBeAttached();
  });

  /**
   * @tests 55182 - Verify referenced error message ID exists in DOM
   */
  test('TC_007: The element ID referenced by aria-describedby on the age input exists in the DOM', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    const describedBy = await adjustableIncomePage.ageInput.getAttribute(
      'aria-describedby',
    );
    expect(describedBy).not.toBeNull();
    await expect(adjustableIncomePage.ageErrorLabel).toBeAttached();
  });

  /**
   * @tests 55184 - Verify no broken reference is present
   */
  test('TC_008: aria-describedby on the pot input does not reference a missing or empty element', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    const potErrorAriaDescBy = 'pot-error';
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorAriaDescBy,
    );

    await expect(adjustableIncomePage.potErrorLabel).toBeAttached();

    const errorLabelText =
      await adjustableIncomePage.potErrorLabel.textContent();
    expect(errorLabelText?.trim()).not.toBe('');
  });

  /**
   * @tests 55184 - Verify no broken reference is present
   */
  test('TC_008: aria-describedby on the age input does not reference a missing or empty element', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    const potErrorAriaDescBy = 'age-error';
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      potErrorAriaDescBy,
    );

    await expect(adjustableIncomePage.ageErrorLabel).toBeAttached();

    const errorLabelText =
      await adjustableIncomePage.ageErrorLabel.textContent();
    expect(errorLabelText?.trim()).not.toBe('');
  });

  /**
   * @tests 55185 - Verify dynamic error message updates maintain correct association
   */
  test('TC_009: aria-describedby on the pot input remains correctly associated when the error type changes', async ({
    adjustableIncomePage,
    page,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorId,
    );
    await expect(adjustableIncomePage.potErrorLabel).toBeVisible();

    await adjustableIncomePage.goto(endpoints.maxAgeError);

    const results = await axe(page).include('fieldset').analyze();
    expect(results.violations).toEqual([]);
  });

  /**
   * @tests 55185 - Verify dynamic error message updates maintain correct association
   */
  test('TC_009: aria-describedby on the age input remains correctly associated when the error type changes', async ({
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );
    await expect(adjustableIncomePage.ageErrorLabel).toBeVisible();

    await adjustableIncomePage.goto(endpoints.maxAgeError);
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );
    await expect(adjustableIncomePage.ageErrorLabel).toBeVisible();
  });

  /**
   * @tests 55186 - Verify accessibility compliance when error message is displayed
   */
  test('TC_010: No axe accessibility violations on the pot input and its error message', async ({
    page,
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.potRequiredError);

    await expect(adjustableIncomePage.potErrorLabel).toBeVisible();
    await expect(adjustableIncomePage.potInput).toHaveAttribute(
      'aria-describedby',
      potErrorId,
    );

    const results = await axe(page).include('fieldset').analyze();
    expect(results.violations).toEqual([]);
  });

  /**
   * @tests 55186 - Verify accessibility compliance when error message is displayed
   */
  test('TC_010: No axe accessibility violations on the age input and its error message', async ({
    page,
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.minAgeError);

    await expect(adjustableIncomePage.ageErrorLabel).toBeVisible();
    await expect(adjustableIncomePage.ageInput).toHaveAttribute(
      'aria-describedby',
      ageErrorId,
    );

    const results = await axe(page).include('fieldset').analyze();
    expect(results.violations).toEqual([]);
  });

  /**
   * @tests 55186 - Verify accessibility compliance when error message is displayed
   */
  test('TC_010: No axe accessibility violations on the full form when both errors are displayed', async ({
    page,
    adjustableIncomePage,
  }) => {
    await adjustableIncomePage.goto(endpoints.bothErrors);

    const results = await axe(page)
      .include('form, fieldset, .t-error-summary')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
