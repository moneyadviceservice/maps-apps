import { defineConfig } from '@maps/playwright';
import { workspaceRoot } from '@nx/devkit';

import * as testMuConfig from '@maps-react/playwright/testmu/config';

import baseConfig from './playwright.config';
import path = require('node:path');

const resolveE2EPath = (relativePath: string) =>
  path.join(workspaceRoot, `apps/e2e/${projectName}-e2e/${relativePath}`);

const projectName = process.env['PROJECT_NAME'] || 'pensions-dashboard';
const testDir = resolveE2EPath('src/e2e/tests');

export default defineConfig({
  timeout: 600000,

  // Extend from the base configuration file (functional test suite)
  ...baseConfig,
  testDir,

  fullyParallel: true,
  workers: testMuConfig.PARALLEL_RUNNERS,
  maxFailures: 15,
  retries: 3,

  projects: testMuConfig.ALL_DEVICES,

  webServer: undefined,
});
