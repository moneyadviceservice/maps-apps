import { ENV } from './env.lib';
import type { Page } from './test.lib';

export async function unlockDeployPreviewIfNeeded(page: Page): Promise<void> {
  const password = ENV.SITE_PASSWORD;
  if (!password) return;

  const passwordInput = page.locator('input[name="password"]');
  if (!(await passwordInput.isVisible())) return;

  await passwordInput.fill(password);
  await page.getByRole('button', { name: 'Submit' }).click();
}
