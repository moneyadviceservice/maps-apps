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

type Scenario = (typeof testData.tests)[number];

async function validateAndfillEssentialInputs(
  essentialItems: EssentialItemsComponent,
  entries: Record<string, string>,
) {
  for (const [key, value] of Object.entries(entries)) {
    const itemKey = key as EssentialKey;

    await expect(essentialItems.essentialsTitle).toContainText(
      testData.essentials.subHeading,
    );
    await expect(essentialItems.essentialsDescription).toContainText(
      testData.essentials.primaryInfo,
    );
    expect(
      await (await essentialItems.essentialItemTitle(itemKey)).textContent(),
    ).toContain(testData.essentials[`${itemKey}Label`]);

    const dropdown = await essentialItems.expandEssentialInfo(itemKey);
    await dropdown.click();

    expect(
      await (await essentialItems.expandEssentialInfo(itemKey)).textContent(),
    ).toContain(testData.essentials[`${itemKey}MoreAbout`]);

    expect(
      await (await essentialItems.essentialInfo(itemKey)).textContent(),
    ).toContain(testData.essentials[`${itemKey}Description`]);

    const input = await essentialItems.essentialsInput(itemKey);
    await input.fill(value);
  }
}

async function validateAndFillNonEssentialInputs(
  nonEssentialItems: NonEssentialItemsComponent,
  entries: Record<string, string>,
) {
  for (const [key, value] of Object.entries(entries)) {
    const itemKey = key as NonEssentialKey;

    const label =
      testData.nonEssentials[
        `${itemKey}Label` as keyof typeof testData.nonEssentials
      ];
    const moreAbout =
      testData.nonEssentials[
        `${itemKey}MoreAbout` as keyof typeof testData.nonEssentials
      ];
    const description =
      testData.nonEssentials[
        `${itemKey}Description` as keyof typeof testData.nonEssentials
      ];

    await nonEssentialItems.expandSectionForInput(itemKey);
    await expect(
      await nonEssentialItems.nonEssentialsItemTitle(itemKey),
    ).toHaveText(label);

    const dropdown = await nonEssentialItems.nonEssentialInfoSummary(itemKey);
    await expect(dropdown).toContainText(moreAbout);
    await dropdown.click();
    await expect(
      await nonEssentialItems.nonEssentialInfo(itemKey),
    ).toContainText(description);

    await (await nonEssentialItems.nonEssentialsInput(itemKey)).fill(value);
  }
}

async function validateAndfillBudgetInputs(
  yourBudget: YourBudgetComponent,
  data: Scenario,
) {
  await yourBudget.moneyInBankInput.click();
  await yourBudget.moneyInBankInput.fill(data.budget.moneyInBank);
  await yourBudget.moneyInBankInput.fill(data.budget.moneyInBank);
  await yourBudget.beforeBabyPriceInput.fill(data.budget.saving);
  await yourBudget.setBabyWeekDropdown(
    data.budget.savingFrequency as SAVING_FREQUENCY,
  );
}

async function assertSummaryRows(
  summary: SummaryComponent,
  data: Scenario,
  rows: string[],
) {
  const formattedResult =
    data.summary.result < 0
      ? `-£${summary.formatNegativeNumber(data.summary.result)}`
      : `£${summary.formatNegativeNumber(data.summary.result)}`;

  const expectedValues: Record<string, string> = {
    'Baby due in': `${data.months} months`,
    Essentials: data.summary.essentials,
    'Non-Essentials': data.summary.nonEssentials,
    'Your Budget': data.summary.yourBudget,
    Result: formattedResult,
  };

  for (const row of rows) {
    expect(await summary.getSummaryRowValue(row)).toBe(expectedValues[row]);
  }
}

async function completeAndValidateBabyDue({
  babyDueDate,
  summary,
  testScenario,
}: {
  babyDueDate: BabyDueDateComponent;
  summary: SummaryComponent;
  testScenario: Scenario;
}) {
  expect(babyDueDate.url).toContain(testData.dueDate.url);
  await expect(babyDueDate.pageTitle).toContainText(testData.dueDate.title);
  await expect(babyDueDate.babyDueDateTitle).toContainText(
    testData.dueDate.subHeading,
  );
  await expect(babyDueDate.babyDueDateDescription).toContainText(
    testData.dueDate.primaryInfo,
  );
  await expect(babyDueDate.babyDueDateDropdownTitle).toContainText(
    testData.dueDate.selectDropdownLabel,
  );

  await babyDueDate.selectBabyDueDate(String(testScenario.months));

  await assertSummaryRows(summary, testScenario, ['Baby due in']);
}

async function completeAndValidateEssentials({
  essentialItems,
  summary,
  testScenario,
}: {
  essentialItems: EssentialItemsComponent;
  summary: SummaryComponent;
  testScenario: Scenario;
}) {
  const expectedUrl = testData.essentials.url.replace(
    '%MONTHS%',
    String(testScenario.months),
  );
  expect(essentialItems.url).toContain(expectedUrl);

  await expect(essentialItems.pageTitle).toContainText(
    testData.essentials.title,
  );
  await expect(essentialItems.essentialsTitle).toContainText(
    testData.essentials.subHeading,
  );
  await expect(essentialItems.essentialsDescription).toContainText(
    testData.essentials.primaryInfo,
  );
  await validateAndfillEssentialInputs(
    essentialItems,
    testScenario.essentials as Record<string, string>,
  );
  await assertSummaryRows(summary, testScenario, ['Baby due in', 'Essentials']);
}

