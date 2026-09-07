/* eslint-disable no-restricted-imports */
// Rule is disabled, as this is the only case required.

/**
 *  imports BOTH the standard Playwright test and LambdaTest setup.
 * It uses an environment variable (E2E_TARGET) to decide which one to export.
 */
import { ENV } from '@env';
import { test as standardTest } from '@playwright/test';

import lambdaTest from '../../lambda-test/lambdatest.setup';

const test = ENV.E2E_TARGET === 'lambdatest' ? lambdaTest : standardTest;

// Re-export everything so we dont have to mix imports.
export * from '@playwright/test';
export { test };
