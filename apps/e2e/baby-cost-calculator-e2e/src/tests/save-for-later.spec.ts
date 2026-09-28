import { expect, type Page, test } from '@lib/test.lib';
import { SummaryComponent } from '@pages/components/Summary.component';
import {
  SAVING_FREQUENCY,
  YourBudgetComponent,
} from '@pages/components/YourBudget.component';
import { SaveForLaterPage } from '@pages/SaveForLater.page';

const expectedPayload =
  'isEmbed=false&language=en&toolBaseUrl=%2Fen%2F&tab=5&savedData=%7B%22q-baby-due%22%3A%229%22%2C%22q-cot-cotbed%22%3A%22100%22%2C%22q-changing-table%22%3A%22150%22%2C%22q-in-bank%22%3A%22500%22%2C%22q-can-save-i%22%3A%22100%22%2C%22q-can-save-s%22%3A%2228%22%7D&validation=&lastTab=&email=abc%40gmail.com';

async function fillBudgetInputs(yourBudget: YourBudgetComponent) {
  await yourBudget.moneyInBankInput.fill('500');
  await yourBudget.beforeBabyPriceInput.fill('100');
  await yourBudget.setBabyWeekDropdown(SAVING_FREQUENCY.PER_4_WEEKS);
}

async function validateSavePage(saveForLater: SaveForLaterPage) {
  await expect(saveForLater.saveTitle).toBeVisible();
  await expect(saveForLater.saveDescription).toBeVisible();
  await expect(saveForLater.saveEmailTitle).toBeVisible();
  await expect(saveForLater.saveEmailInput).toBeVisible();
  await expect(saveForLater.saveEmailButton).toBeVisible();
}

async function inputAndValidateEmailSent(
  page: Page,
  saveForLater: SaveForLaterPage,
) {
  await saveForLater.saveEmailInput.fill('abc@gmail.com');

  const [request] = await Promise.all([
    page.waitForRequest(
      (req) => req.method() === 'POST' && req.url().includes('save-and-return'),
    ),
    saveForLater.saveEmailButton.click(),
  ]);
  expect(request.postData()).toBe(expectedPayload);
}

async function assertSummaryRows(
  summary: SummaryComponent,
  rows: string[],
  babyDue: string,
  essentials: string,
  nonEssentials: string,
  budget: string,
  result: string,
) {
  const expectedValues: Record<string, string> = {
    'Baby due in': babyDue,
    Essentials: essentials,
    'Non-Essentials': nonEssentials,
    'Your Budget': budget,
    Result: result,
  };

  for (const row of rows) {
    expect(await summary.getSummaryRowValue(row)).toBe(expectedValues[row]);
  }
}

test.describe('Baby cost calculator', () => {
  /**
   * @tests 54780 - let users save progress via email
   */
  test(`should let users save progress via email`, async ({
    page,
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    summary,
    results,
    saveForLater,
  }) => {
    await babyDueDate.goto('/en');
    await babyDueDate.selectBabyDueDate('9');
    await babyDueDate.continueButton.click();

    await essentialItems
      .essentialsInput('cotBed')
      .then((input) => input.fill('100'));
    await essentialItems.continueButton.click();

    await (
      await nonEssentialItems.nonEssentialsInput('changingTable')
    ).fill('150');
    await essentialItems.continueButton.click();

    await fillBudgetInputs(yourBudget);
    await yourBudget.continueButton.click();

    await expect(results.babyCostsPrice).toContainText('£1,214.29');
    await assertSummaryRows(
      summary,
      ['Baby due in', 'Essentials', 'Non-Essentials', 'Your Budget', 'Result'],
      '9 months',
      '£100.00',
      '£150.00',
      '£1,464.29',
      '£1,214.29',
    );
    await results.saveButton.click();
    await validateSavePage(saveForLater);
    await inputAndValidateEmailSent(page, saveForLater);
  });
});
