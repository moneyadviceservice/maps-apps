import { Locator, Page } from '@lib/test.lib';

export class KeyboardUtils {
  static async pressUntilFocused(
    page: Page,
    locator: Locator,
    key: string,
  ): Promise<void> {
    for (let tabCount = 0; tabCount < 30; tabCount++) {
      await page.keyboard.press(key, { delay: 50 });

      if (
        await locator.evaluate((element) => element === document.activeElement)
      ) {
        return;
      }
    }

    throw new Error('Could not focus the requested element');
  }

  static async pressKey(
    page: Page,
    locator: Locator,
    key: string,
  ): Promise<void> {
    await locator.focus();
    await page.keyboard.press(key, { delay: 50 });
  }
}
