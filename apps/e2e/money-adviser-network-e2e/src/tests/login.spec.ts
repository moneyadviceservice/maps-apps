import { errorMessages, pageLoads } from '@data/analytics.json';
import { expect, test } from '@lib/test.lib';

test.describe('Authentication', () => {
  test.beforeEach(async ({ setCookieControl, loginPage, page }) => {
    await setCookieControl();
    await loginPage.goto();
    await expect(page).toHaveURL(/\/login$/);
  });

  /**
   * @tests 56085 - Validate login process and text
   */
  test('validate login page text', async ({ page, loginPage }) => {
    const { sections } = loginPage;

    await expect(loginPage.header).toHaveText('Debt advice referral');
    await expect(loginPage.subHeader).toHaveText('Money Adviser Network');

    await expect(sections.parnterAccountAccessAndProblems).toHaveText(
      'Access your partner accountReferral Partner IDPlease enter your referral partner ID provided by MaPSContinueProblems accessing your account?Please contact moneyadvisernetwork@maps.org.uk',
    );
    await expect(sections.helpWithDebtAdviceAndBusinessDebt).toHaveText(
      'Help customers get debt adviceUse this service to refer customers for free personalised debt advice.To be eligible, the customer must:Have missed payments or struggling to make paymentsNot be currently receiving free debt adviceLive in EnglandNot be self-employed or a company directorIf you need access to refer customers, contact:moneyadvisernetwork@maps.org.ukBusiness debt?If the customer has business debt, direct them to Business Debtline.Tel: 0800 197 6026Monday to Friday: 9am - 8pmwww.businessdebtline.org (opens in a new tab)',
    );

    await expect(loginPage.referralPartnerIdField).toBeVisible();
    await expect(loginPage.confirmButton).toBeVisible();
    await expect(page).toHavePartialDataLayerEvent(pageLoads.loginPage);
  });

  /**
   * @tests 56092 - Validate incorrect login error messages
   */
  test('validate login error messages', async ({ page, loginPage }) => {
    const missingPartnerIdMessage = 'Referral Partner ID is required.';
    const notRecognisedMessge = 'Referral ID is not recognised.';

    await loginPage.confirmButton.click();

    await expect(page).toHavePartialDataLayerEvent(errorMessages.missingId);
    await expect(loginPage.errorLabel).toHaveText(missingPartnerIdMessage);
    await expect(loginPage.errorMessage).toHaveText(missingPartnerIdMessage);

    await loginPage.referralPartnerIdField.fill('abc123');
    await loginPage.confirmButton.click();

    await expect(page).toHavePartialDataLayerEvent(errorMessages.invalidId);
    await expect(loginPage.errorLabel).toHaveText(notRecognisedMessge);
    await expect(loginPage.errorMessage).toHaveText(notRecognisedMessge);
  });
});
