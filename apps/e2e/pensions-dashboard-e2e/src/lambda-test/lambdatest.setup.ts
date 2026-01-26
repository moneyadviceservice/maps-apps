/* eslint-disable no-restricted-imports */
// Rule allowed as it is core playwright functionality.

/**
 * LambdaTest Playwright Fixture
 * Import `test` from this file in your tests.
 */
import { readFileSync } from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { _android, chromium, webkit } from 'playwright';
import { ENV } from '@env';
import { Page, test as base, TestInfo } from '@playwright/test';

import { LTCapabilities } from './types';

const LT_WS_URL = 'wss://cdp.lambdatest.com/playwright';
const playwrightClientVersion = '1.56.1';
const projectRoot = path.join(__dirname, '../../');

/**
 * Check the version of playwright is correct, there is limited support for modern versions.
 */
const pkgPath = path.join(__dirname, '../../../../../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const currentPwVersion = pkg?.devDependencies?.['@playwright/test'];
if (currentPwVersion !== playwrightClientVersion) {
  throw new Error(
    `
    It seems like the version of Playwright has been updated to ${currentPwVersion}
    LambdaTest + Android/iOS only supports up to ${playwrightClientVersion} at this time.

    Please downgrade back to the supported playwright version or reach out to LambdaTest support.
    `,
  );
}

/**
 * Generates a build name that shows on the LambdaTest dashboard.
 */
const generateManualBuildName = () =>
  `Manual Run by ${
    os.userInfo().username || ENV.LT_USERNAME
  } @ ${new Date().toDateString()}`;

/**
 * Default capabilities provided by LambdaTest
 */
const defaultCapabilities: LTCapabilities = {
  browserName: 'Chrome',
  browserVersion: 'latest',
  'LT:Options': {
    platform: 'Windows 10',
    // eslint-disable-next-line no-restricted-properties
    build: process.env.COMMIT_HASH ?? generateManualBuildName(),
    name: 'Playwright Test',
    user: ENV.LT_USERNAME,
    accessKey: ENV.LT_ACCESS_KEY,
    network: true,
    video: true,
    console: true,
    tunnel: false,
    tunnelName: '',
    geoLocation: '',
  },
};

/**
 * Sets the status of the build to whatever is in the test info.
 */
const setLambdaTestStatus = async (page: Page, testInfo: TestInfo) => {
  const testStatus = {
    action: 'setTestStatus',
    arguments: {
      status: testInfo.status,
      remark: testInfo.error?.stack || testInfo.error?.message || '',
    },
  };
  await page.evaluate(
    () => undefined,
    `lambdatest_action: ${JSON.stringify(testStatus)}`,
  );
};

/**
 * Updates the default capabilities to align to what configuration has been chosen
 * Ideally this should be a pure function, however this code was given by LambdaTest.
 */
const createCapabilities = (configName: string, testName: string) => {
  type ParsedConfig = {
    systemName: string;
    version: string;
    platformName: string;
    isMobile: boolean;
  };

  const parseConfig = (configName: string): ParsedConfig => {
    const base = configName.split('@lambdatest')[0];
    const [systemName = '', version = '', platformName = ''] = base.split(':');
    const isMobile = /android|ios/i.test(configName);

    return { systemName, version, platformName, isMobile };
  };

  const createMobileCapabilities = (
    { systemName, version, platformName }: ParsedConfig,
    testName: string,
  ): LTCapabilities => ({
    ...defaultCapabilities,
    'LT:Options': {
      ...defaultCapabilities['LT:Options'],
      deviceName: systemName,
      platformVersion: version,
      platformName,
      name: testName,
      isRealMobile: true,
      playwrightClientVersion,
    },
    browserName: undefined,
    browserVersion: undefined,
  });

  const createDesktopCapabilities = (
    { systemName, version, platformName }: ParsedConfig,
    testName: string,
  ): LTCapabilities => ({
    ...defaultCapabilities,
    browserName: systemName || defaultCapabilities.browserName,
    browserVersion: version || defaultCapabilities.browserVersion,
    'LT:Options': {
      ...defaultCapabilities['LT:Options'],
      platform: platformName || defaultCapabilities['LT:Options'].platform,
      name: testName,
      accessibility: false,
      'accessibility.wcagVersion': '',
      'accessibility.bestPractice': false,
      'accessibility.needsReview': false,
    },
  });

  const parsed = parseConfig(configName);
  return parsed.isMobile
    ? createMobileCapabilities(parsed, testName)
    : createDesktopCapabilities(parsed, testName);
};

/**
 * Gets the storage state file that should be generated on a global setup execution.
 * Using a specific function helps with error handling, and checks file exists first.
 */
async function getStorageStateFile() {
  try {
    const storageStatePath = path.join(projectRoot, 'storageState.json');
    const storageState = readFileSync(storageStatePath, 'utf-8');
    return {
      path: storageStatePath,
      data: storageState,
    };
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error(
        'Could not find the storageState file, please make sure that the global-setup.ts file has executed before running the LambdaTest configuration.\n' +
          'The global-setup.ts file :fetches a cookie that is required for authentication on netlify password pages, without it, the tests will fail for 429 Too Many Requests.\n\n' +
          'A reason this might occur: The tests were ran through playwright as oppose to nx, please ensure you are using `npx nx run pensions-dashboard-e2e:e2e-lambdatest:{DEVICE_NAME}`',
      );
    } else throw e;
  }
}

