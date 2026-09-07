import { expect, test } from 'src/lib/test.lib';
import { CommonComponent } from '@pages/components/commonComponent.component';

import testData from '../data/pensionTypeData.json';

const titles = testData.titles;

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

async function progressToAnswers(commonComponent: CommonComponent) {
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
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ commonComponent, setCookieControl }) => {
    await setCookieControl();
    await commonComponent.goto('/en/pension-type/question-1');
  });

  /**
   * @tests 56314 - Skips questions after question 1
   */
  test('Edit Answer Should Skip To Results', async ({
    commonComponent,
    checkYourAnswersComponent,
  }) => {
    await progressToAnswers(commonComponent);

    await (await checkYourAnswersComponent.editAnswerRow('setUpBy')).click();
    await expect(commonComponent.title).toContainText(titles.setUpBy);
    await commonComponent.getCheckbox(SELECTION['No']).click();
    await commonComponent.continueButton.click();

    await expect(commonComponent.title).toContainText(titles.checkYourAnswers);
    await expect(
      await checkYourAnswersComponent.answerTitle('setUpBy'),
    ).toContainText(titles.setUpBy);
    await expect(
      await checkYourAnswersComponent.answerRow('setUpBy'),
    ).toContainText('No');
  });
});
