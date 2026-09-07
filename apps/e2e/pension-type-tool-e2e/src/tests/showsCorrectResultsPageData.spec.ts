import { expect, test } from 'src/lib/test.lib';
import { CheckYourAnswersComponent } from '@pages/components/checkYourAnswers.component';
import { CommonComponent } from '@pages/components/commonComponent.component';

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
  date1995 = '0',
  date1996 = '1',
  date2001 = '2',
  dontKnow = '3',
}
export type dateSelectionKey = keyof typeof DATESELECTION;

async function progressToResults(
  commonComponent: CommonComponent,
  checkYourAnswersComponent: CheckYourAnswersComponent,
  setUpBy: SelectionKey,
  pensionComeFrom: SelectionKey,
  pensionProvider?: SelectionKey,
  startDate?: dateSelectionKey,
) {
  await expect(commonComponent.title).toContainText(titles.setUpBy);
  await commonComponent.getCheckbox(SELECTION[setUpBy]).click();
  await commonComponent.continueButton.click();
  await expect(commonComponent.title).toContainText(titles.pensionComeFrom);
  await commonComponent.getCheckbox(SELECTION[pensionComeFrom]).click();
  await commonComponent.continueButton.click();

  if (pensionProvider && startDate != null) {
    await expect(commonComponent.title).toContainText(titles.pensionProvider);
    await commonComponent.getCheckbox(SELECTION[pensionProvider]).click();
    await commonComponent.continueButton.click();
    await expect(commonComponent.title).toContainText(titles.pensionStartDate);
    await commonComponent.getCheckbox(DATESELECTION[startDate]).click();
    await commonComponent.continueButton.click();
  }
  await expect(commonComponent.title).toContainText(titles.checkYourAnswers);
  await checkYourAnswersComponent.continueButton.click();
}

test.describe('Workplace Pension Calculator', () => {
  test.beforeEach(async ({ commonComponent, setCookieControl }) => {
    await setCookieControl();
    await commonComponent.goto('/en/pension-type/question-1');
  });

  /**
   * @tests 56326 - Shows correct results heading based on answers
   */
  /**
   * @tests 56330 - Shows correct results button based on answers
   */
  test('Should show correct results heading from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date1996',
    );
    await expect(commonComponent.title).toContainText(headings.en[0]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date2001',
    );
    await expect(commonComponent.title).toContainText(headings.en[1]);
    await commonComponent.goto('/en/pension-type/question-1');
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'dontKnow',
    );
    await expect(commonComponent.title).toContainText(headings.en[2]);
  });

  test('Should show correct results button from answers', async ({
    commonComponent,
    checkYourAnswersComponent,
    resultsComponent,
  }) => {
    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date2001',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeVisible();
    await commonComponent.goto('/en/pension-type/question-1');

    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'No',
      'No',
      'date1995',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeHidden();
    await commonComponent.goto('/en/pension-type/question-1');

    await progressToResults(
      commonComponent,
      checkYourAnswersComponent,
      'Yes',
      'Yes',
    );
    await expect(resultsComponent.bookAppointmentButton).toBeHidden();
  });
});
