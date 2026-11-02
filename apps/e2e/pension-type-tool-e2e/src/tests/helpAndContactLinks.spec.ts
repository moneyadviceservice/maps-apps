import { helpAndContactData } from '@data/helpAndContact.data';
import { expect, test } from '@lib/test.lib';

test.describe('Pension Type Tool live-chat help text - Bug 59116', () => {
  test.beforeEach(async ({ setCookieControl }) => {
    await setCookieControl();
  });

  /** @tests 59931 - 59116 AC 1 Test Case 1 - Verify updated Welsh live-chat help text on question pages. */
  test('displays the updated Welsh live-chat help text on a question page', async ({
    commonComponent,
    helpAndContactComponent,
  }) => {
    const scenario = helpAndContactData.cy;
    await commonComponent.goto(scenario.questionPath);

    await expect(helpAndContactComponent.liveChatLine('cy')).toContainText(
      scenario.liveChat.text,
    );
    await expect(helpAndContactComponent.liveChatLink('cy')).toContainText(
      scenario.liveChat.linkText,
    );
    await expect(helpAndContactComponent.liveChatLink('cy')).toHaveAttribute(
      'href',
      scenario.liveChat.url,
    );
  });

  /** @tests 59116 AC 1 Test Case 2 - Verify updated Welsh live-chat help text on results pages. */
  test('displays the updated Welsh live-chat help text on the results page', async ({
    helpAndContactComponent,
    resultsComponent,
  }) => {
    const scenario = helpAndContactData.cy;
    await resultsComponent.gotoResults('cy', helpAndContactData.resultQuery);
    await resultsComponent.waitForResultsPage();

    await expect(helpAndContactComponent.liveChatLine('cy')).toContainText(
      scenario.liveChat.text,
    );
    await expect(helpAndContactComponent.liveChatLink('cy')).toContainText(
      scenario.liveChat.linkText,
    );
    await expect(helpAndContactComponent.liveChatLink('cy')).toHaveAttribute(
      'href',
      scenario.liveChat.url,
    );
  });

  /**
   * @tests 59936 - 59116 AC 1 Test Case 5: Regression - English live-chat help text remains unchanged.
   */
  test('keeps the English live-chat help text unchanged on question and results pages', async ({
    commonComponent,
    helpAndContactComponent,
    resultsComponent,
  }) => {
    const scenario = helpAndContactData.en;
    await commonComponent.goto(scenario.questionPath);

    await expect(helpAndContactComponent.liveChatLine('en')).toContainText(
      scenario.liveChat.text,
    );
    await expect(helpAndContactComponent.liveChatLink('en')).toContainText(
      scenario.liveChat.linkText,
    );
    await expect(helpAndContactComponent.liveChatLink('en')).toHaveAttribute(
      'href',
      scenario.liveChat.url,
    );

    await resultsComponent.gotoResults('en', helpAndContactData.resultQuery);
    await resultsComponent.waitForResultsPage();
    await expect(helpAndContactComponent.liveChatLine('en')).toContainText(
      scenario.liveChat.text,
    );
    await expect(helpAndContactComponent.liveChatLink('en')).toContainText(
      scenario.liveChat.linkText,
    );
    await expect(helpAndContactComponent.liveChatLink('en')).toHaveAttribute(
      'href',
      scenario.liveChat.url,
    );
  });
});
