import { expect, test } from '@lib/test.lib';
import { HouseholdComponent } from '@pages/components/household-bills.component';
import { IncomeComponent } from '@pages/components/your-income.component';

import testData from '../data/balanceEmailData.json';

const languages = ['en', 'cy'];

const summaryTab = 'tabpanel-7';

async function progressToSummary(
  incomeComponent: IncomeComponent,
  householdComponent: HouseholdComponent,
) {
  await incomeComponent.fillInput('pay', testData.emailData.payInput);
  await incomeComponent.continueButton.click();
  await householdComponent.fillInput('rent', testData.emailData.rent);
  await (await householdComponent.getTab(summaryTab)).click();
}

for (const language of languages) {
  test.describe('Budget Planner', () => {
    /**
     * @tests 57011 - Save and Return Journey with Valid Email
     *
     * @tests 57012 - Save and Return Journey with Invalid Email
     */
    test.beforeEach(async ({ setCookieControl }) => {
      await setCookieControl();
    });

    test(`Save and Return Journey with Valid Email - ${language}`, async ({
      incomeComponent,
      householdComponent,
      summaryComponent,
      saveEmailComponent,
      page,
    }) => {
      const expectedPayload = `{"userData":{"income":{"pay":"2,000"},"household-bills":{"rent":"745"}},"email":"mock-mail@maps.org.uk","language":"${language}","tabName":"summary","isEmbedded":false}`;

      await page.goto(`${language}/income`);

      await progressToSummary(incomeComponent, householdComponent);
      await summaryComponent.saveResults.click();
      await expect(saveEmailComponent.emailHint).toBeVisible();
      await expect(saveEmailComponent.emailTitle).toBeVisible();
      await expect(saveEmailComponent.emailErrorMessage).toBeHidden();

      await saveEmailComponent.inputEmail.fill(testData.emailData.email);
      const [request] = await Promise.all([
        page.waitForRequest(
          (req) =>
            req.method() === 'POST' && req.url().includes('save-and-return'),
        ),
        await saveEmailComponent.sendEmailButton.click(),
      ]);
      expect(request.postData()).toBe(expectedPayload);
    });

    test(`Save and Return Journey with Invalid Email - ${language}`, async ({
      page,
      incomeComponent,
      householdComponent,
      summaryComponent,
      saveEmailComponent,
    }) => {
      await page.goto(`${language}/income`);

      await progressToSummary(incomeComponent, householdComponent);
      await summaryComponent.saveResults.click();
      await expect(saveEmailComponent.emailHint).toBeVisible();
      await expect(saveEmailComponent.emailTitle).toBeVisible();
      await expect(saveEmailComponent.emailErrorMessage).toBeHidden();

      await saveEmailComponent.inputEmail.fill(testData.emailData.invalidEmail);
      await saveEmailComponent.sendEmailButton.click();
      await expect(saveEmailComponent.emailHint).toBeVisible();
    });
  });
}
