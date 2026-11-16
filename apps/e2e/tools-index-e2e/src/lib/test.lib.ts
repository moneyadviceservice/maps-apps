import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

/**
 * No page object created, nothing to test.
 */
export const test = base.extend({});
