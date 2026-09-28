import { expect, test } from '@lib/test.lib';
import { CheckYourAnswersComponent } from '@pages/components/check-your-answers.component';

import testData from '../data/pensionTypeData.json';

const headings = testData.headings;
const titles = testData.titles;

export enum SELECTION {
  Yes = '0',
  No = '1',
  dontKnow = '2',
}
export type SelectionKey = keyof typeof SELECTION;

export enum DATESELECTION {
  date1999 = '0',
  date2000 = '1',
  dontKnow = '2',
}
export type dateSelectionKey = keyof typeof DATESELECTION;

async function validateAnswersGrid(
  checkYourAnswersComponent: CheckYourAnswersComponent,
) {
  await expect(
    await checkYourAnswersComponent.answerTitle('setUpBy'),
  ).toContainText(titles.setUpBy);
  await expect(
    await checkYourAnswersComponent.answerRow('setUpBy'),
  ).toContainText('Yes');
  await expect(
    await checkYourAnswersComponent.answerTitle('pensionComeFrom'),
  ).toContainText(titles.pensionComeFrom);
  await expect(
    await checkYourAnswersComponent.answerRow('pensionComeFrom'),
  ).toContainText('No');
  await expect(
    await checkYourAnswersComponent.answerTitle('pensionProvider'),
  ).toContainText(titles.pensionProvider);
  await expect(
    await checkYourAnswersComponent.answerRow('pensionProvider'),
  ).toContainText('Not sure');
  await expect(
    await checkYourAnswersComponent.answerTitle('pensionStartDate'),
  ).toContainText(titles.pensionStartDate);
  await expect(
    await checkYourAnswersComponent.answerRow('pensionStartDate'),
  ).toContainText('2000 or later');
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ commonComponent, setCookieControl }) => {
    await setCookieControl();
    await commonComponent.goto('/en/pension-type/question-1');
  });

  /**
   * @tests 56313 - Pension Type End to End Happy Path
   */
  test('Pension Type End to End Happy Path', async ({
    commonComponent,
    checkYourAnswersComponent,
  }) => {
    await expect(commonComponent.title).toContainText(titles.setUpBy);
    await commonComponent.getCheckbox(SELECTION['Yes']).click();
    await commonComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(titles.pensionComeFrom);
    await commonComponent.getCheckbox(SELECTION['No']).click();
    await commonComponent.continueButton.click();

    await expect(commonComponent.title).toContainText(titles.pensionProvider);
    await commonComponent.getCheckbox(SELECTION['dontKnow']).click();
    await commonComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(titles.pensionStartDate);
    await commonComponent.getCheckbox(DATESELECTION['date2000']).click();
    await commonComponent.continueButton.click();

    await expect(commonComponent.title).toContainText(titles.checkYourAnswers);
    await validateAnswersGrid(checkYourAnswersComponent);

    await checkYourAnswersComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(headings.en[2]);
  });
});
