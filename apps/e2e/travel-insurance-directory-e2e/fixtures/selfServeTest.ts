export { expect } from '@playwright/test';

import * as fs from 'node:fs';
import * as path from 'node:path';
import { test as baseTest } from '@playwright/test';

import { AUTH_FILE } from '../helpers/auth.constants';
import {
  loginToSelfServe,
  resetSelfServe,
} from '../helpers/loginAndResetSelfServe';

export const test = baseTest.extend<
  { storageState: string },
  { workerStorageState: string }
>({
  workerStorageState: [
    async ({ browser }, applyFixture, workerInfo) => {
      const baseURL = workerInfo.project.use.baseURL;
      if (!baseURL) {
        throw new Error(
          'baseURL is not configured in playwright.config.ts use.baseURL',
        );
      }

      fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

      const context = await browser.newContext({ baseURL });
      const page = await context.newPage();
      await loginToSelfServe(page);
      await resetSelfServe(page);
      await context.storageState({ path: AUTH_FILE });
      await context.close();

      await applyFixture(AUTH_FILE);
    },
    { scope: 'worker' },
  ],

  storageState: ({ workerStorageState }, applyFixture) =>
    applyFixture(workerStorageState),
});
