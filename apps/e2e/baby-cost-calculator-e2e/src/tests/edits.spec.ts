import { expect, type Page, test } from '@lib/test.lib';
import { BabyDueDateComponent } from '@pages/components/BabyDueDate.component';
import {
  EssentialItemsComponent,
  EssentialKey,
} from '@pages/components/EssentialItems.component';
import {
  NonEssentialItemsComponent,
  NonEssentialKey,
} from '@pages/components/NonEssentialItems.component';
import { ResultsComponent } from '@pages/components/Results.component';
import { SummaryComponent } from '@pages/components/Summary.component';
import {
  SAVING_FREQUENCY,
  YourBudgetComponent,
} from '@pages/components/YourBudget.component';

import testData from '../data/babyCostsCalculator.json';

type EditScenario = (typeof testData.editJourney)[number];

async function fillEssentialInputs(
  essentialItems: EssentialItemsComponent,
  entries: Record<string, string>,
) {
  for (const [key, value] of Object.entries(entries)) {
    const input = await essentialItems.essentialsInput(key as EssentialKey);
    await input.fill(value);
  }
}

async function fillNonEssentialInputs(
  nonEssentialItems: NonEssentialItemsComponent,
  entries: Record<string, string>,
) {
  for (const [key, value] of Object.entries(entries)) {
    await nonEssentialItems.fillNonEssentialInput(
      key as NonEssentialKey,
      value,
    );
  }
}

async function fillBudgetInputs(
  yourBudget: YourBudgetComponent,
  budget: EditScenario['budget'],
) {
  await yourBudget.moneyInBankInput.fill(budget.moneyInBank);
  await yourBudget.beforeBabyPriceInput.fill(budget.saving);
  await yourBudget.setBabyWeekDropdown(
    budget.savingFrequency as SAVING_FREQUENCY,
  );
}

async function assertSummaryRows(
  summary: SummaryComponent,
  data: EditScenario,
  rows: string[],
  updatedSummary: boolean,
) {
  const summaryData = updatedSummary ? data.updatedSummary : data.summary;

  const formattedResult =
    summaryData.result < 0
      ? `-£${summary.formatNegativeNumber(summaryData.result)}`
      : `£${summary.formatNegativeNumber(summaryData.result)}`;

  const expectedValues: Record<string, string> = {
    'Baby due in': `${data.months} months`,
    Essentials: summaryData.essentials,
    'Non-Essentials': summaryData.nonEssentials,
    'Your Budget': summaryData.yourBudget,
    Result: formattedResult,
  };

  for (const row of rows) {
    expect(await summary.getSummaryRowValue(row)).toBe(expectedValues[row]);
  }
}

async function completeInitialJourney({
  babyDueDate,
  essentialItems,
  nonEssentialItems,
  yourBudget,
  summary,
  testScenario,
}: {
  page: Page;
  babyDueDate: BabyDueDateComponent;
  essentialItems: EssentialItemsComponent;
  nonEssentialItems: NonEssentialItemsComponent;
  yourBudget: YourBudgetComponent;
  summary: SummaryComponent;
  results: ResultsComponent;
  testScenario: EditScenario;
}) {
  await babyDueDate.goto('/en');
  await expect(babyDueDate.pageTitle).toContainText(testData.dueDate.title);
  await babyDueDate.selectBabyDueDate(String(testScenario.months));
  await babyDueDate.continueButton.click();

  await expect(essentialItems.pageTitle).toContainText(
    testData.essentials.title,
  );
  await fillEssentialInputs(
    essentialItems,
    testScenario.essentials as Record<string, string>,
  );
  await essentialItems.continueButton.click();

  await expect(nonEssentialItems.pageTitle).toContainText(
    testData.nonEssentials.title,
  );
  await fillNonEssentialInputs(
    nonEssentialItems,
    testScenario.nonEssentials as Record<string, string>,
  );
  await nonEssentialItems.continueButton.click();

  await expect(yourBudget.budgetTitle).toContainText(testData.yourBudget.title);
  await fillBudgetInputs(yourBudget, testScenario.budget);
  await yourBudget.continueButton.click();

  await assertSummaryRows(
    summary,
    testScenario,
    ['Baby due in', 'Essentials', 'Non-Essentials', 'Your Budget', 'Result'],
    false,
  );
}

async function completeEditJourney({
  essentialItems,
  nonEssentialItems,
  results,
  testScenario,
}: {
  essentialItems: EssentialItemsComponent;
  nonEssentialItems: NonEssentialItemsComponent;
  results: ResultsComponent;
  testScenario: EditScenario;
}) {
  await results.getBreakdownRowEditButton(testScenario.editJourney).click();
  if (testScenario.editJourney === 'Essential Items') {
    await fillEssentialInputs(
      essentialItems,
      testScenario.updatedEssentials as Record<string, string>,
    );
    await essentialItems.continueButton.click();
  } else {
    await fillNonEssentialInputs(
      nonEssentialItems,
      testScenario.updatedNonEssentials as Record<string, string>,
    );
    await nonEssentialItems.continueButton.click();
  }
}

async function runEditJourneyScenario({
  page,
  babyDueDate,
  essentialItems,
  nonEssentialItems,
  yourBudget,
  results,
  summary,
  testScenario,
}: {
  page: Page;
  babyDueDate: BabyDueDateComponent;
  essentialItems: EssentialItemsComponent;
  nonEssentialItems: NonEssentialItemsComponent;
  yourBudget: YourBudgetComponent;
  results: ResultsComponent;
  summary: SummaryComponent;
  testScenario: EditScenario;
}) {
  await completeInitialJourney({
    page,
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    results,
    summary,
    testScenario,
  });
  await completeEditJourney({
    essentialItems,
    nonEssentialItems,
    results,
    testScenario,
  });

  await assertSummaryRows(
    summary,
    testScenario,
    ['Baby due in', 'Essentials', 'Non-Essentials', 'Your Budget', 'Result'],
    true,
  );
}

test.describe('Baby cost calculator', () => {
  /**
   * @tests 54750 - handle edit journey for essential items
   */
  test(`Should handle edit journey ${testData.editJourney[0].label}`, async ({
    page,
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    summary,
    results,
  }) => {
    await runEditJourneyScenario({
      page,
      babyDueDate,
      essentialItems,
      nonEssentialItems,
      yourBudget,
      summary,
      results,
      testScenario: testData.editJourney[0] as EditScenario,
    });
  });

  /**
   * @tests 54775 - handle edit journey for non essential items
   */
  test(`Should handle edit journey ${testData.editJourney[1].label}`, async ({
    page,
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    summary,
    results,
  }) => {
    await runEditJourneyScenario({
      page,
      babyDueDate,
      essentialItems,
      nonEssentialItems,
      yourBudget,
      summary,
      results,
      testScenario: testData.editJourney[1] as EditScenario,
    });
  });
});
