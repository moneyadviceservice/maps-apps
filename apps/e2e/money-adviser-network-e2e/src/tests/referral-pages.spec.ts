import { pageLoads, toolStarts } from '@data/analytics.json';
import { expect, test } from '@lib/test.lib';

test.describe('Debt Advice Referral', () => {
  test.beforeEach(async ({ setCookieControl, loginPage, page }) => {
    await setCookieControl();
    await loginPage.goto();
    await loginPage.loginWithId('1234567890');
    await expect(page).toHaveURL(/\/start\/q-1$/);
  });

  /**
   * @tests 55743 - Money Management - Customer Referred to Links and a New Referral Started
   */
  test('customer referred to links and a new referral started', async ({
    page,
    questions,
    resources,
  }) => {
    const { customerNeedsPage } = questions;
    const { referCustomerToLinksPage } = resources;

    await expect(customerNeedsPage).toHaveExpectedPageTitles();
    await expect(customerNeedsPage).toHaveExpectedOptions();

    await expect(page).toHavePartialDataLayerEvent(pageLoads.generic);
    await expect(page).toHavePartialDataLayerEvent(toolStarts.generic);

    await customerNeedsPage.expandableSectionTitle.click();
    await expect(customerNeedsPage).toHaveExpectedExpandableSection();

    await customerNeedsPage.option('Money management help').click();
    await customerNeedsPage.continueButton.click();

    await expect(referCustomerToLinksPage).toHaveExpectedPageTitles();
    await expect(referCustomerToLinksPage).toHaveExpectedContent();

    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.referCustomerToLinks,
    );

    await referCustomerToLinksPage.backButton.click();
    await expect(page).toHaveURL(/\/start\/q-1\?q-1=0$/);

    const debtAdviceCheckbox = customerNeedsPage.optionCheckbox('Debt advice');
    const moneyManagementCheckbox = customerNeedsPage.optionCheckbox(
      'Money management help',
    );

    /**
     * When going back from a page, previously checked boxes should be pre-checked.
     */
    await expect(moneyManagementCheckbox).toBeChecked();
    await expect(debtAdviceCheckbox).not.toBeChecked();

    await customerNeedsPage.continueButton.click();
    await expect(referCustomerToLinksPage).toHaveExpectedPageTitles();
    await expect(referCustomerToLinksPage).toHaveExpectedContent();

    /**
     * When making another referral, options should not be pre-checked when loading the page.
     */
    await referCustomerToLinksPage.makeAnotherReferralButton.click();
    await expect(page).toHaveURL(/\/start\/q-1$/);
    await expect(moneyManagementCheckbox).not.toBeChecked();
    await expect(debtAdviceCheckbox).not.toBeChecked();

    await expect(page).toHavePartialDataLayerEvent(pageLoads.generic);

    await customerNeedsPage.option('Money management help').click();
    await customerNeedsPage.continueButton.click();

    await referCustomerToLinksPage.signOutButton.click();
    await expect(page).toHaveURL(/\/en\/login$/);
  });

  /**
   * @tests 55889 - Debt Advice – Customer Not Living in England
   */
  test('customer not living in england', async ({
    page,
    questions,
    resources,
  }) => {
    const { customerNeedsPage, doesCustomerLiveInEnglandPage } = questions;
    const { referCustomerToDaltPage } = resources;

    const helpSelectionError =
      'Select whether the customer needs help with day-to-day money management or with debt.';

    await customerNeedsPage.continueButton.click();
    await expect(customerNeedsPage.errorLabel).toHaveText(helpSelectionError);
    await expect(customerNeedsPage.errorSummary).toHaveText(helpSelectionError);

    await customerNeedsPage.option('Debt advice').click();
    await customerNeedsPage.continueButton.click();

    await expect(doesCustomerLiveInEnglandPage).toHaveExpectedPageTitles();
    await expect(doesCustomerLiveInEnglandPage).toHaveExpectedOptions();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.whereDoesCustomerLive,
    );

    const customerLivingNoSelectionError =
      'Select whether the customer lives in England or not.';

    await doesCustomerLiveInEnglandPage.continueButton.click();

    await expect(page).toHaveURL(/\?q-1=1&error=q-2$/);
    await expect(doesCustomerLiveInEnglandPage.errorLabel).toHaveText(
      customerLivingNoSelectionError,
    );
    await expect(doesCustomerLiveInEnglandPage.errorSummary).toHaveText(
      customerLivingNoSelectionError,
    );

    await doesCustomerLiveInEnglandPage.option('No').click();
    await doesCustomerLiveInEnglandPage.continueButton.click();

    await expect(referCustomerToDaltPage).toHaveExpectedPageTitles();
    await expect(referCustomerToDaltPage).toHaveExpectedContent();
    await expect(page).toHavePartialDataLayerEvent(
      pageLoads.referCustomerToDalt,
    );
  });
});
