import { join } from 'node:path';
import { workspaceRoot } from '@nx/devkit';
import type { PlaywrightTestConfig } from '@playwright/test';

interface DefaultPlaywrightConfig {
  config: PlaywrightTestConfig;
  timeouts: {
    long: number;
    medium: number;
    short: number;
  };
}

export function generateConfig(projectName: string): DefaultPlaywrightConfig {
  const reportDir = join(
    workspaceRoot,
    `apps/e2e/${projectName}-e2e/playwright-report`,
  );

  return {
    config: {
      retries: 2,
      reporter: process.env.CI
        ? [['list'], ['html', { outputFolder: reportDir }]]
        : 'list',
    },
    timeouts: {
      long: 100_000,
      medium: 25_000,
      short: 8_000,
    },
  };
}
