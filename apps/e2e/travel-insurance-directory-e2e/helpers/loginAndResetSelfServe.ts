import { type Page } from '@playwright/test';

import { selfServeCreds } from '../data/selfServeCredentials.data';
import { SelfServePage } from '../pages/SelfServePage';

export async function loginToSelfServe(page: Page): Promise<SelfServePage> {
  const selfServePage = new SelfServePage(page);
  await selfServePage.goto();
  await selfServePage.acceptCookiesIfVisible();
  await selfServePage.fillEmailField(selfServeCreds.ACCOUNT_LOGIN_EMAIL);
  await selfServePage.clickLoginButton();
  await selfServePage.fillOtpField(selfServeCreds.VALID_OTP);
  await selfServePage.clickLoginButton();
  return selfServePage;
}

export async function resetSelfServe(
  page: Page,
  state = 'setEmptySelfServeState',
): Promise<SelfServePage> {
  const selfServePage = new SelfServePage(page);
  await selfServePage.resetTestDataAndReturnToAccountPage(state);
  return selfServePage;
}

export async function loginAndResetSelfServe(
  page: Page,
  state = 'setEmptySelfServeState',
): Promise<SelfServePage> {
  const selfServePage = await loginToSelfServe(page);
  await selfServePage.resetTestDataAndReturnToAccountPage(state);
  return selfServePage;
}
