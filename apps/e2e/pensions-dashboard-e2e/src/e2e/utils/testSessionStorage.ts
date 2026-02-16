import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join, resolve } from 'node:path';
import { Cookie, Page } from '@maps/playwright';

import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from './commonHelpers';

export interface ApplySessionParams {
  /**
   * To reduce flakyness, every session should be explicit in where it starts.
   */
  sessionStartUrl: string;
}

const sessionsDir = resolve(__dirname, '../sessions');
const getSessionPath = (fileName: string) =>
  join(sessionsDir, `${fileName}.session.json`);

/**
 * Save's the current session (cookies) as a file.
 */
export async function saveCurrentSession(page: Page, sessionName: string) {
  const sessionPath = getSessionPath(sessionName);

  // Create sessions folder if it doesn't already exist.
  mkdirSync(sessionsDir, { recursive: true });

  // Delete an existing session if it exists.
  if (existsSync(sessionPath)) {
    rmSync(sessionPath);
  }

  // Store cookies in a file for later.
  const allCookies: Cookie[] = await page.context().cookies();

  console.log(`Creating session "${sessionName}"`);
  writeFileSync(sessionPath, JSON.stringify(allCookies, null, 2));
}

/**
 * Returns a session object, containing if there is a session and a function to re-apply them.
 */
export function getSavedSession(page: Page, sessionName: string) {
  const context = page.context();
  const sessionPath = getSessionPath(sessionName);
  const noSession = {
    sessionExists: false,
    applySession: async () => {
      throw new Error(
        `Session did not exist for "${sessionName}", check "sessionExists" property first.`,
      );
    },
  };

  if (existsSync(sessionPath)) {
    console.log(`Found session "${sessionName}"`);

    const sessionFileContents = readFileSync(sessionPath, 'utf-8');
    const sessionFileCookies: Cookie[] = JSON.parse(sessionFileContents);

    // Check if it's still valid.
    const mhpdSessionConfig = sessionFileCookies.find(
      (c) => c.name === 'mhpdSessionConfig',
    );
    const mhpdSessionJson = JSON.parse(mhpdSessionConfig.value);
    const sessionStart = mhpdSessionJson.sessionStart;
    const now = Date.now();
    const diffSec = (now - sessionStart) / 1000;
    const diffMin = diffSec / 60;

    // Delete the session if it's not valid anymore.
    if (diffMin > 30) {
      console.log(`Expired session was found for: "${sessionName}"`);
      rmSync(sessionPath);
      return noSession;
    }

    return {
      sessionExists: true,
      applySession: async (params: ApplySessionParams) => {
        await context.addCookies(sessionFileCookies);
        await page.goto(params.sessionStartUrl);
      },
    };
  }

  console.log(`Could not find session "${sessionName}"`);
  return noSession;
}

// Common steps

const goToPensionsFound = async (page: Page, scenarioName: string) => {
  await commonHelpers.setCookieConsentAccepted(page);
  await commonHelpers.navigateToEmulator(page);
  await scenarioSelectionPage.selectScenarioComposerDev(page, scenarioName);
  await welcomePage.welcomePageLoads(page);
  await welcomePage.clickWelcomeButton(page);
  await loadingPage.waitForPensionsToLoad(page);
  await pensionsFoundPage.waitForPensionsFound(page);
};

/**
 * Generic navigation function that handles session reuse or fresh login flow.
 */
async function navigateWithSession(
  page: Page,
  scenarioName: string,
  expectedEndUrl: string,
  postFoundAction?: (page: Page) => Promise<void>,
) {
  await page.goto('/');
  await commonHelpers.setCookieConsentAccepted(page);
  await page.reload(); // Reload to apply cookie

  const activeSession = getSavedSession(page, scenarioName);

  if (activeSession.sessionExists) {
    await activeSession.applySession({ sessionStartUrl: expectedEndUrl });
    return;
  }

  await goToPensionsFound(page, scenarioName);

  if (postFoundAction) {
    await postFoundAction(page);
  }

  await page.waitForURL(expectedEndUrl);
  await saveCurrentSession(page, scenarioName);
}

/**
 * Navigates to the Pensions Found page.
 */
async function navigateToPensionsFoundPage(page: Page, scenarioName: string) {
  await navigateWithSession(
    page,
    scenarioName,
    '/en/your-pension-search-results',
  );
}

/**
 * Navigates to the Pension Breakdown page.
 */
async function navigateToPensionBreakdown(page: Page, scenarioName: string) {
  await navigateWithSession(
    page,
    scenarioName,
    '/en/your-pension-breakdown',
    () => pensionsFoundPage.clickSeeYourPensions(page),
  );
}

/**
 * Navigates to the Pending Pensions page.
 */
async function navigateToPendingPensions(page: Page, scenarioName: string) {
  await navigateWithSession(page, scenarioName, '/en/pending-pensions', () =>
    pensionsFoundPage.clickSeePendingPensions(page),
  );
}

export const commonSessions = {
  navigateToPensionsFoundPage,
  navigateToPensionBreakdown,
  navigateToPendingPensions,
};
