import { defineConfig, devices } from '@maps/playwright';
import { workspaceRoot } from '@nx/devkit';

import baseConfig from './playwright.config';
import path = require('node:path');

const resolveE2EPath = (relativePath: string) =>
  path.join(workspaceRoot, `apps/e2e/${projectName}-e2e/${relativePath}`);

const projectName = process.env['PROJECT_NAME'] || 'pensions-dashboard';
const testDir = resolveE2EPath('src/e2e/tests');

export default defineConfig({
  // Extend from the base configuration file (functional test suite)
  ...baseConfig,

  testDir,

  // The following tests are out of scope for cross browser testing
  grepInvert: /@jsdisabled|@nocrossbrowser/,

  // Generic configuration
  webServer: undefined,
  fullyParallel: true,
  workers: 1,
  retries: 0,
  timeout: 600000,

  projects: [
    // --- Desktop Devices ---
    {
      name: 'chrome:latest:Windows 11@lambdatest',
      use: {
        browserName: undefined, // disable local launch
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'pw-firefox:latest:Windows 10@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: 'MicrosoftEdge:latest:Windows 11@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'MicrosoftEdge:latest:MacOS Sequoia@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'pw-firefox:latest:MacOS Tahoe@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'chrome:latest:MacOS Ventura@lambdatest',
      use: {
        browserName: undefined,
        viewport: { width: 1920, height: 1080 },
      },
    },

    // --- Android Devices ---
    {
      name: 'Galaxy.*:12:android@lambdatest',
      use: {
        browserName: undefined,
      },
    },
    {
      name: 'Galaxy.*:15:android@lambdatest',
      use: {
        browserName: undefined,
      },
    },
    {
      name: 'Galaxy.*:14:android@lambdatest',
      use: {
        browserName: undefined,
      },
    },
    {
      name: 'Pixel.*:15:android@lambdatest',
      use: {
        browserName: undefined,
      },
    },

    //--- Mobile Emulation for iOS ---
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest (iPhone 12)',
      use: {
        ...devices['iPhone 12'],
      },
    },
    {
      name: 'pw-webkit:latest:MacOS Ventura@lambdatest (iPhone 15 Pro Max)',
      use: {
        ...devices['iPhone 16'],
        viewport: { width: 393, height: 852 },
      },
    },
  ],
});
