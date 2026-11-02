import { readFileSync } from 'node:fs';
import * as path from 'node:path';
import { _android, chromium, webkit } from 'playwright';
import { workspaceRoot } from '@nx/devkit';
import { BrowserContext, Page, TestInfo } from '@playwright/test';

import * as config from './config';
import { LTCapabilities, PageProvider, ParsedConfig } from './types';

const TESTMU_WS_URL = 'wss://cdp.lambdatest.com/playwright';
const playwrightClientVersion = '1.56.1';
const projectRoot = path.join(__dirname, '../../');

/**
 * Check the version of playwright is correct, there is limited support for modern versions.
 */
const pkgPath = path.join(workspaceRoot, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
const currentPwVersion = pkg?.devDependencies?.['@playwright/test'];

function checkPlaywrightVersion() {
  if (currentPwVersion !== playwrightClientVersion) {
    throw new Error(
      `
    It seems like the version of Playwright has been updated to ${currentPwVersion}
    LambdaTest/TestMu + Android/iOS only supports up to ${playwrightClientVersion} at this time.

    To run the LambdaTest/TestMu tests locally, it's recommended that you run:

        npm install --no-save playwright@${playwrightClientVersion}

    This will install the lower playwright version without updating the package.json, remember to re-install afterwards.
    `,
    );
  }
}

function checkCredentials() {
  if (!config.credentials.username || !config.credentials.accessKey) {
    throw new Error(
      'No TestMu/LambdaTest credentials were found, ensure that both LT_USERNAME and LT_ACCESS_KEY env variables are set.',
    );
  }
}

/**
 * Returns an identifier for grouping runs in the TestMu dashboard.
 * If there is a TESTMU_BUILD_ID specified, it will use that.
 */
const createRandomId = (length: number) =>
  process.env.TESTMU_BUILD_ID ??
  (process.ppid * 123456).toString(16).slice(0, length + 1);

/**
 * Builds the endpoint for TestMu's websocket.
 */
const getTestMuUrl = (caps: LTCapabilities) =>
  `${TESTMU_WS_URL}?capabilities=${encodeURIComponent(JSON.stringify(caps))}`;

const createPage = async (context: BrowserContext): Promise<Page> => {
  const page = await context.newPage();
  if (!page) {
    throw new Error('Failed to create TestMu/LambdaTest page instance.');
  }

  return page;
};

const parseConfig = (configName: string): ParsedConfig => {
  const [configDetails] = configName.split('@lambdatest');
  const [systemName = '', version = '', platformName = ''] =
    configDetails.split(':');

  return {
    systemName,
    version,
    platformName,
    isMobile: /android|ios/i.test(configName),
  };
};

const connect = (projectName: string, testName: string) => {
  const capabilities = createCapabilities(projectName, testName);

  if (projectName.includes('android')) {
    return androidConnect(capabilities);
  }

  if (projectName.includes('ios')) {
    return iOSConnect(capabilities);
  }

  return desktopConnect(capabilities);
};

/**
 * Sets the status of the build to whatever is in the test info.
 */
export const setTestMuStatus = async (page: Page, testInfo: TestInfo) => {
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
 * Provides either the local Playwright page or a TestMu page for the current test.
 */
export async function provideTestMuPage(
  page: Page,
  provide: PageProvider,
  testInfo: TestInfo,
): Promise<void> {
  if (!testInfo.project.name.includes('lambdatest')) {
    return provide(page);
  }

  checkPlaywrightVersion();
  checkCredentials();

  const testName = testInfo.titlePath.slice(1).join(' - ');
  let testMuPage: Page | undefined;

  try {
    testMuPage = await connect(testInfo.project.name, testName);
    await provide(testMuPage);

    // This happens after the test has finished.
    await setTestMuStatus(testMuPage, testInfo);
  } catch (error) {
    console.error('Error during TestMu/LambdaTest execution:', error);
    throw error;
  } finally {
    await testMuPage?.close().catch(() => undefined);
  }
}

/**
 * Updates the default capabilities to align to what configuration has been chosen
 * Ideally this should be a pure function, however this code was given by TestMu/LambdaTest.
 */
export const createCapabilities = (configName: string, testName: string) => {
  const parsed = parseConfig(configName);

  const buildName = `[${
    process.env.NX_TASK_TARGET_PROJECT ?? 'Unknown application'
  }] [${parsed.platformName}] [${createRandomId(5)}]`;

  const defaultCapabilities: LTCapabilities = {
    browserName: 'Chrome',
    browserVersion: 'latest',
    'LT:Options': {
      platform: 'Windows 10',
      build: buildName,
      name: 'Playwright Test',
      user: config.credentials.username,
      accessKey: config.credentials.accessKey,
      network: true,
      video: true,
      console: true,
      tunnel: false,
      tunnelName: '',
      geoLocation: '',
      queueTimeout: 600,
    },
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

  return parsed.isMobile
    ? createMobileCapabilities(parsed, testName)
    : createDesktopCapabilities(parsed, testName);
};

/**
 * Gets the storage state file that should be generated on a global setup execution.
 * Using a specific function helps with error handling, and checks file exists first.
 */
function getStorageStateFile() {
  if (process.env.IGNORE_NETLIFY_AUTHENTICATION) return undefined;
  try {
    const storageStatePath = path.join(projectRoot, 'storageState.json');
    const storageState = readFileSync(storageStatePath, 'utf-8');
    return {
      path: storageStatePath,
      data: storageState,
    };
  } catch (e: unknown) {
    if (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT') {
      throw new Error(
        'Could not find the storageState file, please make sure that the global-setup.ts file has executed before running the TestMu/LambdaTest configuration.\n' +
          'The global-setup.ts file fetches a cookie that is required for authentication on netlify password pages, without it, the tests will fail for 429 Too Many Requests.\n\n' +
          'A reason this might occur: The tests were run through Playwright as opposed to nx, please ensure you are using `npx nx run pensions-dashboard-e2e:e2e-testmu:{DEVICE_NAME}`',
      );
    }

    throw e;
  }
}

/**
 * Creates an Android session in LambdaTest.
 * Returns a new page in that session.
 */
export async function androidConnect(caps: LTCapabilities) {
  const device = await _android.connect(getTestMuUrl(caps));

  await device.shell('am force-stop com.android.chrome');

  const browser = await device.launchBrowser({
    permissions: ['clipboard-read', 'clipboard-write'],
    baseURL: process.env.BASE_URL,
  });

  if (!browser) throw new Error('Failed to create browser context.');

  // Dirty hack as I cannot find a storageState property on a new context.
  const storageState = getStorageStateFile();
  if (storageState) {
    const storageStateData = JSON.parse(storageState.data);
    await browser.addCookies(storageStateData.cookies);
  }

  return createPage(browser);
}

/**
 * Creates an iOS session in TestMu/LambdaTest.
 * Returns a new page in that session.
 */
export async function iOSConnect(caps: LTCapabilities) {
  const device = await webkit.connect(getTestMuUrl(caps));

  const storageState = getStorageStateFile();
  const context = await device.newContext({
    hasTouch: true,
    isMobile: true,
    storageState: storageState?.path,
    baseURL: process.env.BASE_URL,
  });

  return createPage(context);
}

/**
 * Creates an Desktop session in TestMu/LambdaTest.
 * Returns a new page in that session.
 */
export async function desktopConnect(caps: LTCapabilities) {
  const device = await chromium.connect(getTestMuUrl(caps));

  const storageState = getStorageStateFile();
  const context = await device.newContext({
    storageState: storageState?.path,
    baseURL: process.env.BASE_URL,
  });

  return createPage(context);
}
