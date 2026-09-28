import { expect, test } from '@lib/test.lib';
import { CommonComponent } from '@pages/components/common-component.component';

import testData from '../data/pensionTypeData.json';

const { providers, providerResponses, questions, titles } = testData;

async function progressToProviderQuestion(
  commonComponent: CommonComponent,
  language: 'en' | 'cy',
) {
  await commonComponent.goto(`/${language}/pension-type/question-1`);
  await commonComponent.getCheckbox('0').click();
  await commonComponent.continueButton.click();
  await commonComponent.getCheckbox('1').click();
  await commonComponent.continueButton.click();
}

test.describe('Pension provider question', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  test('shows the updated English provider question content', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'en');

    await providerQuestionPage.waitForBrowserTitle(titles.pensionProvider);
    await expect(commonComponent.title).toHaveText(questions.en[2]);
    await expect(
      providerQuestionPage.description(titles.providerDescription),
    ).toBeVisible();

    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.en,
    );
  });

  test('shows the updated Welsh provider question content', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'cy');

    await providerQuestionPage.waitForBrowserTitle(titles.pensionProviderCy);
    await expect(commonComponent.title).toHaveText(questions.cy[2]);
    await expect(
      providerQuestionPage.description(titles.providerDescriptionCy),
    ).toBeVisible();

    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.cy,
    );
  });

  test('shows exactly 3 English response options', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'en');

    expect(await providerQuestionPage.responseCount).toBe(3);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.en,
    );
  });

  test('shows exactly 3 Welsh response options', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'cy');

    expect(await providerQuestionPage.responseCount).toBe(3);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.cy,
    );
  });

  test('keeps all English provider question content consistent', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'en');

    await providerQuestionPage.waitForBrowserTitle(titles.pensionProvider);
    await expect(commonComponent.title).toHaveText(questions.en[2]);
    await expect(
      providerQuestionPage.description(titles.providerDescription),
    ).toBeVisible();
    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.en,
    );
  });

  test('keeps all Welsh provider question content consistent', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'cy');

    await providerQuestionPage.waitForBrowserTitle(titles.pensionProviderCy);
    await expect(commonComponent.title).toHaveText(questions.cy[2]);
    await expect(
      providerQuestionPage.description(titles.providerDescriptionCy),
    ).toBeVisible();
    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.cy,
    );
  });

  test('preserves provider content when switching languages', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'en');
    await providerQuestionPage.languageSwitchLink.click();

    await expect(commonComponent.title).toHaveText(questions.cy[2]);
    await providerQuestionPage.waitForBrowserTitle(titles.pensionProviderCy);
    await expect(
      providerQuestionPage.description(titles.providerDescriptionCy),
    ).toBeVisible();
    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.cy,
    );

    await providerQuestionPage.languageSwitchLink.click();

    await expect(commonComponent.title).toHaveText(questions.en[2]);
    await providerQuestionPage.waitForBrowserTitle(titles.pensionProvider);
    await expect(
      providerQuestionPage.description(titles.providerDescription),
    ).toBeVisible();
    await expect(providerQuestionPage.providerItems).toHaveText(providers);
    await expect(providerQuestionPage.responseLabels).toHaveText(
      providerResponses.en,
    );
  });

  test('has no accessibility violations in English or Welsh', async ({
    commonComponent,
    providerQuestionPage,
  }) => {
    await progressToProviderQuestion(commonComponent, 'en');
    expect(await providerQuestionPage.getAccessibilityViolations()).toEqual([]);

    await providerQuestionPage.languageSwitchLink.click();
    expect(await providerQuestionPage.getAccessibilityViolations()).toEqual([]);
  });
});
