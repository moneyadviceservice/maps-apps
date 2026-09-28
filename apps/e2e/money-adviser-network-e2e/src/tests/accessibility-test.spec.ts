import { expect, test } from '@lib/test.lib';

import { KeyboardUtils } from '../utils/keyboard.utils';

test.describe('Accessibility testing', () => {
  test.beforeEach(async ({ setCookieControl, loginPage, page }) => {
    await setCookieControl();
    await loginPage.goto();
    await loginPage.loginWithId('1234567890');
    await expect(page).toHaveURL(/\/start\/q-1$/);
  });

  test('verifying keyboard focus for each stage', async ({
    page,
    questions,
  }) => {
    const {
      customerNeedsPage,
      doesCustomerLiveInEnglandPage,
      isSelfEmployedPage,
      preferredContactMethodPage,
    } = questions;

    const helpSelectionError =
      'Select whether the customer needs help with day-to-day money management or with debt.';

    await KeyboardUtils.pressUntilFocused(
      page,
      customerNeedsPage.continueButton,
      'Tab',
    );

    await KeyboardUtils.pressKey(
      page,
      customerNeedsPage.continueButton,
      'Enter',
    );

    await expect(customerNeedsPage.errorLabel).toHaveText(helpSelectionError);
    await expect(customerNeedsPage.errorSummary).toHaveText(helpSelectionError);
    await KeyboardUtils.pressUntilFocused(
      page,
      customerNeedsPage.errorSummary,
      'Tab',
    );

    await KeyboardUtils.pressKey(page, customerNeedsPage.errorSummary, 'Enter');

    await expect(
      customerNeedsPage.optionCheckbox('Money management help'),
    ).toBeFocused();

    await KeyboardUtils.pressKey(
      page,
      customerNeedsPage.optionCheckbox('Money management help'),
      'ArrowDown',
    );

    await KeyboardUtils.pressKey(
      page,
      customerNeedsPage.optionCheckbox('Debt advice'),
      'Space',
    );
    await expect(customerNeedsPage.optionCheckbox('Debt advice')).toBeChecked();

    await KeyboardUtils.pressUntilFocused(
      page,
      customerNeedsPage.continueButton,
      'Tab',
    );

    await KeyboardUtils.pressKey(
      page,
      customerNeedsPage.continueButton,
      'Enter',
    );

    await expect(doesCustomerLiveInEnglandPage).toHaveExpectedPageTitles();
    await KeyboardUtils.pressUntilFocused(
      page,
      doesCustomerLiveInEnglandPage.continueButton,
      'Tab',
    );

    await KeyboardUtils.pressKey(
      page,
      doesCustomerLiveInEnglandPage.continueButton,
      'Enter',
    );

    const englandSelectionError =
      'Select whether the customer lives in England or not.';

    await expect(doesCustomerLiveInEnglandPage.errorLabel).toHaveText(
      englandSelectionError,
    );
    await expect(doesCustomerLiveInEnglandPage.errorSummary).toHaveText(
      englandSelectionError,
    );
    await KeyboardUtils.pressUntilFocused(
      page,
      doesCustomerLiveInEnglandPage.errorSummary,
      'Tab',
    );

    await KeyboardUtils.pressKey(
      page,
      doesCustomerLiveInEnglandPage.errorSummary,
      'Enter',
    );

    await expect(
      doesCustomerLiveInEnglandPage.optionCheckbox('Yes'),
    ).toBeFocused();

    await KeyboardUtils.pressKey(
      page,
      doesCustomerLiveInEnglandPage.optionCheckbox('Yes'),
      'Space',
    );
    await expect(
      doesCustomerLiveInEnglandPage.optionCheckbox('Yes'),
    ).toBeChecked();

    await KeyboardUtils.pressUntilFocused(
      page,
      doesCustomerLiveInEnglandPage.continueButton,
      'Tab',
    );

    await KeyboardUtils.pressKey(
      page,
      doesCustomerLiveInEnglandPage.continueButton,
      'Enter',
    );

    await expect(isSelfEmployedPage).toHaveExpectedPageTitles();
    await KeyboardUtils.pressUntilFocused(
      page,
      isSelfEmployedPage.continueButton,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      isSelfEmployedPage.continueButton,
      'Enter',
    );

    const selfEmployedError =
      'Select whether the customer is self employed / a company director (yes) - or neither (no)';
    await expect(isSelfEmployedPage.errorLabel).toHaveText(selfEmployedError);
    await expect(isSelfEmployedPage.errorSummary).toHaveText(selfEmployedError);
    await KeyboardUtils.pressUntilFocused(
      page,
      isSelfEmployedPage.errorSummary,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      isSelfEmployedPage.errorSummary,
      'Enter',
    );
    await expect(isSelfEmployedPage.optionCheckbox('Yes')).toBeFocused();
    await KeyboardUtils.pressKey(
      page,
      isSelfEmployedPage.optionCheckbox('Yes'),
      'ArrowDown',
    );
    await KeyboardUtils.pressKey(
      page,
      isSelfEmployedPage.optionCheckbox('No'),
      'Space',
    );
    await expect(isSelfEmployedPage.optionCheckbox('No')).toBeChecked();
    await KeyboardUtils.pressUntilFocused(
      page,
      isSelfEmployedPage.continueButton,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      isSelfEmployedPage.continueButton,
      'Enter',
    );

    await expect(preferredContactMethodPage).toHaveExpectedPageTitles();
    await KeyboardUtils.pressUntilFocused(
      page,
      preferredContactMethodPage.continueButton,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.continueButton,
      'Enter',
    );

    const contactMethodError =
      'Select whether the customer wants help online, by phone or face to face.';
    await expect(preferredContactMethodPage.errorLabel).toHaveText(
      contactMethodError,
    );
    await expect(preferredContactMethodPage.errorSummary).toHaveText(
      contactMethodError,
    );
    await KeyboardUtils.pressUntilFocused(
      page,
      preferredContactMethodPage.errorSummary,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.errorSummary,
      'Enter',
    );
    await expect(
      preferredContactMethodPage.optionCheckbox('Online'),
    ).toBeFocused();
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.optionCheckbox('Online'),
      'ArrowDown',
    );
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.optionCheckbox('Telephone'),
      'ArrowDown',
    );
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.optionCheckbox('Face to face'),
      'Space',
    );
    await expect(
      preferredContactMethodPage.optionCheckbox('Face to face'),
    ).toBeChecked();
    await KeyboardUtils.pressUntilFocused(
      page,
      preferredContactMethodPage.continueButton,
      'Tab',
    );
    await KeyboardUtils.pressKey(
      page,
      preferredContactMethodPage.continueButton,
      'Enter',
    );
  });
});
