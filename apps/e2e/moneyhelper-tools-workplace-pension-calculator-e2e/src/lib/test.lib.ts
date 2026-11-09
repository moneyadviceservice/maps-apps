import { test as base } from '@maps-react/playwright/fixtures/default.fixtures';

export * from '@maps-react/playwright/fixtures/default.fixtures';

/**
 * No page object as there are no tests.
 */
export const test = base.extend({});
