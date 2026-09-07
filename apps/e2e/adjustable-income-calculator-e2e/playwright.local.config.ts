import { defineConfig } from '@playwright/test';

const baseURL = process.env['BASE_URL'] || 'http://localhost:4321';
const commonTimeout = 100_000;

export default defineConfig({
  timeout: commonTimeout,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL,
    javaScriptEnabled: true,
    actionTimeout: commonTimeout,
    navigationTimeout: commonTimeout,
  },
  expect: {
    timeout: commonTimeout,
  },
});
