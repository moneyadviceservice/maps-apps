import { expect, test } from 'src/lib/test.lib';
import { CheckYourAnswersComponent } from '@pages/components/checkYourAnswers.component';

import testData from '../data/pensionTypeData.json';

const headings = testData.headings;
const titles = testData.titles;
const dontKnowString = "Don't know";

export enum SELECTION {
  Yes = '0',
  No = '1',
  dontKnow = '2',
}
export type SelectionKey = keyof typeof SELECTION;

export enum DATESELECTION {
  date1995 = '0',
  date1996 = '1',
  date2001 = '2',
  dontKnow = '3',
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
  ).toContainText(dontKnowString);
  await expect(
    await checkYourAnswersComponent.answerTitle('pensionStartDate'),
  ).toContainText(titles.pensionStartDate);
  await expect(
    await checkYourAnswersComponent.answerRow('pensionStartDate'),
  ).toContainText('1996 to 2000');
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
    await commonComponent.getCheckbox(DATESELECTION['date1996']).click();
    await commonComponent.continueButton.click();

    await expect(commonComponent.title).toContainText(titles.checkYourAnswers);
    await validateAnswersGrid(checkYourAnswersComponent);

    await checkYourAnswersComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(headings.en[0]);
  });
});
