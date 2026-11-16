import AxeBuilder from '@axe-core/playwright';
import { Page } from '@playwright/test';

export interface AxeOptions {
  tags?: string[];
  exclude?: string[];
  timeoutMs?: number;
}

const DEFAULT_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * Runs AxeBuilder accessibility scan with a timeout and DOM stability check.
 */
export async function getAccessibilityViolations(
  page: Page,
  options: AxeOptions = {},
) {
  const {
    tags = DEFAULT_TAGS,
    exclude = ['iframe'],
    timeoutMs = 15_000,
  } = options;

  // Ensure DOM is ready before scanning
  await page.waitForLoadState('domcontentloaded').catch(() => {
    /* Ignore load state timeouts to proceed with scan */
  });

  let builder = new AxeBuilder({ page }).withTags(tags);

  for (const selector of exclude) {
    builder = builder.exclude(selector);
  }

  const axePromise = builder.analyze();

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            `AxeBuilder evaluation timed out after ${timeoutMs / 1000}s`,
          ),
        ),
      timeoutMs,
    ),
  );

  const { violations } = await Promise.race([axePromise, timeoutPromise]);
  return violations;
}
