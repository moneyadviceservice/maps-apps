import { expect, test } from '@lib/test.lib';

const testScenarioData = [
  {
    locale: 'English',
    endpoint: '/en/pension-wise-appointment',
    startText: 'Start webchat',
    closeText: 'Close webchat',
  },
  {
    locale: 'Welsh',
    endpoint: '/cy/pension-wise-appointment',
    startText: 'Dechrau gwesgwrs',
    closeText: 'Cau gwesgwrs',
  },
];

test.describe('Help And Support Widget', () => {
  for (const scenario of testScenarioData) {
    test(`displays webchat link within help and support section on the base page in ${scenario.locale}`, async ({
      basePage,
      setCookieControl,
    }) => {
      await setCookieControl();

      const { webChatComponent } = basePage;
      const { webChatLink } = webChatComponent;

      await basePage.goto(scenario.endpoint);

      await expect(basePage.webChatComponent.container).toBeVisible();
      await expect(basePage.webChatComponent.title).toBeVisible();
      await expect(basePage.webChatComponent.appointmentLink).toBeVisible();
      await expect(basePage.webChatComponent.appointmentLink).toHaveAttribute(
        'href',
      );

      // Start chat
      await expect(webChatLink).toContainText(scenario.startText);
      await basePage.webChatComponent.startWebChat();
      await expect(webChatLink).toContainText(scenario.closeText);

      // Close chat
      await basePage.webChatComponent.closeWebChat();
      await expect(webChatLink).toContainText(scenario.startText);
    });
  }
});