async function completeAndValidateNonEssentials({
  nonEssentialItems,
  summary,
  testScenario,
}: {
  nonEssentialItems: NonEssentialItemsComponent;
  summary: SummaryComponent;
  testScenario: Scenario;
}) {
  const expectedUrl = testData.nonEssentials.url.replace(
    '%MONTHS%',
    String(testScenario.months),
  );
  expect(nonEssentialItems.url).toContain(expectedUrl);

  await expect(nonEssentialItems.pageTitle).toContainText(
    testData.nonEssentials.title,
  );
  await expect(nonEssentialItems.nonEssentialsTitle).toContainText(
    testData.nonEssentials.subHeading,
  );
  await expect(nonEssentialItems.nonEssentialsDescription).toContainText(
    testData.nonEssentials.primaryInfo,
  );
  await validateAndFillNonEssentialInputs(
    nonEssentialItems,
    testScenario.nonEssentials as Record<string, string>,
  );
  await assertSummaryRows(summary, testScenario, [
    'Baby due in',
    'Essentials',
    'Non-Essentials',
  ]);
}

async function completeAndValidateBudget({
  budget,
  summary,
  testScenario,
}: {
  budget: YourBudgetComponent;
  summary: SummaryComponent;
  testScenario: Scenario;
}) {
  await expect(budget.budgetTitle).toContainText(testData.yourBudget.title);
  await expect(budget.budgetDescription).toContainText(
    testData.yourBudget.primaryInfo,
  );
  await expect(budget.budgetSubheading).toContainText(
    testData.yourBudget.subHeading,
  );
  await expect(budget.moneyInBankTitle).toContainText(
    testData.yourBudget.moneyLabel,
  );
  await expect(budget.moneyInBankDescription).toContainText(
    testData.yourBudget.moneySecondaryLabel,
  );
  await expect(budget.expandMoreAboutBudgetInfo).toContainText(
    testData.yourBudget.moneyMoreAbout,
  );
  await budget.expandMoreAboutBudgetInfo.click();
  await expect(budget.moreAboutBudgetInfo).toContainText(
    testData.yourBudget.moneyDescription,
  );
  await expect(budget.beforeBabyTitle).toContainText(
    testData.yourBudget.savingsLabel,
  );
  await expect(budget.expandBabyPriceInfo).toContainText(
    testData.yourBudget.savingsMoreAbout,
  );
  await budget.expandBabyPriceInfo.click();
  await expect(budget.babyPriceInfo).toContainText(
    testData.yourBudget.savingsDescription,
  );

  await validateAndfillBudgetInputs(budget, testScenario);

  await assertSummaryRows(summary, testScenario, [
    'Baby due in',
    'Essentials',
    'Non-Essentials',
    'Your Budget',
  ]);
}

async function validateResults({
  results,
  summary,
  testScenario,
}: {
  results: ResultsComponent;
  summary: SummaryComponent;
  testScenario: Scenario;
}) {
  await expect(results.resultsTitle).toContainText(testData.results.title);
  await expect(results.calloutTitle).toHaveText(testData.results.calloutTitle);

  if (testScenario.summary.result > 0) {
    await expect(results.calloutMessage).toHaveText(
      testData.results.calloutPositiveInfo.replace(
        '%MONEY_LEFT%',
        testScenario.summary.result.toString(),
      ),
    );
  } else {
    const formatted = results.formatNegativeNumber(testScenario.summary.result);

    await expect(results.calloutMessage).toHaveText(
      testData.results.calloutNegativeInfo.replace('%MONEY_LEFT%', formatted),
    );
  }

  await assertSummaryRows(summary, testScenario, [
    'Baby due in',
    'Essentials',
    'Non-Essentials',
    'Your Budget',
    'Result',
  ]);
}

async function runScenario({
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
  testScenario: Scenario;
}) {
  await babyDueDate.goto('/en');

  await completeAndValidateBabyDue({
    babyDueDate,
    summary,
    testScenario,
  });
  await babyDueDate.continueButton.click();

  await completeAndValidateEssentials({
    essentialItems,
    summary,
    testScenario,
  });
  await essentialItems.continueButton.click();

  await completeAndValidateNonEssentials({
    nonEssentialItems,
    summary,
    testScenario,
  });
  await nonEssentialItems.continueButton.click();

  await completeAndValidateBudget({
    budget: yourBudget,
    summary,
    testScenario,
  });
  await yourBudget.continueButton.click();

  await validateResults({
    results,
    summary,
    testScenario,
  });
}

test.describe('Baby cost calculator', () => {
  for (const testScenario of testData.tests as Scenario[]) {
    /**
     * @tests 54666 - Positive resuilt with per day scenario
     * @tests 54743 - Negative result with per week scenario
     * @tests 54748 - Negative result with only partial entries with 2 weeks scenario
     * @tests 54749 - Negative result with partial entries per 4 week scenario
     */
    test(`Baby cost calculator ${testScenario.label}`, async ({
      page,
      babyDueDate,
      essentialItems,
      nonEssentialItems,
      yourBudget,
      summary,
      results,
    }) => {
      await runScenario({
        page,
        babyDueDate,
        essentialItems,
        nonEssentialItems,
        yourBudget,
        results,
        summary,
        testScenario,
      });
    });
  }

  /**
   * @tests 54785 - reset calculator to the beginning
   */
  test(`should be able to reset calculator to the beginning`, async ({
    babyDueDate,
    essentialItems,
    nonEssentialItems,
    yourBudget,
    results,
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

    await yourBudget.moneyInBankInput.fill('500');
    await yourBudget.beforeBabyPriceInput.fill('250');
    await yourBudget.setBabyWeekDropdown(SAVING_FREQUENCY.PER_MONTH);
    await yourBudget.continueButton.click();

    await results.resetCalculatorButton.click();
    expect(results.url).toContain('/en/1?restart=true');
  });
});