/**
 * Creates an Android session in LambdaTest.
 * Returns a new page in that session.
 */
async function androidConnect(caps: LTCapabilities) {
  const device = await _android.connect(
    `${LT_WS_URL}?capabilities=${encodeURIComponent(JSON.stringify(caps))}`,
  );

  await device.shell('am force-stop com.android.chrome');

  const browser = await device.launchBrowser({
    permissions: ['clipboard-read', 'clipboard-write'],
    baseURL: ENV.BASE_URL,
  });
  if (!browser) throw new Error('Failed to create browser context.');

  // Dirty hack as I cannot find a storageState property on a new context.
  const storageState = await getStorageStateFile();
  const storageStateData = JSON.parse(storageState.data);
  await browser.addCookies(storageStateData.cookies);

  const page = await browser.newPage();
  if (!page) throw new Error('Failed to create LambdaTest page instance.');

  return page;
}

/**
 * Creates an iOS session in LambdaTest.
 * Returns a new page in that session.
 */
async function iOSConnect(caps: LTCapabilities) {
  const device = await webkit.connect(
    `${LT_WS_URL}?capabilities=${encodeURIComponent(JSON.stringify(caps))}`,
  );

  const storageState = await getStorageStateFile();
  const context = await device.newContext({
    hasTouch: true,
    isMobile: true,
    baseURL: ENV.BASE_URL,
    storageState: storageState.path,
  });

  const page = await context.newPage();
  if (!page) throw new Error('Failed to create LambdaTest page instance.');

  return page;
}

/**
 * Creates an Desktop session in LambdaTest.
 * Returns a new page in that session.
 */
async function desktopConnect(caps: LTCapabilities) {
  const device = await chromium.connect(
    `${LT_WS_URL}?capabilities=${encodeURIComponent(JSON.stringify(caps))}`,
  );

  const storageState = await getStorageStateFile();
  const context = await device.newContext({
    baseURL: ENV.BASE_URL,
    storageState: storageState.path,
  });

  const page = await context.newPage();
  if (!page) throw new Error('Failed to create LambdaTest page instance.');

  return page;
}

/** An extended test object from Playwright designed to be used for LambdaTest runs */
const test = base.extend<{
  page: Page;
}>({
  // eslint-disable-next-line
  page: async ({}, use, testInfo) => {
    if (!testInfo.project.name.includes('lambdatest')) {
      return use(undefined as unknown as Page);
    }

    if (!ENV.LT_USERNAME || !ENV.LT_ACCESS_KEY) {
      throw new Error(
        'No LambdaTest credentials were found, ensure that both LT_USERNAME and LT_ACCESS_KEY env variables are set.',
      );
    }

    const fullTestName = testInfo.titlePath.slice(1).join(' - ');
    const capabilities = createCapabilities(
      testInfo.project.name,
      fullTestName,
    );

    let page: Page;
    try {
      if (testInfo.project.name.includes('android')) {
        page = await androidConnect(capabilities);
      } else if (testInfo.project.name.includes('ios')) {
        page = await iOSConnect(capabilities);
      } else {
        page = await desktopConnect(capabilities);
      }

      await use(page);

      // Update the frontend test dashboard with the latest status.
      await setLambdaTestStatus(page, testInfo);
    } catch (error) {
      console.error('Error during LambdaTest execution:', error);
      throw error;
    } finally {
      if (page) await page.close().catch();
    }
  },
});

export default test;
